import './index.css';

export { LiveCommentary } from './LiveCommentary';
export { default as ChatWidget } from './components/ChatWidget'; // Renaming handled by default import usually, but keeping simple for now
export { useLiveCommentary } from './hooks/useLiveCommentary';
export { useScreenCapture } from './hooks/useScreenCapture';
export { generateFakeUser, createChatMessage } from './utils';
export { getAIProvider } from './services/AIService';
export * from './types';
