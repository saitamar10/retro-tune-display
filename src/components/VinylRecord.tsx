
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

      <style jsx>{`
        .vinyl-container {
          position: relative;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background-color: #121212;
          overflow: hidden;
          box-shadow: 0 0 30px rgba(0, 0, 0, 0.8);
        }

        .vinyl-design {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(45deg, rgba(20, 20, 20, 0.8), rgba(40, 40, 40, 0.4));
          z-index: 1;
        }

        .vinyl-grooves {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 90%;
          height: 90%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: repeating-radial-gradient(
            circle at center,
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 0) 2px,
            rgba(30, 30, 30, 0.5) 2px,
            rgba(30, 30, 30, 0.5) 4px
          );
          z-index: 2;
        }

        .vinyl-reflection {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(
            135deg, 
            rgba(255, 255, 255, 0.1) 0%, 
            rgba(255, 255, 255, 0) 40%
          );
          z-index: 3;
        }

        .vinyl-label {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 35%;
          height: 35%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background-color: #333;
          z-index: 4;
          overflow: hidden;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }

        .vinyl-spindle {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 8%;
          height: 8%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background-color: #888;
          border: 2px solid #666;
          z-index: 5;
        }
      `}</style>
    </div>
  );
};

export default VinylRecord;
