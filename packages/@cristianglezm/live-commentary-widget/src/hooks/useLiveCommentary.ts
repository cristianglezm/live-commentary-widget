import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import type { VlmSettings, ChatMessage, CommentaryPrompts, LoadingState } from '../types';
import { getAIProvider } from '../services/AIService';
import { DEFAULT_PROMPTS, DEFAULT_SETTINGS } from '../constants';
import { createChatMessage } from '../utils';

const STORAGE_KEY = 'live-commentary-settings';

interface UseLiveCommentaryProps {
  config?: Partial<VlmSettings>;
  prompts?: Partial<CommentaryPrompts>;
  contextData?: Record<string, any>;
  usernames?: string[];
  responseTransform?: (rawText: string) => ChatMessage[];
  captureFrame: () => Promise<string | null>;
  isCapturing: boolean;
}

interface QueuedComment {
    text: string;
    attachment?: string;
}

export const useLiveCommentary = ({
  config,
  prompts,
  contextData,
  usernames,
  responseTransform,
  captureFrame,
  isCapturing
}: UseLiveCommentaryProps) => {
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // Initialize settings from localStorage if available
  const [settings, setSettings] = useState<VlmSettings>(() => {
    const initial = { ...DEFAULT_SETTINGS, ...config };
    try {
      if (typeof window !== 'undefined') {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return { ...initial, ...JSON.parse(stored) };
        }
      }
    } catch (e) {
      console.warn('Failed to load settings from localStorage', e);
    }
    return initial;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      }
    } catch (e) {
      console.warn('Failed to save settings to localStorage', e);
    }
  }, [settings]);

  const [loadingState, setLoadingState] = useState<LoadingState>({ status: 'idle', progressItems: [] });
  // Use Ref for queue to avoid side-effects in state setters (which run twice in StrictMode)
  const commentQueueRef = useRef<QueuedComment[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Refs for access inside intervals/async without stale closures
  const isGeneratingRef = useRef(isGenerating);
  const messagesRef = useRef(messages);
  const contextDataRef = useRef(contextData);
  const captureIntervalRef = useRef<number | null>(null);
  const seenCommentsRef = useRef<Set<string>>(new Set());

  // Merge prompts
  const activePrompts = useMemo<CommentaryPrompts>(() => ({
    ...DEFAULT_PROMPTS,
    ...prompts
  }), [prompts]);

  useEffect(() => { isGeneratingRef.current = isGenerating; }, [isGenerating]);
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { contextDataRef.current = contextData; }, [contextData]);

  // Public Action: Add a message manually
  const addMessage = useCallback((text: string, username?: string, color?: string, attachment?: string) => {
    const msg = createChatMessage(text, username, color, usernames, attachment);
    setMessages(prev => [...prev.slice(-99), msg]); // Keep last 100
  }, [usernames]);

  const processResponse = useCallback((rawComments: string[], capturedImage?: string) => {
      if (rawComments && rawComments.length > 0) {
          const uniqueBatch = Array.from(new Set(rawComments));
          const newUniqueComments = uniqueBatch.filter(c => !seenCommentsRef.current.has(c));

          newUniqueComments.forEach(c => {
              seenCommentsRef.current.add(c);
              if (seenCommentsRef.current.size > 100) {
                  const first = seenCommentsRef.current.values().next().value;
                  if (first) seenCommentsRef.current.delete(first);
              }
          });

          if (newUniqueComments.length > 0) {
            // Map text comments to queue objects.
            // Attach the captured image only to the first comment in this batch to avoid spamming the same image.
            const queueItems: QueuedComment[] = newUniqueComments.map((text, index) => ({
                text,
                attachment: (index === 0) ? capturedImage : undefined
            }));
            commentQueueRef.current.push(...queueItems);
          }
      }
  }, []);

  const triggerEvaluation = useCallback(async (userPrompt?: string) => {
    // Prevent overlapping generations unless it's a forced user prompt
    if (isGeneratingRef.current && !userPrompt) return;
    
    const base64Image = await captureFrame();
    if (!base64Image) return;

    setIsGenerating(true);

    try {
        const provider = getAIProvider();
        
        // If middleware is present, we ask for Raw Text from provider
        // Otherwise we ask for parsed array
        const rawText = await provider.fetchRawResponse(
            base64Image,
            settings,
            messagesRef.current,
            userPrompt,
            (update) => setLoadingState(prev => ({...prev, ...update})),
            activePrompts,
            contextDataRef.current
        );

        if (responseTransform) {
            // MIDDLEWARE PATH: User handles the logic
            const transformedMessages = responseTransform(rawText);
            if (transformedMessages && Array.isArray(transformedMessages)) {
                // If middleware returns messages, add them directly
                // We use setMessages callback to ensure we don't lose updates
                setMessages(prev => {
                     const newIds = new Set(transformedMessages.map(m => m.id));
                     const filteredPrev = prev.filter(p => !newIds.has(p.id));
                     return [...filteredPrev.slice(-100 + transformedMessages.length), ...transformedMessages];
                });
            }
        } else {
             // DEFAULT PATH: Library handles parsing and queueing
             const comments = provider.parseResponse(rawText);
             processResponse(comments, base64Image);
        }

    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : "AI Error";
        if (loadingState.status !== 'loading') {
             // Only show error if we aren't stuck in a loading state (e.g. model downloading)
             addMessage(errorMessage, "System", "#FF5555");
        }
    } finally {
        setIsGenerating(false);
    }
  }, [captureFrame, settings, activePrompts, responseTransform, processResponse, addMessage, loadingState.status]);

  // Queue Consumer Loop
  useEffect(() => {
    if (!isCapturing) {
        commentQueueRef.current = [];
        return;
    }
    
    // Only run queue consumption if we are NOT using custom middleware (which adds directly)
    if (responseTransform) return;

    const displayInterval = window.setInterval(() => {
        if (commentQueueRef.current.length > 0) {
            // Safe shift from ref - no side effects in state setters
            const nextItem = commentQueueRef.current.shift();
            if (nextItem) {
                addMessage(nextItem.text, undefined, undefined, nextItem.attachment);
            }
        }
    }, 2500 + Math.random() * 1000); // Randomize slightly for natural feel

    return () => clearInterval(displayInterval);
  }, [isCapturing, addMessage, responseTransform]);

  // AI Trigger Loop
  useEffect(() => {
    if (!isCapturing) {
        if (captureIntervalRef.current) clearInterval(captureIntervalRef.current);
        return;
    }

    const checkAndFetch = () => {
        // Simple backpressure: Don't fetch if queue is full
        if (commentQueueRef.current.length < 3 && !isGeneratingRef.current && loadingState.status !== 'loading') {
          triggerEvaluation();
        }
    };

    // Initial check
    checkAndFetch();
    captureIntervalRef.current = window.setInterval(checkAndFetch, settings.captureInterval * 1000);

    return () => {
        if (captureIntervalRef.current) clearInterval(captureIntervalRef.current);
    }
  }, [isCapturing, settings.captureInterval, triggerEvaluation, loadingState.status]);

  return {
    messages,
    settings,
    setSettings,
    loadingState,
    addMessage,
    triggerEvaluation,
    isGenerating
  };
};
