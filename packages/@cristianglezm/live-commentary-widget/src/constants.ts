import type { VlmSettings, CommentaryPrompts } from './types';

export const FAKE_USERNAMES: string[] = [
  'PixelPirate', 'CodeWizard', 'DataDragon', 'CyberSamurai', 'LogicLlama',
  'SyntaxSorcerer', 'GlitchGoblin', 'StreamSage', 'ByteBard', 'KernelKnight'
];

export const USER_COLORS: string[] = [
  '#ff79c6', '#50fa7b', '#8be9fd', '#f1fa8c', '#ffb86c', '#ff5555',
  '#bd93f9', '#ff92d0', '#6272a4', '#44475a'
];

export const DEFAULT_SETTINGS: VlmSettings = {
  isEnabled: false,
  captureInterval: 10, // seconds
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  
  model: 'gpt-4o',
  
  remoteUrl: 'http://localhost:8080/v1/chat/completions',
  apiKey: '',
};

const SYSTEM_INSTRUCTION = `You are a participant in a Twitch-style chat.
Your task is to analyze the provided screenshot and generate 1 or 2 short, funny, or insightful comments.

Guidelines:
- Be funny, sarcastic, or supportive (hype).
- Use internet slang if appropriate.
- Do NOT describe the image technically (e.g., "I see a web page"). Instead, react to its contents.
- Do NOT repeat the user's prompt.
- Be concise (under 15 words).
- If provided, use the Chat History for context.

Format: Enclose every distinct comment in <comment>tags</comment>. Example: <comment>LMAO what is that??</comment>
If you cannot follow the tag format, just output the plain text comments, one per line.
`;

export const DEFAULT_PROMPTS: CommentaryPrompts = {
    system: SYSTEM_INSTRUCTION,
    interval: "Look at the screen content. React to it as a viewer.",
    chat: `The streamer said: "{{userPrompt}}".\nReply to them or comment on the screen. Be witty and concise.`
};

// Deprecated: kept for backward compatibility if imported elsewhere
export const PERSONA_PROMPT = SYSTEM_INSTRUCTION;
