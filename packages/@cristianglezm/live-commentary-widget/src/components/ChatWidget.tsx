import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage as ChatMessageType, VlmSettings, LoadingState } from '../types';
import ChatMessage from './ChatMessage';
import SettingsPanel from './SettingsPanel';
import LoadingStatus from './LoadingStatus';
import { SettingsIcon, PlayIcon, PauseIcon } from './icons';

interface ChatWidgetProps {
  messages: ChatMessageType[];
  settings: VlmSettings;
  onSettingsChange: (newSettings: Partial<VlmSettings>) => void;
  onToggleCapture: () => void;
  onSendMessage: (text: string) => void;
  isCapturing: boolean;
  loadingState?: LoadingState;
  title?: string;
  showBadges?: boolean;
  overlay?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

// Base styles shared by both modes
const BASE_CLASSES = "flex flex-col overflow-hidden font-sans border border-lc-surface-highlight bg-lc-bg text-lc-text";

// Mode-specific defaults
const OVERLAY_DEFAULTS = "fixed top-4 right-4 w-80 h-[calc(100vh-2rem)] rounded-md z-50 shadow-xl";
const EMBEDDED_DEFAULTS = "relative w-full h-full min-h-0";

const ChatWidget: React.FC<ChatWidgetProps> = ({ 
    messages, 
    settings, 
    onSettingsChange, 
    onToggleCapture, 
    onSendMessage,
    isCapturing, 
    loadingState,
    title = "Live Commentary",
    showBadges = true,
    overlay = true,
    className,
    style
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isUserScrolledUpRef = useRef(false);

  // --- Sticky Scroll Logic ---
  
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        // Reset state after programmatic scroll
        isUserScrolledUpRef.current = false;
        setShowScrollButton(false);
    }
  };

  useEffect(() => {
    // Only auto-scroll if the user hasn't manually scrolled up
    if (!isUserScrolledUpRef.current) {
        scrollToBottom();
    } else {
        setShowScrollButton(true);
    }
  }, [messages]);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Threshold (px) to consider "at bottom"
    const threshold = 50; 
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight <= threshold;

    if (isAtBottom) {
        isUserScrolledUpRef.current = false;
        setShowScrollButton(false);
    } else {
        isUserScrolledUpRef.current = true;
    }
  };

  const handleSendClick = () => {
      if (inputValue.trim()) {
          onSendMessage(inputValue);
          setInputValue('');
          // Always scroll to bottom when user sends a message
          setTimeout(scrollToBottom, 100); 
      } else if (!isCapturing) {
          onToggleCapture();
      }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && inputValue.trim()) {
          handleSendClick();
      }
  };

  const defaultClasses = overlay ? OVERLAY_DEFAULTS : EMBEDDED_DEFAULTS;

  return (
    <div 
      className={`${BASE_CLASSES} ${className || defaultClasses}`}
      style={{ 
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        ...style 
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-lc-bg border-b border-lc-surface-highlight flex-shrink-0 shadow-sm">
        <div className="flex flex-col">
            <h1 className="font-semibold text-xs uppercase tracking-wider text-lc-text flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full inline-block ${isCapturing ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></span>
            {title}
            </h1>
            <span className="text-[10px] text-lc-text-muted ml-4">
                {isCapturing ? 'Listening to stream...' : 'Paused'}
            </span>
        </div>
        <div className="flex items-center space-x-1">
            <button onClick={onToggleCapture} className="p-1 hover:bg-lc-surface-hover rounded transition-colors text-lc-text" aria-label={isCapturing ? "Pause commentary" : "Start commentary"}>
                {isCapturing ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className="p-1 hover:bg-lc-surface-hover rounded transition-colors text-lc-text" aria-label="Open settings">
                <SettingsIcon className="w-4 h-4" />
            </button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-twitch relative bg-lc-bg flex flex-col"
      >
        {loadingState && <LoadingStatus state={loadingState} />}
        
        <div className="flex-1 flex flex-col justify-end min-h-0 pb-2">
            {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm p-4 text-center opacity-60">
                   <p>Welcome to the session!</p>
                </div>
            )}
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} showBadges={showBadges} />
            ))}
            <div ref={messagesEndRef} />
        </div>
        
        {/* Scroll to Bottom Button */}
        {showScrollButton && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
                <button 
                    onClick={scrollToBottom}
                    className="pointer-events-auto bg-lc-surface-highlight/90 backdrop-blur text-lc-text text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-lc-surface-hover hover:bg-lc-surface-hover transition-colors flex items-center gap-1"
                >
                    <span>More messages below</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </button>
            </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-3 bg-lc-bg border-t border-lc-surface-highlight flex-shrink-0">
        <div className="relative">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isCapturing ? "Type a message..." : "Type to start..."}
                className="w-full bg-lc-surface-hover rounded px-3 py-2 text-sm text-lc-text border border-transparent focus:border-lc-accent focus:outline-none transition-colors min-h-[40px]"
            />
            <div className="flex justify-between items-center mt-2 px-1">
                 <div className="flex space-x-2 text-lc-text-muted">
                    {/* Fake formatting icons */}
                    <div className="w-4 h-4 bg-current opacity-20 rounded-sm"></div>
                 </div>
                 <button 
                    className={`px-3 py-1 rounded text-xs font-bold text-white transition-colors ${inputValue.trim() || !isCapturing ? 'bg-lc-accent hover:bg-lc-accent-hover' : 'bg-lc-surface-hover cursor-not-allowed opacity-50'}`}
                    onClick={handleSendClick}
                >
                    {inputValue.trim() ? 'Send' : (isCapturing ? 'Send' : 'Start')}
                 </button>
            </div>
        </div>
      </div>

      {/* Settings Panel */}
      {isSettingsOpen && (
        <SettingsPanel
          settings={settings}
          onSettingsChange={onSettingsChange}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
};

export default ChatWidget;
