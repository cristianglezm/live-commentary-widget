import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatMessage from './ChatMessage';
import type { ChatMessage as ChatMessageType } from '../types';

describe('ChatMessage', () => {
  it('renders the username and message text', () => {
    const message: ChatMessageType = {
      id: '1',
      username: 'PixelPirate',
      color: '#ff79c6',
      text: 'Hello, world!',
    };

    render(<ChatMessage message={message} />);

    // The username and colon are in separate spans.
    expect(screen.getByText('PixelPirate')).toBeInTheDocument();
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
  });

  it('applies the correct color to the username', () => {
    const message: ChatMessageType = {
      id: '1',
      username: 'DataDragon',
      color: 'rgb(80, 250, 123)', // #50fa7b
      text: 'Test message',
    };

    render(<ChatMessage message={message} />);
    const usernameElement = screen.getByText('DataDragon');

    expect(usernameElement).toHaveStyle({ color: 'rgb(80, 250, 123)' });
  });
});
