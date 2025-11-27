import React from 'react';
import type { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
  showBadges?: boolean;
}

// Deterministic badge selection based on username length/char code for consistency without storage
const getBadges = (username: string) => {
    if (username === 'System') return ['broadcaster'];
    
    const badges = [];
    const hash = username.charCodeAt(0);
    
    // Randomly assign badges based on simple hash
    if (hash % 3 === 0) badges.push('prime');
    else if (hash % 4 === 0) badges.push('turbo');
    else if (hash % 5 === 0) badges.push('sub'); // 1-month sub
    
    return badges;
};

const Badge: React.FC<{ type: string }> = ({ type }) => {
    // Simple SVGs mimicking Twitch badges
    if (type === 'broadcaster') {
        return (
            <span className="inline-flex items-center justify-center w-4 h-4 bg-[#e91916] rounded mr-1 align-middle" title="Broadcaster">
                 <svg viewBox="0 0 20 20" fill="white" className="w-3 h-3"><path d="M12 2a2 2 0 012 2v2h2a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2V4a2 2 0 012-2h4zm-2 4H8v2h2V6zm4 0h-2v2h2V6z"/></svg>
            </span>
        );
    }
    if (type === 'prime') {
        return (
             <span className="inline-flex items-center justify-center w-4 h-4 bg-[#00aaff] rounded mr-1 align-middle" title="Prime Gaming">
                 <svg viewBox="0 0 20 20" fill="white" className="w-3 h-3"><path d="M10 2L2 17h16L10 2zm0 4l4.5 9h-9L10 6z"/></svg>
             </span>
        );
    }
    if (type === 'sub') {
        return (
            <span className="inline-flex items-center justify-center w-4 h-4 bg-[#8205b4] rounded mr-1 align-middle" title="Subscriber">
                <svg viewBox="0 0 20 20" fill="white" className="w-3 h-3"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11a1 1 0 112 0v4a1 1 0 11-2 0V7z"/></svg>
            </span>
        );
    }
     if (type === 'turbo') {
        return (
            <span className="inline-flex items-center justify-center w-4 h-4 bg-[#a970ff] rounded mr-1 align-middle" title="Turbo">
                <svg viewBox="0 0 20 20" fill="white" className="w-3 h-3"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
            </span>
        );
    }
    return null;
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message, showBadges = true }) => {
  const badges = showBadges ? getBadges(message.username) : [];

  return (
    <div className="py-[2px] px-4 text-[13px] leading-5 break-words animate-lc-fade-in hover:bg-lc-surface-highlight transition-colors group">
      <span className="inline-flex items-center select-none">
          {badges.map(b => <Badge key={b} type={b} />)}
      </span>
      <span 
        className="font-bold cursor-pointer hover:underline align-baseline" 
        style={{ color: message.color }}
      >
        {message.username}
      </span>
      <span className="text-lc-text mr-1">:</span>
      <span className="text-lc-text align-baseline">{message.text}</span>
    </div>
  );
};

export default ChatMessage;
