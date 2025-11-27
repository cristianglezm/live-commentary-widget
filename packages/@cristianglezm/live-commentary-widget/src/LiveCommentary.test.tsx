import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Mock } from 'vitest';
import { LiveCommentary } from './LiveCommentary';
import { getAIProvider } from './services/AIService';

// Setup mock for scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// Mock the AI service
vi.mock('./services/AIService', () => {
  // Define the mock functions once so they are consistent across calls
  const fetchRawResponse = vi.fn();
  const parseResponse = vi.fn();
  const generateComment = vi.fn();
  
  const provider = {
    fetchRawResponse,
    parseResponse,
    generateComment,
  };

  return {
    getAIProvider: () => provider,
  };
});

describe('LiveCommentary', () => {
  const mockProvider = getAIProvider();
  
  let mockVideoTrack: {
    stop: Mock;
    onended: ((this: MediaStreamTrack, ev: Event) => any) | null;
    addEventListener: Mock;
    removeEventListener: Mock;
    dispatchEvent: Mock;
  };

  let mockMediaStream: {
    getVideoTracks: Mock;
    getTracks: Mock;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default responses
    (mockProvider.fetchRawResponse as Mock).mockResolvedValue('<comment>Test comment</comment>');
    (mockProvider.parseResponse as Mock).mockReturnValue(['Test comment']);
    
    // Stable mock tracks
    mockVideoTrack = {
      stop: vi.fn(),
      onended: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };

    mockMediaStream = {
      getVideoTracks: vi.fn(() => [mockVideoTrack]),
      getTracks: vi.fn(() => [mockVideoTrack]),
    };

    // Mock navigator.mediaDevices
    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getDisplayMedia: vi.fn().mockResolvedValue(mockMediaStream),
      },
      writable: true,
      configurable: true,
    });
    
    // Mock video element behavior
    window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    
    Object.defineProperties(window.HTMLVideoElement.prototype, {
        readyState: { writable: true, configurable: true, value: 4 },
        videoWidth: { writable: true, configurable: true, value: 640 },
        videoHeight: { writable: true, configurable: true, value: 480 }
    });

    // Mock Canvas context
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
        drawImage: vi.fn(),
    } as unknown as CanvasRenderingContext2D);
    
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/jpeg;base64,imagedata');
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders initial welcome messages', async () => {
    render(<LiveCommentary />);
    expect(await screen.findByText(/Welcome! Click Play/)).toBeInTheDocument();
    expect(screen.getByText('Paused')).toBeInTheDocument();
  });

  it('starts capturing successfully when permission is granted', async () => {
    render(<LiveCommentary />);
    const playButton = screen.getByLabelText('Start commentary');
    
    await act(async () => {
      fireEvent.click(playButton);
    });

    expect(await screen.findByText('Listening to stream...')).toBeInTheDocument();
  });

  it('shows an error message if getDisplayMedia fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (navigator.mediaDevices.getDisplayMedia as any).mockRejectedValue(new Error('Permission denied'));

    render(<LiveCommentary />);
    const playButton = screen.getByLabelText('Start commentary');

    await act(async () => {
      fireEvent.click(playButton);
    });

    expect(await screen.findByText(/Permission denied/)).toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('stops capturing when pause button is clicked', async () => {
    render(<LiveCommentary />);
    const playButton = screen.getByLabelText('Start commentary');

    await act(async () => {
      fireEvent.click(playButton);
    });
    expect(await screen.findByText('Listening to stream...')).toBeInTheDocument();

    const pauseButton = screen.getByLabelText('Pause commentary');
    
    await act(async () => {
        fireEvent.click(pauseButton);
    });

    expect(await screen.findByText('Paused')).toBeInTheDocument();
    expect(mockVideoTrack.stop).toHaveBeenCalled();
  });

  it('stops capturing when the media stream ends (e.g. user stops sharing)', async () => {
    render(<LiveCommentary />);
    const playButton = screen.getByLabelText('Start commentary');

    await act(async () => {
      fireEvent.click(playButton);
    });

    expect(await screen.findByText('Listening to stream...')).toBeInTheDocument();

    // Simulate browser stopping the stream
    await act(async () => {
        if (mockVideoTrack.onended) {
            mockVideoTrack.onended.call(mockVideoTrack as unknown as MediaStreamTrack, new Event('ended'));
        }
    });

    expect(await screen.findByText('Paused')).toBeInTheDocument();
  });

  it('fetches and displays comments from the AI provider', async () => {
    vi.useFakeTimers();
    (mockProvider.fetchRawResponse as Mock).mockResolvedValue('<comment>AI Comment 1</comment>');
    (mockProvider.parseResponse as Mock).mockReturnValue(['AI Comment 1']);

    render(<LiveCommentary config={{ captureInterval: 2.0 }} />); 
    
    await act(async () => {
      fireEvent.click(screen.getByLabelText('Start commentary'));
      // Flush async startCapture and initial effects
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });

    // Advance time to allow capture interval to trigger
    await act(async () => {
        vi.advanceTimersByTime(2100); 
    });
    
    // Flush the AI call promise
    await act(async () => {
       await Promise.resolve();
    });

    expect(mockProvider.fetchRawResponse).toHaveBeenCalled();

    // Advance time to allow comment queue loop to display (2.5s + random)
    await act(async () => {
        vi.advanceTimersByTime(4000);
    });
    
    expect(screen.getByText('AI Comment 1')).toBeInTheDocument();
  });
});
