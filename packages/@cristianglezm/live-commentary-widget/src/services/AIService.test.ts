import { getAIProvider } from './AIService';
import { DEFAULT_SETTINGS } from '../constants';
import type { VlmSettings } from '../types';
import type { MockInstance } from 'vitest';
import '@testing-library/jest-dom';

const provider = getAIProvider();

describe('AIService', () => {
  describe('RemoteAIProvider', () => {
    const mockSettings: VlmSettings = {
      ...DEFAULT_SETTINGS,
      remoteUrl: 'http://localhost:8080/v1/chat/completions',
      apiKey: 'test-key',
    };

    let fetchSpy: MockInstance;

    beforeAll(() => {
      // Ensure global.fetch exists for JSDOM environment before spying on it
      if (!globalThis.fetch) {
        globalThis.fetch = vi.fn();
      }
    });

    beforeEach(() => {
      // Spy on the global fetch function to intercept network calls
      fetchSpy = vi.spyOn(globalThis, 'fetch');
    });

    afterEach(() => {
      // Restore the original implementation after each test
      vi.restoreAllMocks();
    });

    it('throws an error if remoteUrl is not configured', async () => {
      const settingsWithoutUrl = { ...mockSettings, remoteUrl: '' };
      await expect(provider.generateComment('image', settingsWithoutUrl, [], 'prompt')).rejects.toThrow(
        'Remote server URL is not configured.'
      );
      // Ensure no network call was made
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('sends a correctly formatted request with API key', async () => {
      const mockApiResponse = { choices: [{ message: { content: '<comment>Test</comment>' } }] };
      fetchSpy.mockResolvedValue(new Response(JSON.stringify(mockApiResponse)));

      await provider.generateComment('base64image', mockSettings, [], 'prompt text');

      expect(fetchSpy).toHaveBeenCalledWith(
        mockSettings.remoteUrl,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${mockSettings.apiKey}`,
          },
          body: expect.any(String),
        })
      );

      const body = JSON.parse((fetchSpy.mock.calls[0][1] as RequestInit).body as string);
      // The provider constructs a user message at index 1 (index 0 is system)
      // And wraps the user prompt.
      expect(body.messages[1].role).toBe('user');
      expect(body.messages[1].content[0].text).toContain('prompt text');
      expect(body.messages[1].content[1].image_url.url).toContain('base64image');
    });

    it('parses comments correctly from a successful response', async () => {
      const mockResponseContent = `<comment>Funny comment 1</comment><comment>Sarcastic comment 2</comment>`;
      const mockApiResponse = { choices: [{ message: { content: mockResponseContent } }] };
      fetchSpy.mockResolvedValue(new Response(JSON.stringify(mockApiResponse)));

      const comments = await provider.generateComment('image', mockSettings, [], 'prompt');

      expect(comments).toEqual(['Funny comment 1', 'Sarcastic comment 2']);
    });

    it('handles fetch errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      fetchSpy.mockRejectedValue(new Error('Network error'));

      await expect(provider.generateComment('image', mockSettings, [], 'prompt')).rejects.toThrow(
        'Failed to connect to remote VLM server.'
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error generating comment from Remote VLM:", new Error('Network error'));
      consoleErrorSpy.mockRestore();
    });

    it('throws a parsing error for an unexpected response structure', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      // Simulate a valid JSON response but with a missing 'choices' array
      const mockInvalidApiResponse = { data: 'some other structure' };
      fetchSpy.mockResolvedValue(new Response(JSON.stringify(mockInvalidApiResponse)));

      await expect(provider.generateComment('image', mockSettings, [], 'prompt')).rejects.toThrow(
        'Invalid response structure from remote VLM server.'
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith("Invalid response structure:", mockInvalidApiResponse);
      consoleErrorSpy.mockRestore();
    });

    it('handles an empty choices array gracefully', async () => {
      // Simulate a response where the choices array is empty
      const mockEmptyChoicesResponse = { choices: [] };
      fetchSpy.mockResolvedValue(new Response(JSON.stringify(mockEmptyChoicesResponse)));

      const comments = await provider.generateComment('image', mockSettings, [], 'prompt');

      // An empty array is a reasonable result in this case
      expect(comments).toEqual([]);
    });

    it('falls back to plain text parsing if tags are missing', async () => {
      // Simulate a response where the AI didn't generate valid comment tags but sent text
      const mockApiResponse = { choices: [{ message: { content: 'No tags here, just text.' } }] };
      fetchSpy.mockResolvedValue(new Response(JSON.stringify(mockApiResponse)));

      const comments = await provider.generateComment('image', mockSettings, [], 'prompt');

      // Expect the fallback logic to catch the text
      expect(comments).toEqual(['No tags here, just text.']);
    });

    it('handles non-ok responses gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      fetchSpy.mockResolvedValue(
        new Response('Server exploded', {
          status: 500,
          statusText: 'Internal Server Error',
        })
      );

      await expect(provider.generateComment('image', mockSettings, [], 'prompt')).rejects.toThrow(
        'Remote VLM Error: Internal Server Error'
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith("Remote VLM Error:", 500, 'Server exploded');
      consoleErrorSpy.mockRestore();
    });
  });
});
