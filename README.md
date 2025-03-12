
# Retro Vinyl YouTube Player

[![Lovable Project](https://img.shields.io/badge/Made%20with-Lovable-ff69b4)](https://lovable.dev/projects/0e7926cd-aede-4681-863f-2aa1e387fd96)

A nostalgic music player that transforms YouTube videos into a retro vinyl record experience. Watch as your favorite songs play on a virtual vinyl record with realistic animations and a vintage aesthetic.

![Vinyl Player Screenshot](https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg)

## Features

- **Vinyl Record Simulation**: Watch YouTube videos play as if they were on a vinyl record with realistic spinning animation
- **Playlist Management**: Create and manage your own playlist of YouTube videos
- **Search Functionality**: Easily find songs in your playlist
- **Favorites System**: Mark your favorite tracks for quick access
- **Responsive Design**: Works on desktop and mobile browsers

## How It Works

Simply paste a YouTube video URL into the input field, and the app will:

1. Extract the video ID
2. Fetch the video metadata (title, artist)
3. Add it to your playlist
4. Display it as a vinyl record when played

The audio comes directly from YouTube while the visual experience mimics the nostalgic feel of vinyl records.

## Upcoming Features

We're actively developing this project with plans to:

- Create a dedicated mobile application for iOS and Android
- Enhance the user interface with more retro-inspired elements
- Add custom vinyl record designs and animations
- Implement offline playback capabilities
- Integrate with music streaming services

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- shadcn/ui components
- YouTube oEmbed API

## Development

This project is built using [Lovable](https://lovable.dev), an AI-powered web application development platform.

To run the project locally:

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd retro-vinyl-player

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Deployment

### Deploy to Vercel

This project is configured for easy deployment to Vercel:

1. Fork or clone this repository to your GitHub account
2. Visit [Vercel](https://vercel.com) and sign up or log in
3. Click "New Project" and import your GitHub repository
4. Vercel will automatically detect the project configuration
5. Click "Deploy" and wait for the build to complete
6. Your site will be live at a Vercel URL (e.g., your-project.vercel.app)

You can also deploy directly from the command line:

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
vercel
```

## Mobile App Development

A mobile version of this application is currently in development. The upcoming mobile app will:

- Provide a native experience on iOS and Android
- Feature enhanced offline capabilities
- Include gesture controls for a more tactile vinyl experience
- Offer improved background playback
- Support home screen widgets for quick access

Stay tuned for updates on the mobile app release!

## License

MIT

## Acknowledgements

- YouTube API for video playback
- All the artists whose music brings this vinyl experience to life
- [Vercel](https://vercel.com) for hosting and deployment
