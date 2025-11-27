import { useState, useRef, useCallback, useEffect } from 'react';
import type { LiveCommentaryMode } from '../types';

interface UseScreenCaptureProps {
  mode: LiveCommentaryMode;
  externalSource?: () => Promise<string | null> | string | null;
}

export const useScreenCapture = ({ mode, externalSource }: UseScreenCaptureProps) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  
  // Initialize video element if needed
  useEffect(() => {
    if (mode === 'screen-capture' && !videoRef.current) {
        const video = document.createElement('video');
        video.autoplay = true;
        video.muted = true;
        video.style.display = 'none';
        document.body.appendChild(video);
        videoRef.current = video;
    }

    return () => {
        if (videoRef.current && videoRef.current.parentNode) {
            videoRef.current.parentNode.removeChild(videoRef.current);
        }
    };
  }, [mode]);

  const startCapture = useCallback(async () => {
    setError(null);
    try {
      if (mode === 'external') {
        if (!externalSource) {
            throw new Error("External capture source not provided");
        }
        setIsCapturing(true);
        return true;
      }

      // Screen Capture Mode
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "never" } as any,
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      mediaStreamRef.current = stream;
      setIsCapturing(true);

      // Handle user stopping stream via browser UI
      stream.getVideoTracks()[0].onended = () => {
        stopCapture();
      };
      
      return true;

    } catch (err) {
      console.error("Error starting capture:", err);
      setError("Permission denied or cancelled.");
      setIsCapturing(false);
      return false;
    }
  }, [mode, externalSource]);

  const stopCapture = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (videoRef.current) {
        videoRef.current.srcObject = null;
    }
    
    setIsCapturing(false);
  }, []);

  const captureFrame = useCallback(async (): Promise<string | null> => {
    if (mode === 'external' && externalSource) {
        try {
            const result = await externalSource();
            if (result && result.includes(',')) {
                return result.split(',')[1];
            }
            return result;
        } catch (err) {
            console.error("External capture error:", err);
            return null;
        }
    }

    if (mode === 'screen-capture' && videoRef.current && videoRef.current.readyState >= 2) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      
      // Optimization: Resize to max 1024px
      const MAX_DIMENSION = 1024;
      let width = video.videoWidth;
      let height = video.videoHeight;

      if (width > height) {
          if (width > MAX_DIMENSION) {
              height = Math.round(height * (MAX_DIMENSION / width));
              width = MAX_DIMENSION;
          }
      } else {
          if (height > MAX_DIMENSION) {
              width = Math.round(width * (MAX_DIMENSION / height));
              height = MAX_DIMENSION;
          }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, width, height);
        // High compression for speed
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
        return dataUrl.split(',')[1]; 
      }
    }
    return null;
  }, [mode, externalSource]);

  return {
    isCapturing,
    error,
    startCapture,
    stopCapture,
    captureFrame
  };
};
