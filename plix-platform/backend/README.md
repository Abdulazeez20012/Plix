# Plix Backend Services

This directory contains the backend services for the Plix platform, including entertainment API integrations.

## Services

### Entertainment API Integration

The entertainment service provides integration with various entertainment APIs:

1. **Music APIs**: Integration with Spotify, Apple Music, etc.
2. **Movie APIs**: Integration with TMDB (The Movie Database), etc.
3. **TV Show APIs**: Integration with TMDB and other TV databases

## API Endpoints

### Search
- `GET /api/entertainment/search/music?query={search_term}` - Search for music
- `GET /api/entertainment/search/movies?query={search_term}` - Search for movies
- `GET /api/entertainment/search/tv?query={search_term}` - Search for TV shows

### Trending
- `GET /api/entertainment/trending/music` - Get trending music
- `GET /api/entertainment/trending/movies` - Get trending movies
- `GET /api/entertainment/trending/tv` - Get trending TV shows

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your API keys:
   ```env
   TMDB_API_KEY=your_tmdb_api_key
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   PORT=3001
   ```

3. Start the server:
   ```bash
   npm start
   ```

## Development

For development with auto-restart:
```bash
npm run dev
```

## How it works with Plix

1. The frontend makes requests to these endpoints to fetch entertainment content
2. The backend services query external APIs (Spotify, TMDB, etc.)
3. Results are processed and returned to the frontend
4. Users can discover and share entertainment content directly in their social feed

## Future Improvements

- Implement actual API connections to Spotify, TMDB, etc.
- Add caching for better performance
- Implement rate limiting
- Add more entertainment categories (books, podcasts, games)
- Add personalized recommendations