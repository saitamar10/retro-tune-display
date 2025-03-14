
import React, { useState } from 'react';
import { toast } from 'sonner';
import { extractVideoId } from '@/services/youtubeService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface YouTubeInputProps {
  onVideoAdd: (videoId: string) => void;
}

const YouTubeInput: React.FC<YouTubeInputProps> = ({ onVideoAdd }) => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!youtubeUrl.trim()) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    setIsLoading(true);
    
    try {
      const videoId = extractVideoId(youtubeUrl);
      
      if (!videoId) {
        toast.error('Invalid YouTube URL. Please provide a valid YouTube video link.');
        setIsLoading(false);
        return;
      }
      
      onVideoAdd(videoId);
      setYoutubeUrl('');
    } catch (error) {
      toast.error('Failed to add video');
      console.error('Error adding video:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2 mb-4">
      <Input
        type="url"
        placeholder="Paste YouTube URL here..."
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
        className="flex-1 bg-black/10 border-gray-700/30 text-white placeholder:text-gray-500 rounded-full"
      />
      <Button 
        type="submit" 
        disabled={isLoading}
        className="bg-gray-700/50 hover:bg-gray-600/50 rounded-full text-sm px-4"
      >
        Add
      </Button>
    </form>
  );
};

export default YouTubeInput;
