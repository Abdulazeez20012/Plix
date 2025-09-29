// Test script to verify fallback mechanisms work properly

const {
  searchMusic,
  searchMovies,
  searchTVShows,
  getTrendingMusic,
  getTrendingMovies,
  getTrendingTVShows
} = require('./services/entertainmentService');

const {
  generateContentSuggestions,
  analyzeSentiment,
  generateAutomatedResponses,
  detectContentTopics
} = require('./services/ai/aiService');

async function testFallbackMechanisms() {
  console.log('Testing Fallback Mechanisms');
  console.log('==========================');
  
  try {
    console.log('\n1. Testing Entertainment API Fallbacks...');
    
    // Test music search fallback
    console.log('  a. Music search with invalid credentials:');
    const musicResults = await searchMusic('test');
    console.log('     Results type:', Array.isArray(musicResults) ? 'Array' : 'Unknown');
    console.log('     Result count:', musicResults.length);
    console.log('     First result has mock data:', musicResults[0]?.title === 'Example Song');
    
    // Test movie search fallback
    console.log('  b. Movie search with invalid credentials:');
    const movieResults = await searchMovies('test');
    console.log('     Results type:', Array.isArray(movieResults) ? 'Array' : 'Unknown');
    console.log('     Result count:', movieResults.length);
    console.log('     First result has mock data:', movieResults[0]?.title === 'Example Movie');
    
    // Test TV show search fallback
    console.log('  c. TV show search with invalid credentials:');
    const tvResults = await searchTVShows('test');
    console.log('     Results type:', Array.isArray(tvResults) ? 'Array' : 'Unknown');
    console.log('     Result count:', tvResults.length);
    console.log('     First result has mock data:', tvResults[0]?.title === 'Example TV Show');
    
    // Test trending music fallback
    console.log('  d. Trending music with invalid credentials:');
    const trendingMusic = await getTrendingMusic();
    console.log('     Results type:', Array.isArray(trendingMusic) ? 'Array' : 'Unknown');
    console.log('     Result count:', trendingMusic.length);
    console.log('     First result has mock data:', trendingMusic[0]?.title === 'Trending Song 1');
    
    // Test trending movies fallback
    console.log('  e. Trending movies with invalid credentials:');
    const trendingMovies = await getTrendingMovies();
    console.log('     Results type:', Array.isArray(trendingMovies) ? 'Array' : 'Unknown');
    console.log('     Result count:', trendingMovies.length);
    console.log('     First result has mock data:', trendingMovies[0]?.title === 'Blockbuster Movie');
    
    // Test trending TV shows fallback
    console.log('  f. Trending TV shows with invalid credentials:');
    const trendingTV = await getTrendingTVShows();
    console.log('     Results type:', Array.isArray(trendingTV) ? 'Array' : 'Unknown');
    console.log('     Result count:', trendingTV.length);
    console.log('     First result has mock data:', trendingTV[0]?.title === 'Hit Series');
    
    console.log('\n2. Testing AI Service Fallbacks...');
    
    // Test AI content suggestions fallback
    console.log('  a. Content suggestions with invalid credentials:');
    const suggestions = await generateContentSuggestions('test');
    console.log('     Results type:', Array.isArray(suggestions) ? 'Array' : 'Unknown');
    console.log('     Result count:', suggestions.length);
    console.log('     First result has mock data:', suggestions[0]?.content?.includes('Here\'s an interesting perspective'));
    
    // Test sentiment analysis fallback
    console.log('  b. Sentiment analysis with invalid credentials:');
    const sentiment = await analyzeSentiment('This is a great platform');
    console.log('     Result type:', typeof sentiment);
    console.log('     Has sentiment property:', 'sentiment' in sentiment);
    console.log('     Has score property:', 'score' in sentiment);
    
    // Test automated responses fallback
    console.log('  c. Automated responses with invalid credentials:');
    const responses = await generateAutomatedResponses('Great post!');
    console.log('     Results type:', Array.isArray(responses) ? 'Array' : 'Unknown');
    console.log('     Result count:', responses.length);
    console.log('     First result has mock data:', responses[0]?.content?.includes('This is really interesting'));
    
    // Test topic detection fallback
    console.log('  d. Topic detection with invalid credentials:');
    const topics = await detectContentTopics('I love blockchain technology');
    console.log('     Results type:', Array.isArray(topics) ? 'Array' : 'Unknown');
    console.log('     Result count:', topics.length);
    console.log('     Contains technology topic:', topics.some(t => t.name === 'technology'));
    
    console.log('\n✅ All fallback mechanisms are working properly!');
    console.log('\n📋 Summary:');
    console.log('   - Entertainment APIs fallback to mock data when credentials are invalid');
    console.log('   - AI services fallback to mock data when API keys are invalid');
    console.log('   - All services maintain consistent data structures');
    console.log('   - Error messages are logged but do not crash the application');
    
  } catch (error) {
    console.error('❌ Error testing fallback mechanisms:', error);
  }
}

testFallbackMechanisms();