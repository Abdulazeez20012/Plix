const express = require('express');
const router = express.Router();
const { 
  searchMusic, 
  searchMovies, 
  searchTVShows,
  getTrendingMusic,
  getTrendingMovies,
  getTrendingTVShows
} = require('../services/entertainmentService');

// Search endpoints
router.get('/search/music', async (req, res) => {
  try {
    const { query } = req.query;
    const results = await searchMusic(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/search/movies', async (req, res) => {
  try {
    const { query } = req.query;
    const results = await searchMovies(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/search/tv', async (req, res) => {
  try {
    const { query } = req.query;
    const results = await searchTVShows(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Trending endpoints
router.get('/trending/music', async (req, res) => {
  try {
    const results = await getTrendingMusic();
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/trending/movies', async (req, res) => {
  try {
    const results = await getTrendingMovies();
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/trending/tv', async (req, res) => {
  try {
    const results = await getTrendingTVShows();
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;