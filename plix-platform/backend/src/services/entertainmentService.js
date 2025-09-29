// Entertainment Service - Integrates with various entertainment APIs
const axios = require('axios');

// API configuration - in production, these would be stored in environment variables
const TMDB_API_KEY = process.env.TMDB_API_KEY || 'your_tmdb_api_key';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || 'your_spotify_client_id';
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || 'your_spotify_client_secret';
const SPOTIFY_ACCOUNT_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

let spotifyAccessToken = null;
let spotifyTokenExpiry = null;

/**
 * Get Spotify access token
 * @returns {Promise<string>} - Spotify access token
 */
async function getSpotifyAccessToken() {
  // Check if we have a valid token
  if (spotifyAccessToken && spotifyTokenExpiry && Date.now() < spotifyTokenExpiry) {
    return spotifyAccessToken;
  }

  try {
    // Get new access token
    const response = await axios.post(
      SPOTIFY_ACCOUNT_URL,
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')
        }
      }
    );

    spotifyAccessToken = response.data.access_token;
    spotifyTokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000; // Expire 1 minute early

    return spotifyAccessToken;
  } catch (error) {
    console.error('Error getting Spotify access token:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with Spotify API');
  }
}

/**
 * Search for music tracks on Spotify
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Array of music tracks
 */
async function searchMusic(query) {
  try {
    const accessToken = await getSpotifyAccessToken();
    
    const response = await axios.get(`${SPOTIFY_API_URL}/search`, {
      params: {
        q: query,
        type: 'track',
        limit: 10
      },
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return response.data.tracks.items.map(track => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      album: track.album.name,
      duration: Math.floor(track.duration_ms / 1000),
      previewUrl: track.preview_url,
      imageUrl: track.album.images.length > 0 ? track.album.images[0].url : null,
      type: 'music',
      externalUrl: track.external_urls.spotify
    }));
  } catch (error) {
    console.error('Error searching music on Spotify:', error.response?.data || error.message);
    // Fallback to mock data if API fails
    return [
      {
        id: 'track_1',
        title: 'Example Song',
        artist: 'Example Artist',
        album: 'Example Album',
        duration: 210,
        previewUrl: 'https://example.com/preview.mp3',
        imageUrl: 'https://placehold.co/300x300',
        type: 'music'
      },
      {
        id: 'track_2',
        title: 'Another Song',
        artist: 'Another Artist',
        album: 'Another Album',
        duration: 180,
        previewUrl: 'https://example.com/preview2.mp3',
        imageUrl: 'https://placehold.co/300x300',
        type: 'music'
      }
    ];
  }
}

/**
 * Search for movies on TMDB
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Array of movies
 */
async function searchMovies(query) {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query: query,
        language: 'en-US',
        page: 1,
        include_adult: false
      }
    });

    return response.data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
      rating: movie.vote_average,
      duration: null, // TMDB doesn't provide duration in search results
      genres: movie.genre_ids, // These are genre IDs, would need another API call to get names
      posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : null,
      description: movie.overview,
      type: 'movie'
    }));
  } catch (error) {
    console.error('Error searching movies on TMDB:', error.response?.data || error.message);
    // Fallback to mock data if API fails
    return [
      {
        id: 'movie_1',
        title: 'Example Movie',
        year: 2025,
        rating: 8.5,
        duration: 120,
        genres: ['Action', 'Adventure'],
        posterUrl: 'https://placehold.co/300x450',
        description: 'An example movie description',
        type: 'movie'
      },
      {
        id: 'movie_2',
        title: 'Another Movie',
        year: 2024,
        rating: 7.9,
        duration: 105,
        genres: ['Comedy', 'Drama'],
        posterUrl: 'https://placehold.co/300x450',
        description: 'Another example movie description',
        type: 'movie'
      }
    ];
  }
}

/**
 * Search for TV shows on TMDB
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Array of TV shows
 */
async function searchTVShows(query) {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/tv`, {
      params: {
        api_key: TMDB_API_KEY,
        query: query,
        language: 'en-US',
        page: 1,
        include_adult: false
      }
    });

    return response.data.results.map(show => ({
      id: show.id,
      title: show.name,
      year: show.first_air_date ? new Date(show.first_air_date).getFullYear() : null,
      rating: show.vote_average,
      seasons: show.number_of_seasons,
      episodes: show.number_of_episodes,
      genres: show.genre_ids, // These are genre IDs, would need another API call to get names
      posterUrl: show.poster_path ? `https://image.tmdb.org/t/p/w300${show.poster_path}` : null,
      description: show.overview,
      type: 'tv'
    }));
  } catch (error) {
    console.error('Error searching TV shows on TMDB:', error.response?.data || error.message);
    // Fallback to mock data if API fails
    return [
      {
        id: 'show_1',
        title: 'Example TV Show',
        year: 2023,
        rating: 9.0,
        seasons: 3,
        episodes: 36,
        genres: ['Drama', 'Mystery'],
        posterUrl: 'https://placehold.co/300x450',
        description: 'An example TV show description',
        type: 'tv'
      },
      {
        id: 'show_2',
        title: 'Another TV Show',
        year: 2022,
        rating: 8.2,
        seasons: 5,
        episodes: 60,
        genres: ['Comedy'],
        posterUrl: 'https://placehold.co/300x450',
        description: 'Another example TV show description',
        type: 'tv'
      }
    ];
  }
}

/**
 * Get trending music from Spotify
 * @returns {Promise<Array>} - Array of trending music tracks
 */
async function getTrendingMusic() {
  try {
    const accessToken = await getSpotifyAccessToken();
    
    const response = await axios.get(`${SPOTIFY_API_URL}/playlists/37i9dQZEVXbLRQDuF5jeBp`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return response.data.tracks.items.slice(0, 10).map(item => {
      const track = item.track;
      return {
        id: track.id,
        title: track.name,
        artist: track.artists.map(artist => artist.name).join(', '),
        album: track.album.name,
        duration: Math.floor(track.duration_ms / 1000),
        previewUrl: track.preview_url,
        imageUrl: track.album.images.length > 0 ? track.album.images[0].url : null,
        type: 'music',
        externalUrl: track.external_urls.spotify
      };
    });
  } catch (error) {
    console.error('Error getting trending music from Spotify:', error.response?.data || error.message);
    // Fallback to mock data if API fails
    return [
      {
        id: 'trend_1',
        title: 'Trending Song 1',
        artist: 'Popular Artist',
        album: 'Hot Album',
        duration: 200,
        previewUrl: 'https://example.com/preview.mp3',
        imageUrl: 'https://placehold.co/300x300',
        type: 'music'
      },
      {
        id: 'trend_2',
        title: 'Trending Song 2',
        artist: 'Hot Artist',
        album: 'Popular Album',
        duration: 220,
        previewUrl: 'https://example.com/preview2.mp3',
        imageUrl: 'https://placehold.co/300x300',
        type: 'music'
      }
    ];
  }
}

/**
 * Get trending movies from TMDB
 * @returns {Promise<Array>} - Array of trending movies
 */
async function getTrendingMovies() {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/week`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US'
      }
    });

    return response.data.results.slice(0, 10).map(movie => ({
      id: movie.id,
      title: movie.title,
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
      rating: movie.vote_average,
      duration: null, // TMDB doesn't provide duration in trending results
      genres: movie.genre_ids, // These are genre IDs, would need another API call to get names
      posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : null,
      description: movie.overview,
      type: 'movie'
    }));
  } catch (error) {
    console.error('Error getting trending movies from TMDB:', error.response?.data || error.message);
    // Fallback to mock data if API fails
    return [
      {
        id: 'trend_movie_1',
        title: 'Blockbuster Movie',
        year: 2025,
        rating: 9.2,
        duration: 135,
        genres: ['Action', 'Sci-Fi'],
        posterUrl: 'https://placehold.co/300x450',
        description: 'The biggest movie of the year',
        type: 'movie'
      },
      {
        id: 'trend_movie_2',
        title: 'Award Winner',
        year: 2024,
        rating: 8.8,
        duration: 115,
        genres: ['Drama'],
        posterUrl: 'https://placehold.co/300x450',
        description: 'Critically acclaimed drama',
        type: 'movie'
      }
    ];
  }
}

/**
 * Get trending TV shows from TMDB
 * @returns {Promise<Array>} - Array of trending TV shows
 */
async function getTrendingTVShows() {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/trending/tv/week`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US'
      }
    });

    return response.data.results.slice(0, 10).map(show => ({
      id: show.id,
      title: show.name,
      year: show.first_air_date ? new Date(show.first_air_date).getFullYear() : null,
      rating: show.vote_average,
      seasons: show.number_of_seasons,
      episodes: show.number_of_episodes,
      genres: show.genre_ids, // These are genre IDs, would need another API call to get names
      posterUrl: show.poster_path ? `https://image.tmdb.org/t/p/w300${show.poster_path}` : null,
      description: show.overview,
      type: 'tv'
    }));
  } catch (error) {
    console.error('Error getting trending TV shows from TMDB:', error.response?.data || error.message);
    // Fallback to mock data if API fails
    return [
      {
        id: 'trend_show_1',
        title: 'Hit Series',
        year: 2025,
        rating: 9.5,
        seasons: 2,
        episodes: 20,
        genres: ['Drama', 'Thriller'],
        posterUrl: 'https://placehold.co/300x450',
        description: 'The most watched series right now',
        type: 'tv'
      },
      {
        id: 'trend_show_2',
        title: 'Comedy Gold',
        year: 2024,
        rating: 8.5,
        seasons: 4,
        episodes: 40,
        genres: ['Comedy'],
        posterUrl: 'https://placehold.co/300x450',
        description: 'Hilarious comedy that everyone is talking about',
        type: 'tv'
      }
    ];
  }
}

module.exports = {
  searchMusic,
  searchMovies,
  searchTVShows,
  getTrendingMusic,
  getTrendingMovies,
  getTrendingTVShows
};