export interface ChatMessage {
  id: string;
  username: string;
  color: string;
  text: string;
  attachment?: string; // Base64 string of the reference image
}

export interface ProgressItem {
  file: string;
  status: string;
  progress: number;
  total: number;
}

export interface LoadingState {
  status: 'idle' | 'loading' | 'ready' | 'error';
  message?: string;
  progressItems: ProgressItem[];
  error?: string;
}

export interface VlmSettings {
  isEnabled: boolean;
  captureInterval: number; // in seconds
  temperature: number; // 0.0 to 1.0
  topK: number;
  topP: number;
  
  // Provider Configuration
  model: string; // e.g., 'gemini-2.5-flash' or 'gpt-4o'

  // Remote/Custom Provider Settings
  remoteUrl: string; 
  apiKey: string;

  // Local Provider Settings
  device?: string;
}

export type LiveCommentaryMode = 'screen-capture' | 'external';

export interface CommentaryPrompts {
  /**
   * The persona and general behavior instructions.
   */
  system: string;
  /**
   * The prompt sent during the automatic interval check.
   * Default: "Look at the screen content. React to it as a viewer."
   */
  interval: string;
  /**
   * The prompt sent when the user types a message.
   * Default: "The streamer said: "${userPrompt}". Reply to them or comment on the screen..."
   */
  chat: string;
}

export interface CommentaryContext {
    /**
     * Optional JSON-serializable data to provide context to the AI 
     * (e.g. game stats, current file name, user status).
     */
    data?: Record<string, any>;
}

export interface LiveCommentaryProps {
  /**
   * Initial configuration overrides.
   */
  config?: Partial<VlmSettings>;
  /**
   * The mode of operation. 
   * 'screen-capture': The widget handles getting the stream via getDisplayMedia.
   * 'external': The widget expects `captureSource` to be provided and will call it to get frames.
   * @default 'screen-capture'
   */
  mode?: LiveCommentaryMode;
  /**
   * Required if mode is 'external'. A function that returns the base64 encoded image string (without data prefix).
   */
  captureSource?: () => Promise<string | null> | string | null;
  /**
   * Custom prompts to guide the AI persona and responses.
   */
  prompts?: Partial<CommentaryPrompts>;
  /**
   * Custom data object to pass to the AI for context (e.g. game stats, app state).
   */
  contextData?: Record<string, any>;
  /**
   * Custom title for the widget header.
   */
  title?: string;
  /**
   * Whether to show Twitch-style badges (Broadcaster, Prime, etc).
   * @default true
   */
  showBadges?: boolean;
  /**
   * Control positioning mode.
   * If true, renders as a fixed overlay in the top-right (default).
   * If false, renders as a block element filling 100% of its parent.
   * @default true
   */
  overlay?: boolean;
  /**
   * CSS class string to apply to the widget container. 
   * Providing this overrides the default positioning classes.
   */
  className?: string;
  /**
   * Inline styles to apply to the widget container.
   */
  style?: React.CSSProperties;
  /**
   * Custom list of usernames to use for chat messages.
   */
  usernames?: string[];
  /**
   * Middleware function to intercept and transform the raw AI response.
   * If provided, the internal parsing logic is skipped, and this function
   * is responsible for returning the array of ChatMessages to display.
   */
  responseTransform?: (rawText: string) => ChatMessage[];
}
