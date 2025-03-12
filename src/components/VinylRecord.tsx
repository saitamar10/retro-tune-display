
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface VinylRecordProps {
  isPlaying: boolean;
  coverImage?: string;
  rotationSpeed?: number;
}

const VinylRecord: React.FC<VinylRecordProps> = ({
  isPlaying,
  coverImage,
  rotationSpeed = 8
}) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(coverImage);

  useEffect(() => {
    setImageSrc(coverImage);
  }, [coverImage]);

  const handleImageError = () => {
    // Fallback to a default vinyl image
    setImageSrc('/lovable-uploads/4f2df6ea-ea19-44fa-82b4-0ac49cee3d64.png');
  };

  return (
    <div className="flex items-center justify-center">
      <div 
        className={cn(
          "vinyl-container animate-fade-in",
          isPlaying ? "animate-spin-vinyl" : "animate-spin-vinyl-pause"
        )}
        style={{ 
          animationDuration: `${rotationSpeed}s`, 
          backgroundImage: imageSrc ? `url(${imageSrc})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Vinyl record grooves effect */}
        <div className="vinyl-grooves"></div>
        
        {/* Center label of the vinyl */}
        <div className="vinyl-label">
          {imageSrc && (
            <img 
              src={imageSrc} 
              alt="Album art" 
              className="w-full h-full rounded-full object-cover"
              onError={handleImageError}
            />
          )}
        </div>
        
        {/* Center hole of the vinyl */}
        <div className="vinyl-spindle"></div>
      </div>
    </div>
  );
};

export default VinylRecord;
