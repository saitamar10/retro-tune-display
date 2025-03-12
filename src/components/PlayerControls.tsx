
import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTime } from '@/services/youtubeService';

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
  onToggleFavorite
}) => {
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    onSeek(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    onVolumeChange(newVolume);
  };

  return (
    <div className="w-full animate-fade-in">
      {/* Progress bar */}
      <div 
        className="progress-bar my-4 cursor-pointer group"
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

      {/* Time indicators */}
      <div className="flex justify-between text-xs text-gray-500 mb-4 px-1">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Main controls */}
      <div className="player-controls">
        {/* Previous button */}
        <button
          onClick={onSkipPrevious}
          className="control-button control-button-secondary"
          aria-label="Previous track"
        >
          <SkipBack size={22} />
        </button>

        {/* Play/Pause button */}
        <button
          onClick={onPlayPause}
          className="control-button control-button-primary"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={30} /> : <Play size={30} className="ml-1" />}
        </button>

        {/* Next button */}
        <button
          onClick={onSkipNext}
          className="control-button control-button-secondary"
          aria-label="Next track"
        >
          <SkipForward size={22} />
        </button>
      </div>

      {/* Secondary controls */}
      <div className="flex justify-between items-center mt-4 px-4">
        {/* Volume control */}
        <div className="flex items-center gap-2 w-24">
          <Volume2 size={16} className="text-gray-500" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Favorite button */}
        {onToggleFavorite && (
          <button
            onClick={onToggleFavorite}
            className={cn(
              "flex items-center justify-center h-8 w-8 rounded-full",
              isFavorite ? "text-red-500" : "text-gray-400 hover:text-gray-600"
            )}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        )}
      </div>
    </div>
  );
};

export default PlayerControls;
