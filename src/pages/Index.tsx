
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
  const [favorites, setFavorites] = useState<string[]>([]); // Array of video IDs
  const [searchTerm, setSearchTerm] = useState('');
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [armPosition, setArmPosition] = useState(-45);
  const isMobile = useIsMobile();
  
  const currentVideo = playlist[currentIndex];
  const filteredPlaylist = playlist.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    video.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle videoId from URL parameter
  useEffect(() => {
    const loadVideoFromUrl = async () => {
      if (videoId) {
        // Check if video is already in playlist
        const existingIndex = playlist.findIndex(video => video.id === videoId);
        
        if (existingIndex !== -1) {
          // Video exists in playlist, set it as current
          setCurrentIndex(existingIndex);
          setIsPlaying(true);
        } else {
          // Video not in playlist, fetch and add it
          try {
            const videoDetails = await fetchVideoDetails(videoId);
            setPlaylist([...playlist, videoDetails]);
            setCurrentIndex(playlist.length); // Index of the newly added video
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
        <div className="player-container backdrop-blur-sm bg-white/5 border border-white/10">
          <div className="player-header">
            <div className="text-lg font-medium">Now Playing</div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 mt-6">
            <div className="lg:w-1/2 flex flex-col items-center">
              <div className="relative mb-6">
                <VinylRecord 
                  isPlaying={isPlaying}
                  coverImage={currentVideo?.thumbnail}
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
                        className="pl-8 h-9 bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>

                  <YouTubeInput onVideoAdd={handleAddVideo} />

                  <div className="overflow-y-auto max-h-[400px] pr-1 rounded-lg">
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
    </div>
  );
};

export default Index;
