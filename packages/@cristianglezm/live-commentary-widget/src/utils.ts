import { FAKE_USERNAMES, USER_COLORS } from './constants';
import type { ChatMessage } from './types';

export const generateFakeUser = (customUsernames?: string[]) => {
  const listToUse = (customUsernames && customUsernames.length > 0) ? customUsernames : FAKE_USERNAMES;
  const randomIndex = Math.floor(Math.random() * listToUse.length);
  return {
    username: listToUse[randomIndex],
    color: USER_COLORS[randomIndex % USER_COLORS.length]
  };
};

export const createChatMessage = (
  text: string, 
  username?: string, 
  color?: string, 
  customUsernames?: string[],
  attachment?: string
): ChatMessage => {
  const user = username ? { username, color: color || '#ffffff' } : generateFakeUser(customUsernames);
  
  return {
    id: Date.now().toString() + Math.random().toString(36).substring(2),
    username: user.username,
    color: user.color,
    text,
    attachment
  };
};
