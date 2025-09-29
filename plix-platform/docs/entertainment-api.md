# Entertainment API Integration for Plix

## Overview

The entertainment API integration allows Plix users to discover and share music, movies, and TV shows directly within the platform. This enhances user engagement by providing rich entertainment content.

## Features

1. **Search Functionality**: Users can search for music tracks, movies, and TV shows
2. **Trending Content**: Display trending entertainment content
3. **Content Sharing**: Users can share entertainment content in their posts
4. **Personalized Recommendations**: (Future feature) AI-powered recommendations

## Supported Entertainment Categories

### Music
- Search for songs, artists, and albums
- Preview tracks
- View album art and metadata

### Movies
- Search for movies by title, actor, or genre
- View movie posters, ratings, and descriptions
- Get release dates and runtime information

### TV Shows
- Search for TV series by title or actor
- View episode counts and season information
- Get ratings and descriptions

## API Endpoints

### Search Endpoints
- `GET /api/entertainment/search/music?query={term}` - Search music
- `GET /api/entertainment/search/movies?query={term}` - Search movies
- `GET /api/entertainment/search/tv?query={term}` - Search TV shows

### Trending Endpoints
- `GET /api/entertainment/trending/music` - Get trending music
- `GET /api/entertainment/trending/movies` - Get trending movies
- `GET /api/entertainment/trending/tv` - Get trending TV shows

## Integration with External Services

In a production environment, this service would integrate with:

1. **Spotify/Apple Music**: For music content
2. **TMDB (The Movie Database)**: For movie and TV show data
3. **Other Entertainment APIs**: As needed

## Data Structure

### Music Track
```json
{
  "id": "unique_identifier",
  "title": "Song Title",
  "artist": "Artist Name",
  "album": "Album Name",
  "duration": 210,
  "previewUrl": "https://example.com/preview.mp3",
  "imageUrl": "https://example.com/image.jpg",
  "type": "music"
}
```

### Movie
```json
{
  "id": "unique_identifier",
  "title": "Movie Title",
  "year": 2025,
  "rating": 8.5,
  "duration": 120,
  "genres": ["Action", "Adventure"],
  "posterUrl": "https://example.com/poster.jpg",
  "description": "Movie description",
  "type": "movie"
}
```

### TV Show
```json
{
  "id": "unique_identifier",
  "title": "TV Show Title",
  "year": 2023,
  "rating": 9.0,
  "seasons": 3,
  "episodes": 36,
  "genres": ["Drama", "Mystery"],
  "posterUrl": "https://example.com/poster.jpg",
  "description": "TV show description",
  "type": "tv"
}
```

## How it Enhances Plix

1. **Rich Content Sharing**: Users can share not just text, but also entertainment content
2. **Discovery**: Users can discover new music, movies, and TV shows through their social feed
3. **Engagement**: Entertainment content tends to generate more interactions
4. **Personalization**: Future AI features can use this data to personalize content

## Future Enhancements

1. **Actual API Integration**: Connect to real entertainment APIs
2. **Content Previews**: Embedded players for music and video previews
3. **User Collections**: Allow users to save favorite entertainment content
4. **Social Features**: See what friends are listening to or watching
5. **Recommendations**: AI-powered personalized entertainment recommendations