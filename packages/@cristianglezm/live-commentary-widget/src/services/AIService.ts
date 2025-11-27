import type { VlmSettings, LoadingState, ChatMessage, CommentaryPrompts } from '../types';
import { DEFAULT_PROMPTS } from '../constants';

export type LoadingCallback = (state: Partial<LoadingState> & { _workerEvent?: any }) => void;

/**
 * Defines the contract for any AI provider.
 */
export interface AIProvider {
  /**
   * Generates parsed comments directly (Legacy/Default behavior).
   */
  generateComment(
      base64Image: string, 
      settings: VlmSettings,
      history: ChatMessage[],
      userPrompt?: string,
      onProgress?: LoadingCallback,
      prompts?: CommentaryPrompts,
      contextData?: Record<string, any>
  ): Promise<string[]>;

  /**
   * Fetches the raw string response from the LLM.
   */
  fetchRawResponse(
      base64Image: string, 
      settings: VlmSettings,
      history: ChatMessage[],
      userPrompt?: string,
      onProgress?: LoadingCallback,
      prompts?: CommentaryPrompts,
      contextData?: Record<string, any>
  ): Promise<string>;

  /**
   * Parses a raw string into comments using the standard <comment> format.
   */
  parseResponse(text: string): string[];
}

/**
 * Parses a string for content within <comment> tags or falls back to line-based parsing.
 * @param text The text to parse.
 * @returns An array of comments.
 */
function parseComments(text: string): string[] {
    if (!text) return [];

    // 1. Try extracting strict <comment> tags (allow multiline, case-insensitive)
    const commentRegex = /<comment>([\s\S]*?)<\/comment>/gi;
    const matches = [...text.matchAll(commentRegex)];
    if (matches.length > 0) {
        return matches.map(match => match[1].trim()).filter(Boolean);
    }
    
    // 2. Fallback: Treat the whole text as potential comments
    // Clean up code blocks if they exist (unwrap content)
    let cleanText = text.replace(/```[\w-]*\n?([\s\S]*?)```/g, '$1').trim();
    
    // Remove specific XML-like tags if they linger without matching the regex above
    cleanText = cleanText.replace(/<\/?comment>/gi, '');

    const lines = cleanText.split('\n')
        .map(line => line.trim())
        .filter(line => {
            if (line.length === 0) return false;
            // Filter out meta-commentary lines often output by models
            const lower = line.toLowerCase();
            if (lower.startsWith('here are') || lower.endsWith(':') || lower.startsWith('sure')) return false;
            return true;
        });

    if (lines.length > 0) {
        return lines;
    }
    
    return [];
}

class RemoteAIProvider implements AIProvider {
    
    async fetchRawResponse(
        base64Image: string, 
        settings: VlmSettings,
        history: ChatMessage[],
        userPrompt?: string,
        onProgress?: LoadingCallback,
        prompts: CommentaryPrompts = DEFAULT_PROMPTS,
        contextData?: Record<string, any>
    ): Promise<string> {
      if (!settings.remoteUrl) {
        throw new Error("Remote server URL is not configured.");
      }

      // Construct Context String
      const recentHistory = history.slice(-8).map(msg => `${msg.username}: ${msg.text}`).join('\n');
      
      let finalPrompt = prompts.interval;
      if (userPrompt) {
          finalPrompt = prompts.chat.replace('{{userPrompt}}', userPrompt);
      }

      let contextString = "";
      if (contextData && Object.keys(contextData).length > 0) {
          contextString = `\nCurrent Application State/Stats:\n${JSON.stringify(contextData, null, 2)}\nUse this data to inform your commentary.`;
      }
      
      // Combine the static persona prompt with the dynamic history and specific task
      const systemInstruction = `
${prompts.system}

${contextString}

Chat History:
${recentHistory}

Task: Analyze the attached image. ${userPrompt ? 'Respond to the user input.' : 'Generate new comments.'}
      `;

      const payload = {
        model: settings.model || "gpt-4o",
        messages: [
          {
              role: 'system',
              content: systemInstruction
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: finalPrompt },
              { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
            ],
          },
        ],
        max_tokens: 256,
        temperature: settings.temperature,
        top_p: settings.topP,
      };

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (settings.apiKey) {
        headers['Authorization'] = `Bearer ${settings.apiKey}`;
      }

      try {
        const response = await fetch(settings.remoteUrl, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Remote VLM Error:", response.status, errorText);
            throw new Error(`Remote VLM Error: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data || !Array.isArray(data.choices)) {
          console.error("Invalid response structure:", data);
          throw new Error("Invalid response structure from remote VLM server.");
        }
        
        const text = data.choices[0]?.message?.content;
        return text || "";

      } catch (error) {
        if (error instanceof Error && (error.message.startsWith('Remote VLM Error:') || error.message.startsWith('Invalid response structure'))) {
          throw error;
        }
        console.error("Error generating comment from Remote VLM:", error);
        throw new Error("Failed to connect to remote VLM server.");
      }
    }

    parseResponse(text: string): string[] {
        return parseComments(text);
    }

    // Compat method
    async generateComment(
        base64Image: string, 
        settings: VlmSettings,
        history: ChatMessage[],
        userPrompt?: string,
        onProgress?: LoadingCallback,
        prompts?: CommentaryPrompts,
        contextData?: Record<string, any>
    ): Promise<string[]> {
        const text = await this.fetchRawResponse(base64Image, settings, history, userPrompt, onProgress, prompts, contextData);
        return this.parseResponse(text);
    }
}

const remoteProvider = new RemoteAIProvider();

export const getAIProvider = (): AIProvider => {
    return remoteProvider;
};
