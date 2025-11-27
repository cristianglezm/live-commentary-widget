import React, { useEffect, useRef } from 'react';
import ChatWidget from './components/ChatWidget';
import { useScreenCapture } from './hooks/useScreenCapture';
import { useLiveCommentary } from './hooks/useLiveCommentary';
import type { LiveCommentaryProps } from './types';

export const LiveCommentary: React.FC<LiveCommentaryProps> = ({ 
  config, 
  mode = 'screen-capture',
  captureSource,
  prompts,
  contextData,
  title,
  showBadges = true,
  overlay = true,
  className,
  style,
  usernames,
  responseTransform
}) => {
  
  // 1. Capture Logic Hook
  const { 
    isCapturing, 
    startCapture, 
    stopCapture, 
    captureFrame,
    error: captureError
  } = useScreenCapture({ 
      mode, 
      externalSource: captureSource 
  });

  // 2. AI & Chat State Hook
  const {
    messages,
    settings,
    setSettings,
    loadingState,
    addMessage,
    triggerEvaluation,
    isGenerating
  } = useLiveCommentary({
      config,
      prompts,
      contextData,
      usernames,
      responseTransform,
      captureFrame,
      isCapturing
  });

  // Initial Welcome Messages
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    addMessage("Welcome! Click Play to start.", "System", "#8BE9FD");
    if (mode === 'screen-capture') {
        addMessage("Use the settings icon to configure.", "System", "#BD93F9");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle Capture Errors
  useEffect(() => {
      if (captureError) {
          addMessage(captureError, "System", "#FF5555");
      }
  }, [captureError, addMessage]);

  const handleToggleCapture = () => {
    if (isCapturing) {
      stopCapture();
      addMessage("Commentary paused.", "System", "#FFB86C");
    } else {
      startCapture().then(success => {
          if (success) {
             const msg = mode === 'external' 
                ? "Commentary started on external source." 
                : "Let's go! Live commentary started.";
             addMessage(msg, "System", "#50FA7B");
          }
      });
    }
  };

  const handleSendMessage = async (text: string) => {
      addMessage(text, "Me", "#ffffff");
      
      let active = isCapturing;
      if (!isCapturing) {
          active = (await startCapture()) || false;
      }
      
      if (active) {
          // Small delay to ensure video/canvas is ready
          setTimeout(() => {
              triggerEvaluation(text);
          }, 500);
      }
  };

  return (
    <ChatWidget
      messages={messages}
      settings={settings}
      onSettingsChange={(s) => setSettings(prev => ({...prev, ...s}))}
      onToggleCapture={handleToggleCapture}
      onSendMessage={handleSendMessage}
      isCapturing={isCapturing}
      loadingState={loadingState}
      title={title}
      showBadges={showBadges}
      overlay={overlay}
      className={className}
      style={style}
    />
  );
};
