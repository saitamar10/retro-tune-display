
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Library, Disc, User, Music, Headphones, Radio } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { defaultVideos } from '@/services/youtubeService';

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleMusicClick = (videoId: string) => {
    navigate(`/player/${videoId}`);
  };

  const recentlyPlayed = [...defaultVideos].slice(0, 5);
  
  const mixes = [
    { id: 'mix1', title: 'Indie Mix', thumbnail: 'https://picsum.photos/id/1/300/300', genre: 'Indie, Alternative, Folk'},
    { id: 'mix2', title: 'Rock Mix', thumbnail: 'https://picsum.photos/id/2/300/300', genre: 'Classic Rock, Hard Rock, Metal'},
    { id: 'mix3', title: 'Moody Mix', thumbnail: 'https://picsum.photos/id/3/300/300', genre: 'Ambient, Chillwave, Lo-fi'},
    { id: 'mix4', title: 'Chill Mix', thumbnail: 'https://picsum.photos/id/4/300/300', genre: 'Lo-fi, Downtempo, Ambient'},
    { id: 'mix5', title: 'Classical Mix', thumbnail: 'https://picsum.photos/id/5/300/300', genre: 'Piano, Orchestra, Violin'}
  ];

  const moods = [
    { id: 'mood1', name: 'Jazz' },
    { id: 'mood2', name: 'Alternative Rock' },
    { id: 'mood3', name: 'Blues' },
    { id: 'mood4', name: 'Techno' },
    { id: 'mood5', name: 'Soul' },
    { id: 'mood6', name: 'Blues' }
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-black bg-opacity-30 p-6 flex flex-col">
        {/* User profile */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-vinyl-primary rounded-full flex items-center justify-center">
            <User size={20} />
          </div>
          <div>
            <h3 className="font-medium">Music Lover</h3>
            <p className="text-xs text-gray-400">Premium User</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-6 flex-1">
          <div>
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10">
              <Search className="mr-2 h-4 w-4" />
              Explore
            </Button>
          </div>
          
          <div>
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10">
              <Library className="mr-2 h-4 w-4" />
              Your Library
            </Button>
          </div>
          
          <div>
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10">
              <Disc className="mr-2 h-4 w-4" />
              Albums
            </Button>
          </div>
          
          <div>
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10">
              <Music className="mr-2 h-4 w-4" />
              Artists
            </Button>
          </div>
          
          <div>
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10">
              <Headphones className="mr-2 h-4 w-4" />
              Podcasts
            </Button>
          </div>
        </nav>

        {/* Mood section */}
        <div>
          <h3 className="text-sm font-medium mb-4">Mood</h3>
          <div className="grid grid-cols-2 gap-2">
            {moods.map(mood => (
              <Button 
                key={mood.id}
                variant="secondary" 
                className="h-16 bg-white/10 hover:bg-white/20 text-xs"
              >
                {mood.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Hi, Music Lover!</h1>
          
          {/* Search bar */}
          <div className="relative w-full max-w-md mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="What do you want to play?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-none text-white"
            />
          </div>

          {/* Category filter */}
          <div className="flex gap-2 mb-4">
            <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30">
              All
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10">
              Music
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10">
              Podcast
            </Button>
          </div>
        </div>

        {/* Recently played section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recently played</h2>
            <Button variant="link" className="text-gray-400 hover:text-white">
              Show all
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {recentlyPlayed.map(item => (
              <div 
                key={item.id}
                className="bg-white/5 p-4 rounded-lg cursor-pointer hover:bg-white/10 transition"
                onClick={() => handleMusicClick(item.id)}
              >
                <div className="relative aspect-square mb-3 overflow-hidden rounded-md">
                  <img 
                    src={item.thumbnail} 
                    alt={item.title} 
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 hover:opacity-30 transition-opacity flex items-center justify-center">
                    <Radio size={30} className="text-white" />
                  </div>
                </div>
                <h3 className="font-medium text-sm line-clamp-1">{item.title}</h3>
                <p className="text-xs text-gray-400 line-clamp-1">{item.artist}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Your top mixes section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your top mixes</h2>
            <Button variant="link" className="text-gray-400 hover:text-white">
              Show all
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {mixes.map(mix => (
              <div 
                key={mix.id}
                className="bg-white/5 p-4 rounded-lg cursor-pointer hover:bg-white/10 transition"
                onClick={() => navigate('/player/dQw4w9WgXcQ')}
              >
                <div className="aspect-square mb-3 overflow-hidden rounded-md">
                  <img 
                    src={mix.thumbnail} 
                    alt={mix.title} 
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="font-medium text-sm">{mix.title}</h3>
                <p className="text-xs text-gray-400 line-clamp-1">{mix.genre}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
