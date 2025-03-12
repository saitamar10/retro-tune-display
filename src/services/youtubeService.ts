
export interface VideoDetails {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
}

export const extractVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11 ? match[2] : null;
};

// Default music videos to showcase in the app
export const defaultVideos: VideoDetails[] = [
  {
    id: "dQw4w9WgXcQ",
    title: "Never Gonna Give You Up",
    artist: "Rick Astley",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    duration: "3:32"
  },
  {
    id: "Zi_XLOBDo_Y",
    title: "Billie Jean",
    artist: "Michael Jackson",
    thumbnail: "https://img.youtube.com/vi/Zi_XLOBDo_Y/mqdefault.jpg",
    duration: "4:54"
  },
  {
    id: "yPYZpwSpKmA",
    title: "Together Forever",
    artist: "Rick Astley",
    thumbnail: "https://img.youtube.com/vi/yPYZpwSpKmA/mqdefault.jpg",
    duration: "3:25"
  },
  {
    id: "QUQsqBqxoR4",
    title: "Wake Me Up",
    artist: "Avicii",
    thumbnail: "https://img.youtube.com/vi/QUQsqBqxoR4/mqdefault.jpg",
    duration: "4:32"
  },
  {
    id: "H9nPf7w7pDI",
    title: "Imagine",
    artist: "John Lennon",
    thumbnail: "https://img.youtube.com/vi/H9nPf7w7pDI/mqdefault.jpg",
    duration: "3:04"
  }
];

// Format seconds to MM:SS format
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

// Fetch video details from YouTube's oEmbed API
export const fetchVideoDetails = async (videoId: string): Promise<VideoDetails> => {
  try {
    // Use YouTube's oEmbed API to get video information
    const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch video details');
    }
    
    const data = await response.json();
    
    // Extract author and title
    let title = data.title;
    let artist = data.author_name || 'Unknown Artist';
    
    // Often YouTube titles include artist - title format, try to parse it
    if (title.includes(' - ')) {
      const parts = title.split(' - ');
      if (parts.length >= 2) {
        artist = parts[0].trim();
        title = parts.slice(1).join(' - ').trim();
      }
    }
    
    // Create the video details
    return {
      id: videoId,
      title: title,
      artist: artist,
      thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      duration: '0:00' // We can't get duration from oEmbed, will be updated when played
    };
  } catch (error) {
    console.error('Error fetching video details:', error);
    // Return a basic object if we can't fetch details
    return {
      id: videoId,
      title: 'YouTube Video',
      artist: 'Unknown Artist',
      thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      duration: '0:00'
    };
  }
};
