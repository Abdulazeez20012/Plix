const {
  generateContentSuggestions,
  personalizeContentFeed,
  analyzeSentiment,
  generateAutomatedResponses,
  detectContentTopics
} = require('./aiService');

async function testAIService() {
  console.log('Testing AI Service');
  
  try {
    console.log('\n1. Testing content suggestions...');
    const suggestions = await generateContentSuggestions('decentralized social media');
    console.log('Content suggestions:', suggestions);
    
    console.log('\n2. Testing content personalization...');
    const mockFeed = [
      { id: 'post_1', content: 'Post about technology' },
      { id: 'post_2', content: 'Post about entertainment' },
      { id: 'post_3', content: 'Post about sports' }
    ];
    
    const mockProfile = {
      interests: ['technology', 'blockchain']
    };
    
    const personalizedFeed = await personalizeContentFeed(mockFeed, mockProfile);
    console.log('Personalized feed:', personalizedFeed);
    
    console.log('\n3. Testing sentiment analysis...');
    const sentiment = await analyzeSentiment('This is a great platform with amazing features!');
    console.log('Sentiment analysis:', sentiment);
    
    console.log('\n4. Testing automated responses...');
    const responses = await generateAutomatedResponses('Just joined this amazing decentralized platform!');
    console.log('Automated responses:', responses);
    
    console.log('\n5. Testing topic detection...');
    const topics = await detectContentTopics('I love the new blockchain technology in this social media platform');
    console.log('Detected topics:', topics);
    
    console.log('\nAll AI tests completed successfully!');
  } catch (error) {
    console.error('AI test failed:', error);
  }
}

testAIService();