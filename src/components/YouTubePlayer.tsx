
import React, { useRef, useEffect, useState } from 'react';

interface YouTubePlayerProps {
  videoId: string;
  isPlaying: boolean;
  volume: number;
  onReady: () => void;
  onPlay: () => void;
  onPause: () => void;
  onEnd: () => void;
  onTimeUpdate: (currentTime: number, duration: number) => void;
  onError: (error: any) => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  isPlaying,
  volume,
  onReady,
  onPlay,
  onPause,
  onEnd,
  onTimeUpdate,
  onError
}) => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAPILoaded, setIsAPILoaded] = useState(false);
  const [lastVideoId, setLastVideoId] = useState<string | null>(null);

  // Load YouTube API
  useEffect(() => {
    if (!isAPILoaded && !window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        setIsAPILoaded(true);
      };
    } else if (window.YT && window.YT.Player) {
      setIsAPILoaded(true);
    }

    return () => {
      // Clean up
      window.onYouTubeIframeAPIReady = () => {};
    };
  }, []);

  // Initialize or update player
  useEffect(() => {
    if (!isAPILoaded || !videoId || !containerRef.current) return;

    // If the player doesn't exist or video ID has changed, create a new player
    if (!playerRef.current || lastVideoId !== videoId) {
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        height: '100%',
        width: '100%',
        playerVars: {
          autoplay: isPlaying ? 1 : 0,
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          iv_load_policy: 3, // Hide annotations
          modestbranding: 1,
          rel: 0,
          showinfo: 0
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(volume * 100);
            onReady();
          },
          onStateChange: (event: any) => {
            switch (event.data) {
              case window.YT.PlayerState.PLAYING:
                onPlay();
                break;
              case window.YT.PlayerState.PAUSED:
                onPause();
                break;
              case window.YT.PlayerState.ENDED:
                onEnd();
                break;
            }
          },
          onError: (event: any) => {
            onError(event.data);
          }
        }
      });

      setLastVideoId(videoId);
    } else if (playerRef.current) {
      // Otherwise, update existing player state
      try {
        // Add proper error handling around YouTube API calls
        if (isPlaying && playerRef.current.getPlayerState && 
            playerRef.current.getPlayerState() !== window.YT.PlayerState.PLAYING) {
          if (typeof playerRef.current.playVideo === 'function') {
            playerRef.current.playVideo();
          }
        } else if (!isPlaying && playerRef.current.getPlayerState && 
                  playerRef.current.getPlayerState() === window.YT.PlayerState.PLAYING) {
          if (typeof playerRef.current.pauseVideo === 'function') {
            playerRef.current.pauseVideo();
          }
        }
      } catch (error) {
        console.error('Error controlling YouTube player:', error);
      }
    }
  }, [videoId, isAPILoaded, isPlaying, volume, onReady, onPlay, onPause, onEnd, onError, lastVideoId]);

  // Update volume when it changes
  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      try {
        playerRef.current.setVolume(volume * 100);
      } catch (error) {
        console.error('Error setting volume:', error);
      }
    }
  }, [volume]);

  // Time update polling
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying && playerRef.current) {
      interval = setInterval(() => {
        try {
          if (typeof playerRef.current.getCurrentTime === 'function' && 
              typeof playerRef.current.getDuration === 'function') {
            const currentTime = playerRef.current.getCurrentTime() || 0;
            const duration = playerRef.current.getDuration() || 0;
            onTimeUpdate(currentTime, duration);
          }
        } catch (error) {
          // Ignore errors when the player is not ready
        }
      }, 500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, onTimeUpdate]);

  // Hidden player that provides the audio
  return (
    <div className="hidden">
      <div ref={containerRef} />
    </div>
  );
};

export default YouTubePlayer;
