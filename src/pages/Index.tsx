
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { VideoDetails, defaultVideos, formatTime } from '@/services/youtubeService';
import VinylRecord from '@/components/VinylRecord';
import PlayerControls from '@/components/PlayerControls';
import PlaylistItem from '@/components/PlaylistItem';
import YouTubeInput from '@/components/YouTubeInput';
import YouTubePlayer from '@/components/YouTubePlayer';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
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

  // Load favorites from localStorage
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

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('vinyl-player-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Update arm position based on playback status
  useEffect(() => {
    if (isPlaying) {
      // Move the arm onto the record when playing
      setArmPosition(0);
    } else {
      // Return the arm to resting position when paused
      setArmPosition(-45);
    }
  }, [isPlaying]);

  // Handle play/pause
  const handlePlayPause = () => {
    if (isPlayerReady) {
      setIsPlaying(!isPlaying);
    } else {
      toast.error('Player is not ready yet. Please wait a moment.');
    }
  };

  // Handle skip to next track
  const handleSkipNext = () => {
    if (playlist.length > 0) {
      setCurrentIndex((currentIndex + 1) % playlist.length);
      setCurrentTime(0);
      if (isPlaying) {
        setIsPlaying(true); // Maintain playing state
      }
    }
  };

  // Handle skip to previous track
  const handleSkipPrevious = () => {
    if (playlist.length > 0) {
      setCurrentIndex((currentIndex - 1 + playlist.length) % playlist.length);
      setCurrentTime(0);
      if (isPlaying) {
        setIsPlaying(true); // Maintain playing state
      }
    }
  };

  // Handle seeking to specific time
  const handleSeek = (newTime: number) => {
    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(newTime);
      setCurrentTime(newTime);
    }
  };

  // Handle track selection from playlist
  const handleSelectTrack = (index: number) => {
    setCurrentIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  // Handle toggle favorite
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

  // Player reference for imperative commands
  const playerRef = useRef<any>(null);

  // Add video to playlist
  const handleAddVideo = async (videoId: string) => {
    // Check if video already exists in playlist
    if (playlist.some(video => video.id === videoId)) {
      toast.info("This video is already in your playlist");
      return;
    }
    
    try {
      // For demo purposes, we're creating a placeholder entry with basic data
      // In a real app, you would fetch video details from YouTube API
      const newVideo: VideoDetails = {
        id: videoId,
        title: `YouTube Video (${videoId})`,
        artist: 'Unknown Artist',
        thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        duration: '0:00'
      };
      
      setPlaylist([...playlist, newVideo]);
      toast.success('Video added to playlist');
      
      // Play the new video immediately
      setCurrentIndex(playlist.length);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error adding video:', error);
      toast.error('Failed to add video');
    }
  };

  // Handle player ready
  const handlePlayerReady = () => {
    setIsPlayerReady(true);
    
    // Assign player ref for imperative methods
    if (playerRef.current !== null) return;
    
    try {
      // Get reference to YT player for imperative controls
      if (window.YT && window.YT.get) {
        playerRef.current = window.YT.get(document.querySelector('iframe')?.id);
      }
    } catch (e) {
      console.error('Error getting player reference:', e);
    }
  };

  // Handle time update
  const handleTimeUpdate = (currentTime: number, duration: number) => {
    setCurrentTime(currentTime);
    setDuration(duration);

    // If time is at the end, play next track
    if (duration > 0 && currentTime >= duration - 0.5) {
      handleSkipNext();
    }
  };

  // Handle player error
  const handlePlayerError = (error: any) => {
    console.error('YouTube player error:', error);
    toast.error('Error playing video. The video might be restricted or unavailable.');
    
    // Skip to next track on error
    setTimeout(handleSkipNext, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100 py-8 px-4 sm:px-6 md:px-8">
      <header className="w-full max-w-5xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-vinyl-dark text-center mb-2">
          Retro Vinyl Player
        </h1>
        <p className="text-center text-gray-500 max-w-md mx-auto">
          Experience your YouTube music as if it's playing on vinyl records
        </p>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto">
        <div className="player-container backdrop-blur-sm">
          {/* Player Header */}
          <div className="player-header">
            <div className="text-lg font-medium">Now Playing</div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 mt-6">
            {/* Record player section */}
            <div className="lg:w-1/2 flex flex-col items-center">
              <div className="relative mb-6">
                {/* Vinyl record */}
                <VinylRecord 
                  isPlaying={isPlaying}
                  coverImage={currentVideo?.thumbnail}
                />
                
                {/* Vinyl arm */}
                <div 
                  className="vinyl-arm" 
                  style={{ transform: `rotate(${armPosition}deg)` }}
                >
                  <div className="vinyl-arm-needle"></div>
                </div>
              </div>

              {/* Song info */}
              {currentVideo && (
                <div className="w-full text-center mb-6 animate-fade-in">
                  <h2 className="text-xl font-bold mb-1">{currentVideo.title}</h2>
                  <p className="text-gray-500">{currentVideo.artist}</p>
                </div>
              )}

              {/* Player controls */}
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

            {/* Playlist section */}
            <div className="lg:w-1/2">
              {/* Mobile playlist toggle */}
              {isMobile && (
                <button 
                  className="w-full py-2 mb-4 text-center bg-gray-100 rounded-lg font-medium"
                  onClick={() => setShowPlaylist(!showPlaylist)}
                >
                  {showPlaylist ? 'Hide Playlist' : 'Show Playlist'}
                </button>
              )}
              
              {(showPlaylist || !isMobile) && (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Your Playlist</h3>
                    
                    {/* Search bar */}
                    <div className="relative w-44 sm:w-64">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 h-9"
                      />
                    </div>
                  </div>

                  {/* YouTube URL input */}
                  <YouTubeInput onVideoAdd={handleAddVideo} />

                  {/* Playlist */}
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
                      <div className="text-center py-8 text-gray-500">
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

      {/* Hidden YouTube player */}
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
