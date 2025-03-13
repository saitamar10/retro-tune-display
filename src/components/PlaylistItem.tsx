
import React from 'react';
import { Play, Pause, Heart, X, ListMusic } from 'lucide-react';
import { VideoDetails } from '@/services/youtubeService';
import { cn } from '@/lib/utils';

interface PlaylistItemProps {
  video: VideoDetails;
  isActive: boolean;
  isPlaying: boolean;
  onClick: () => void;
  index: number;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onRemove?: () => void;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({ 
  video, 
  isActive, 
  isPlaying, 
  onClick,
  index,
  isFavorite = false,
  onToggleFavorite,
  onRemove
}) => {
  return (
    <div 
      className={cn(
        "flex items-center gap-3 px-4 py-3 hover:bg-[#f5f5f5]/10 transition-colors cursor-pointer border-b border-white/10",
        isActive ? "bg-[#8b5cf6]/10" : ""
      )}
      onClick={onClick}
    >
      {/* Track number */}
      <div className="w-8 text-center text-gray-400 text-sm">
        {index + 1}
      </div>
      
      {/* Play/pause indicator */}
      <div className="w-8 flex-shrink-0 flex items-center justify-center">
        {isActive ? (
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            isPlaying ? "text-white" : "text-white"
          )}>
            {isPlaying ? 
              <Pause size={16} className="text-[#8b5cf6]" /> : 
              <Play size={16} className="text-[#8b5cf6] ml-0.5" />
            }
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Play size={16} className="text-white ml-0.5" />
          </div>
        )}
      </div>

      {/* Song info */}
      <div className="flex-1 min-w-0">
        <h3 className={cn(
          "text-sm font-medium truncate",
          isActive ? "text-[#8b5cf6]" : "text-white"
        )}>
          {video.title}
        </h3>
        <p className="text-xs text-gray-400 truncate">{video.artist}</p>
      </div>

      {/* Duration */}
      <span className="text-xs text-gray-400 flex-shrink-0 w-12 text-center">{video.duration}</span>
      
      {/* Action buttons */}
      <div className="flex items-center gap-2">
        {onToggleFavorite && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="text-gray-400 hover:text-[#8b5cf6] transition-colors"
          >
            <Heart 
              size={16} 
              className={cn(isFavorite ? "text-[#8b5cf6] fill-[#8b5cf6]" : "text-gray-400")} 
            />
          </button>
        )}
        
        <button 
          className="text-gray-400 hover:text-[#8b5cf6] transition-colors"
        >
          <ListMusic size={16} />
        </button>
        
        {onRemove && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default PlaylistItem;
