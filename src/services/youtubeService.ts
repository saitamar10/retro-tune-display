
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
