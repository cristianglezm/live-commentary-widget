import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatWidget from './ChatWidget';
import { DEFAULT_SETTINGS } from '../constants';
import type { ChatMessage as ChatMessageType } from '../types';

// Setup mock for scrollIntoView required by ChatWidget
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('ChatWidget', () => {
  const mockMessages: ChatMessageType[] = [
    { id: '1', username: 'User1', color: '#fff', text: 'Message 1' },
    { id: '2', username: 'User2', color: '#fff', text: 'Message 2' },
  ];
  const mockOnSettingsChange = vi.fn();
  const mockOnToggleCapture = vi.fn();
  const mockOnSendMessage = vi.fn();

  it('renders messages and the header', () => {
    render(
      <ChatWidget
        messages={mockMessages}
        settings={DEFAULT_SETTINGS}
        onSettingsChange={mockOnSettingsChange}
        onToggleCapture={mockOnToggleCapture}
        onSendMessage={mockOnSendMessage}
        isCapturing={false}
      />
    );

    expect(screen.getByText('Live Commentary')).toBeInTheDocument();
    expect(screen.getByText('Message 1')).toBeInTheDocument();
    expect(screen.getByText('Message 2')).toBeInTheDocument();
  });

  it('shows "Paused" status and play icon when not capturing', () => {
    render(
      <ChatWidget
        messages={[]}
        settings={DEFAULT_SETTINGS}
        onSettingsChange={mockOnSettingsChange}
        onToggleCapture={mockOnToggleCapture}
        onSendMessage={mockOnSendMessage}
        isCapturing={false}
      />
    );
    expect(screen.getByText('Paused')).toBeInTheDocument();
    expect(screen.getByLabelText('Start commentary')).toBeInTheDocument();
  });
  
  it('shows "Listening to stream..." status and pause icon when capturing', () => {
    render(
      <ChatWidget
        messages={[]}
        settings={DEFAULT_SETTINGS}
        onSettingsChange={mockOnSettingsChange}
        onToggleCapture={mockOnToggleCapture}
        onSendMessage={mockOnSendMessage}
        isCapturing={true}
      />
    );
    expect(screen.getByText('Listening to stream...')).toBeInTheDocument();
    expect(screen.getByLabelText('Pause commentary')).toBeInTheDocument();
  });

  it('calls onToggleCapture when play/pause button is clicked', () => {
    const { rerender } = render(
      <ChatWidget
        messages={[]}
        settings={DEFAULT_SETTINGS}
        onSettingsChange={mockOnSettingsChange}
        onToggleCapture={mockOnToggleCapture}
        onSendMessage={mockOnSendMessage}
        isCapturing={false}
      />
    );

    fireEvent.click(screen.getByLabelText('Start commentary'));
    expect(mockOnToggleCapture).toHaveBeenCalledTimes(1);

    rerender(
      <ChatWidget
        messages={[]}
        settings={DEFAULT_SETTINGS}
        onSettingsChange={mockOnSettingsChange}
        onToggleCapture={mockOnToggleCapture}
        onSendMessage={mockOnSendMessage}
        isCapturing={true}
      />
    );

    fireEvent.click(screen.getByLabelText('Pause commentary'));
    expect(mockOnToggleCapture).toHaveBeenCalledTimes(2);
  });

  it('opens settings panel when settings icon is clicked', () => {
    render(
      <ChatWidget
        messages={[]}
        settings={DEFAULT_SETTINGS}
        onSettingsChange={mockOnSettingsChange}
        onToggleCapture={mockOnToggleCapture}
        onSendMessage={mockOnSendMessage}
        isCapturing={false}
      />
    );

    expect(screen.queryByText('Settings')).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Open settings'));
    
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
});
