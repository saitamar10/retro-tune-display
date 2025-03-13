
import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, RotateCcw, RotateCw, Sliders, FastForward, Rewind } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTime } from '@/services/youtubeService';
import { Slider } from "@/components/ui/slider";

interface PlayerControlsProps {
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  onPlayPause: () => void;
  onSkipNext: () => void;
  onSkipPrevious: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  rotationSpeed?: number;
  onRotationSpeedChange?: (speed: number) => void;
  onSeekBackward?: () => void;
  onSeekForward?: () => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  duration,
  currentTime,
  volume,
  onPlayPause,
  onSkipNext,
  onSkipPrevious,
  onSeek,
  onVolumeChange,
  isFavorite = false,
  onToggleFavorite,
  rotationSpeed = 8,
  onRotationSpeedChange,
  onSeekBackward,
  onSeekForward
}) => {
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    onSeek(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    onVolumeChange(value[0]);
  };
  
  const handleRotationSpeedChange = (value: number[]) => {
    if (onRotationSpeedChange) {
      onRotationSpeedChange(value[0]);
    }
  };

  const handleSeekForward = () => {
    if (onSeekForward) {
      onSeekForward();
    } else {
      onSeek(Math.min(currentTime + 10, duration));
    }
  };

  const handleSeekBackward = () => {
    if (onSeekBackward) {
      onSeekBackward();
    } else {
      onSeek(Math.max(currentTime - 10, 0));
    }
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
        <span className="text-xs text-gray-400">{formatTime(duration)}</span>
      </div>
      
      {/* Progress bar */}
      <div 
        className="progress-bar mb-6 cursor-pointer group"
        onClick={handleProgressClick}
      >
        <div 
          className="progress-bar-fill" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
        <div 
          className="progress-bar-thumb" 
          style={{ left: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Main controls */}
      <div className="flex justify-center space-x-6 mb-6">
        <button
          onClick={onSkipPrevious}
          className="control-button-minimal"
          aria-label="Previous track"
        >
          <SkipBack size={22} />
        </button>

        <button
          onClick={handleSeekBackward}
          className="control-button-minimal"
          aria-label="Seek backward"
        >
          <Rewind size={18} />
        </button>

        <button
          onClick={onPlayPause}
          className="control-button-primary-new"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </button>

        <button
          onClick={handleSeekForward}
          className="control-button-minimal"
          aria-label="Seek forward"
        >
          <FastForward size={18} />
        </button>

        <button
          onClick={onSkipNext}
          className="control-button-minimal"
          aria-label="Next track"
        >
          <SkipForward size={22} />
        </button>
      </div>

      {/* Secondary controls */}
      <div className="flex flex-col gap-4 mt-4">
        {/* Volume control */}
        <div className="flex items-center gap-3 px-2 mb-2">
          <Volume2 size={14} className="text-gray-400 shrink-0" />
          <Slider
            defaultValue={[volume]}
            value={[volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-full"
          />
          <span className="text-xs text-gray-400 w-8 text-right">{Math.round(volume * 100)}%</span>
        </div>

        {/* Rotation speed control */}
        {onRotationSpeedChange && (
          <div className="flex items-center gap-3 px-2">
            <RotateCcw size={14} className="text-gray-400 shrink-0" />
            <Slider
              defaultValue={[rotationSpeed]}
              value={[rotationSpeed]}
              min={2}
              max={16}
              step={1}
              onValueChange={handleRotationSpeedChange}
              className="w-full"
            />
            <RotateCw size={14} className="text-gray-400 shrink-0" />
          </div>
        )}

        {/* Additional controls row */}
        <div className="flex justify-center gap-4 mt-3">
          {/* Favorite button */}
          {onToggleFavorite && (
            <button
              onClick={onToggleFavorite}
              className={cn(
                "minimal-button",
                isFavorite ? "text-red-400" : "text-gray-400 hover:text-gray-300"
              )}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          )}
          
          {/* Settings button - for future functionality */}
          <button
            className="minimal-button text-gray-400 hover:text-gray-300"
            aria-label="Playback settings"
          >
            <Sliders size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerControls;
