import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Search, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { VideoDetails, defaultVideos, formatTime, fetchVideoDetails } from '@/services/youtubeService';
import VinylRecord from '@/components/VinylRecord';
import PlayerControls from '@/components/PlayerControls';
import PlaylistItem from '@/components/PlaylistItem';
import YouTubeInput from '@/components/YouTubeInput';
import YouTubePlayer from '@/components/YouTubePlayer';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const { videoId } = useParams<{ videoId?: string }>();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState<VideoDetails[]>([...defaultVideos]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [armPosition, setArmPosition] = useState(-45);
  const [rotationSpeed, setRotationSpeed] = useState(8);
  const isMobile = useIsMobile();
  
  const currentVideo = playlist[currentIndex];
  const filteredPlaylist = playlist.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    video.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const loadVideoFromUrl = async () => {
      if (videoId) {
        const existingIndex = playlist.findIndex(video => video.id === videoId);
        
        if (existingIndex !== -1) {
          setCurrentIndex(existingIndex);
          setIsPlaying(true);
        } else {
          try {
            const videoDetails = await fetchVideoDetails(videoId);
            setPlaylist([...playlist, videoDetails]);
            setCurrentIndex(playlist.length);
            setIsPlaying(true);
          } catch (error) {
            console.error('Error fetching video details:', error);
            toast.error('Failed to load video');
          }
        }
      }
    };

    loadVideoFromUrl();
  }, [videoId]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('vinyl-player-favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error('Error loading favorites from localStorage', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('vinyl-player-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (isPlaying) {
      setArmPosition(0);
    } else {
      setArmPosition(-45);
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    if (isPlayerReady) {
      setIsPlaying(!isPlaying);
    } else {
      toast.error('Player is not ready yet. Please wait a moment.');
    }
  };

  const handleSkipNext = () => {
    if (playlist.length > 0) {
      setCurrentIndex((currentIndex + 1) % playlist.length);
      setCurrentTime(0);
      if (isPlaying) {
        setIsPlaying(true);
      }
    }
  };

  const handleSkipPrevious = () => {
    if (playlist.length > 0) {
      setCurrentIndex((currentIndex - 1 + playlist.length) % playlist.length);
      setCurrentTime(0);
      if (isPlaying) {
        setIsPlaying(true);
      }
    }
  };

  const handleSeek = (newTime: number) => {
    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(newTime);
      setCurrentTime(newTime);
    }
  };

  const handleSeekForward = () => {
    handleSeek(Math.min(currentTime + 10, duration));
  };

  const handleSeekBackward = () => {
    handleSeek(Math.max(currentTime - 10, 0));
  };

  const handleSelectTrack = (index: number) => {
    setCurrentIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleToggleFavorite = () => {
    if (!currentVideo) return;
    
    if (favorites.includes(currentVideo.id)) {
      setFavorites(favorites.filter(id => id !== currentVideo.id));
      toast.info(`Removed from favorites`);
    } else {
      setFavorites([...favorites, currentVideo.id]);
      toast.success(`Added to favorites`);
    }
  };

  const handleRotationSpeedChange = (speed: number) => {
    setRotationSpeed(speed);
  };

  const playerRef = useRef<any>(null);

  const handleAddVideo = async (videoId: string) => {
    if (playlist.some(video => video.id === videoId)) {
      toast.info("This video is already in your playlist");
      return;
    }
    
    try {
      const videoDetails = await fetchVideoDetails(videoId);
      
      setPlaylist([...playlist, videoDetails]);
      toast.success('Video added to playlist');
      
      setCurrentIndex(playlist.length);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error adding video:', error);
      toast.error('Failed to add video');
    }
  };

  const handlePlayerReady = () => {
    setIsPlayerReady(true);
    
    if (playerRef.current !== null) return;
    
    try {
      if (window.YT && window.YT.get) {
        playerRef.current = window.YT.get(document.querySelector('iframe')?.id);
      }
    } catch (e) {
      console.error('Error getting player reference:', e);
    }
  };

  const handleTimeUpdate = (currentTime: number, duration: number) => {
    setCurrentTime(currentTime);
    setDuration(duration);

    if (duration > 0 && currentTime >= duration - 0.5) {
      handleSkipNext();
    }
  };

  const handlePlayerError = (error: any) => {
    console.error('YouTube player error:', error);
    toast.error('Error playing video. The video might be restricted or unavailable.');
    
    setTimeout(handleSkipNext, 2000);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black py-8 px-4 sm:px-6 md:px-8 text-white">
      <header className="w-full max-w-5xl mx-auto mb-8 flex items-center">
        <Button 
          variant="ghost" 
          className="mr-4 text-white hover:bg-white/10" 
          onClick={handleBackToHome}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Retro Vinyl Player
          </h1>
          <p className="text-gray-400 max-w-md">
            Experience your YouTube music as if it's playing on vinyl records
          </p>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto">
        <div className="player-container backdrop-blur-sm bg-black/40 border border-white/10 shadow-2xl rounded-xl p-6">
          <div className="player-header border-b border-white/10 pb-4 mb-6">
            <div className="text-lg font-medium">Now Playing</div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/2 flex flex-col items-center">
              <div className="relative mb-6 vinyl-player-area">
                <VinylRecord 
                  isPlaying={isPlaying}
                  coverImage={currentVideo?.thumbnail}
                  rotationSpeed={rotationSpeed}
                />
                
                <div 
                  className="vinyl-arm" 
                  style={{ transform: `rotate(${armPosition}deg)` }}
                >
                  <div className="vinyl-arm-needle"></div>
                </div>
              </div>

              {currentVideo && (
                <div className="w-full text-center mb-6 animate-fade-in">
                  <h2 className="text-xl font-bold mb-1">{currentVideo.title}</h2>
                  <p className="text-gray-400">{currentVideo.artist}</p>
                </div>
              )}

              <PlayerControls 
                isPlaying={isPlaying}
                duration={duration}
                currentTime={currentTime}
                volume={volume}
                onPlayPause={handlePlayPause}
                onSkipNext={handleSkipNext}
                onSkipPrevious={handleSkipPrevious}
                onSeek={handleSeek}
                onVolumeChange={setVolume}
                isFavorite={currentVideo ? favorites.includes(currentVideo.id) : false}
                onToggleFavorite={handleToggleFavorite}
                rotationSpeed={rotationSpeed}
                onRotationSpeedChange={handleRotationSpeedChange}
                onSeekForward={handleSeekForward}
                onSeekBackward={handleSeekBackward}
              />
            </div>

            <div className="lg:w-1/2">
              {isMobile && (
                <button 
                  className="w-full py-2 mb-4 text-center bg-white/10 rounded-lg font-medium"
                  onClick={() => setShowPlaylist(!showPlaylist)}
                >
                  {showPlaylist ? 'Hide Playlist' : 'Show Playlist'}
                </button>
              )}
              
              {(showPlaylist || !isMobile) && (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Your Playlist</h3>
                    
                    <div className="relative w-44 sm:w-64">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 h-9 bg-black/20 border-white/20 text-white"
                      />
                    </div>
                  </div>

                  <YouTubeInput onVideoAdd={handleAddVideo} />

                  <div className="overflow-y-auto max-h-[400px] pr-1 rounded-lg vinyl-playlist">
                    {filteredPlaylist.length > 0 ? (
                      filteredPlaylist.map((video, index) => (
                        <PlaylistItem
                          key={video.id}
                          video={video}
                          isActive={index === currentIndex}
                          isPlaying={isPlaying && index === currentIndex}
                          onClick={() => handleSelectTrack(playlist.indexOf(video))}
                        />
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        {searchTerm ? 'No results found' : 'Your playlist is empty'}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {currentVideo && (
        <YouTubePlayer
          videoId={currentVideo.id}
          isPlaying={isPlaying}
          volume={volume}
          onReady={handlePlayerReady}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnd={handleSkipNext}
          onTimeUpdate={handleTimeUpdate}
          onError={handlePlayerError}
        />
      )}

      <style>{`
        .vinyl-player-area {
          position: relative;
          width: 100%;
          max-width: 320px;
          aspect-ratio: 1;
        }
        
        .vinyl-arm {
          position: absolute;
          top: 30px;
          right: 10px;
          width: 120px;
          height: 20px;
          background-color: #444;
          border-radius: 4px;
          transform-origin: right center;
          transition: transform 1s ease;
          z-index: 10;
        }
        
        .vinyl-arm-needle {
          position: absolute;
          left: 0;
          top: 0;
          width: 20px;
          height: 6px;
          background-color: #999;
          border-radius: 2px;
          transform: translateY(-50%);
        }
        
        .player-container {
          display: flex;
          flex-direction: column;
          border-radius: 16px;
          overflow: hidden;
        }
        
        .vinyl-playlist {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }
        
        .vinyl-playlist::-webkit-scrollbar {
          width: 6px;
        }
        
        .vinyl-playlist::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .vinyl-playlist::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        
        @keyframes spin-vinyl {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes spin-vinyl-pause {
          to { transform: rotate(0); }
        }
        
        .animate-spin-vinyl {
          animation: spin-vinyl linear infinite;
        }
        
        .animate-spin-vinyl-pause {
          animation: spin-vinyl-pause 0.2s ease forwards;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-in;
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .progress-bar {
          position: relative;
          height: 6px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }
        
        .progress-bar-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background-color: #ffffff;
          border-radius: 3px;
          transition: width 0.1s linear;
        }
        
        .progress-bar-thumb {
          position: absolute;
          top: 50%;
          width: 12px;
          height: 12px;
          background-color: #ffffff;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
          transition: opacity 0.2s;
        }
        
        .progress-bar:hover .progress-bar-thumb {
          opacity: 1;
        }
        
        .control-button-primary-new {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(255, 255, 255, 0.9);
          color: black;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          transition: all 0.2s;
        }
        
        .control-button-primary-new:hover {
          background-color: white;
          transform: scale(1.05);
        }
        
        .control-button-minimal {
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.7);
          background: transparent;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          transition: all 0.2s;
        }
        
        .control-button-minimal:hover {
          color: white;
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .minimal-button {
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          padding: 8px;
          border-radius: 50%;
          transition: all 0.2s;
        }
        
        .minimal-button:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Index;
