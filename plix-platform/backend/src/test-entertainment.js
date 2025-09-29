const { 
  searchMusic, 
  searchMovies, 
  searchTVShows,
  getTrendingMusic,
  getTrendingMovies,
  getTrendingTVShows
} = require('./services/entertainmentService');

async function testEntertainmentService() {
  console.log('Testing Entertainment Service');
  
  try {
    console.log('\n1. Testing music search...');
    const musicResults = await searchMusic('test');
    console.log('Music results:', musicResults);
    
    console.log('\n2. Testing movie search...');
    const movieResults = await searchMovies('test');
    console.log('Movie results:', movieResults);
    
    console.log('\n3. Testing TV show search...');
    const tvResults = await searchTVShows('test');
    console.log('TV show results:', tvResults);
    
    console.log('\n4. Testing trending music...');
    const trendingMusic = await getTrendingMusic();
    console.log('Trending music:', trendingMusic);
    
    console.log('\n5. Testing trending movies...');
    const trendingMovies = await getTrendingMovies();
    console.log('Trending movies:', trendingMovies);
    
    console.log('\n6. Testing trending TV shows...');
    const trendingTV = await getTrendingTVShows();
    console.log('Trending TV shows:', trendingTV);
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testEntertainmentService();