
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
    setImageSrc('/lovable-uploads/ec176b61-13ac-4e82-8e86-577b4765fd45.png');
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
        {/* Minimalist design overlay for the vinyl record */}
        <div className="vinyl-design"></div>
        
        {/* Vinyl record grooves effect - enhanced for better visuals */}
        <div className="vinyl-grooves"></div>
        
        {/* Enhanced reflective effect */}
        <div className="vinyl-reflection"></div>
        
        {/* Center label of the vinyl */}
        <div className="vinyl-label">
          {imageSrc && (
            <img 
              src={imageSrc} 
              alt="Album art" 
              className="w-full h-full rounded-full object-cover opacity-80"
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
