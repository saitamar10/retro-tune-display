
import React from 'react';
import { Play, Pause } from 'lucide-react';
import { VideoDetails } from '@/services/youtubeService';
import { cn } from '@/lib/utils';

interface PlaylistItemProps {
  video: VideoDetails;
  isActive: boolean;
  isPlaying: boolean;
  onClick: () => void;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({ 
  video, 
  isActive, 
  isPlaying, 
  onClick 
}) => {
  return (
    <div 
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer group",
        isActive 
          ? "bg-vinyl-primary bg-opacity-10 hover:bg-opacity-20" 
          : "hover:bg-gray-100"
      )}
      onClick={onClick}
    >
      {/* Thumbnail with play indicator */}
      <div className="relative h-12 w-12 flex-shrink-0 rounded-md overflow-hidden">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className={cn(
          "absolute inset-0 flex items-center justify-center bg-black bg-opacity-40",
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}>
          {isActive && isPlaying ? (
            <Pause size={18} className="text-white" />
          ) : (
            <Play size={18} className="text-white ml-0.5" />
          )}
        </div>
      </div>

      {/* Song info */}
      <div className="flex-1 min-w-0">
        <h3 className={cn(
          "text-sm font-medium truncate",
          isActive ? "text-vinyl-primary" : "text-gray-800"
        )}>
          {video.title}
        </h3>
        <p className="text-xs text-gray-500 truncate">{video.artist}</p>
      </div>

      {/* Duration */}
      <span className="text-xs text-gray-400 flex-shrink-0">{video.duration}</span>
    </div>
  );
};

export default PlaylistItem;
