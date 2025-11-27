import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SettingsPanel from './SettingsPanel';
import { DEFAULT_SETTINGS } from '../constants';

describe('SettingsPanel', () => {
  const mockOnSettingsChange = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all settings controls with initial values', () => {
    render(
      <SettingsPanel
        settings={DEFAULT_SETTINGS}
        onSettingsChange={mockOnSettingsChange}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByLabelText('Server URL')).toHaveValue(DEFAULT_SETTINGS.remoteUrl);
    expect(screen.getByLabelText('API Key (Optional)')).toHaveValue(DEFAULT_SETTINGS.apiKey);
    expect(screen.getByLabelText(/Comment Interval/)).toHaveValue(DEFAULT_SETTINGS.captureInterval.toString());
    expect(screen.getByLabelText(/Creativity/)).toHaveValue(DEFAULT_SETTINGS.temperature.toString());
    expect(screen.getByLabelText(/Top-K/)).toHaveValue(DEFAULT_SETTINGS.topK.toString());
    expect(screen.getByLabelText(/Top-P/)).toHaveValue(DEFAULT_SETTINGS.topP.toString());
  });

  it('calls onSettingsChange when a text input is changed', () => {
    render(
      <SettingsPanel
        settings={DEFAULT_SETTINGS}
        onSettingsChange={mockOnSettingsChange}
        onClose={mockOnClose}
      />
    );

    const urlInput = screen.getByLabelText('Server URL');
    fireEvent.change(urlInput, { target: { value: 'http://new-url.com' } });

    expect(mockOnSettingsChange).toHaveBeenCalledWith({ remoteUrl: 'http://new-url.com' });
  });
  
  it('calls onSettingsChange when a slider is changed', () => {
    render(
      <SettingsPanel
        settings={DEFAULT_SETTINGS}
        onSettingsChange={mockOnSettingsChange}
        onClose={mockOnClose}
      />
    );

    const creativitySlider = screen.getByLabelText(/Creativity/);
    fireEvent.change(creativitySlider, { target: { value: '0.9' } });
    
    expect(mockOnSettingsChange).toHaveBeenCalledWith({ temperature: 0.9 });
  });

  it('calls onClose when the close button is clicked', () => {
    render(
      <SettingsPanel
        settings={DEFAULT_SETTINGS}
        onSettingsChange={mockOnSettingsChange}
        onClose={mockOnClose}
      />
    );

    const closeButton = screen.getByLabelText('Close settings');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
