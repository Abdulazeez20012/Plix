// AI Service for Plix Platform
// This service provides AI-powered features for content generation and personalization
const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your_openai_api_key_here',
});

/**
 * Generate content suggestions based on user input using GPT
 * @param {string} input - User input text
 * @returns {Promise<Array>} - Array of content suggestions
 */
async function generateContentSuggestions(input) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates content suggestions for social media posts. Provide 3 different types of suggestions: 1) A text suggestion that expands on the topic, 2) A thought-provoking question related to the topic, 3) A related topic suggestion. Respond in JSON format with an array of suggestions."
        },
        {
          role: "user",
          content: `Generate content suggestions for this input: "${input}"`
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const responseText = completion.choices[0].message.content;
    
    // Try to parse as JSON, fallback to mock if parsing fails
    try {
      const suggestions = JSON.parse(responseText);
      return suggestions.map((suggestion, index) => ({
        id: `suggestion_${index + 1}`,
        ...suggestion
      }));
    } catch (parseError) {
      // If JSON parsing fails, create suggestions from the text response
      return [
        {
          id: 'suggestion_1',
          type: 'text',
          content: responseText.substring(0, 100) + '...',
          relevance: 0.9
        },
        {
          id: 'suggestion_2',
          type: 'question',
          content: `What are your thoughts on "${input}"?`,
          relevance: 0.8
        },
        {
          id: 'suggestion_3',
          type: 'topic',
          content: `Related to: ${input}`,
          relevance: 0.7
        }
      ];
    }
  } catch (error) {
    console.error('Error generating content suggestions with OpenAI:', error.message);
    // Fallback to mock suggestions
    return [
      {
        id: 'suggestion_1',
        type: 'text',
        content: `Here's an interesting perspective on "${input}" that you might want to explore...`,
        relevance: 0.95
      },
      {
        id: 'suggestion_2',
        type: 'question',
        content: `What are your thoughts on how "${input}" is changing our society?`,
        relevance: 0.87
      },
      {
        id: 'suggestion_3',
        type: 'topic',
        content: `Related topic: The future of ${input}`,
        relevance: 0.82
      }
    ];
  }
}

/**
 * Personalize content feed for a user using machine learning
 * @param {Array} contentFeed - Current content feed
 * @param {Object} userProfile - User's profile information
 * @returns {Promise<Array>} - Personalized content feed
 */
async function personalizeContentFeed(contentFeed, userProfile) {
  try {
    // For personalization, we'll use a simpler approach with OpenAI
    // In a production environment, this would use a dedicated recommendation system
    
    const userInterests = userProfile.interests || [];
    const userBio = userProfile.bio || '';
    
    // Create a prompt for ranking content
    const contentDescriptions = contentFeed.map((item, index) => 
      `${index + 1}. ${item.content || item.title || 'No content'}`
    ).join('\n');
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a content recommendation system. Rank the following content items based on how well they match the user's interests. Respond with a JSON array of objects containing the item index and a relevance score between 0 and 1."
        },
        {
          role: "user",
          content: `User interests: ${userInterests.join(', ')}
User bio: ${userBio}

Content items:
${contentDescriptions}`
        }
      ],
      temperature: 0.3,
      max_tokens: 200,
    });

    const responseText = completion.choices[0].message.content;
    
    // Try to parse the response
    try {
      const rankings = JSON.parse(responseText);
      
      // Apply rankings to content feed
      return contentFeed.map((item, index) => {
        const ranking = rankings.find(r => r.index === index + 1);
        return {
          ...item,
          personalizationScore: ranking ? ranking.score : 0.5,
          personalizedTags: userInterests
        };
      }).sort((a, b) => b.personalizationScore - a.personalizationScore);
    } catch (parseError) {
      // Fallback to simple keyword matching if parsing fails
      return contentFeed.map((item, index) => {
        // Simple keyword matching based on user interests
        const content = item.content || item.title || '';
        const matches = userInterests.filter(interest => 
          content.toLowerCase().includes(interest.toLowerCase())
        ).length;
        
        return {
          ...item,
          personalizationScore: matches > 0 ? 0.5 + (matches * 0.1) : Math.random() * 0.5,
          personalizedTags: userInterests
        };
      }).sort((a, b) => b.personalizationScore - a.personalizationScore);
    }
  } catch (error) {
    console.error('Error personalizing content feed with OpenAI:', error.message);
    // Fallback to mock personalization
    return contentFeed.map((item, index) => {
      return {
        ...item,
        personalizationScore: Math.random() * 0.5 + 0.5, // Random score between 0.5 and 1.0
        personalizedTags: userProfile.interests || []
      };
    }).sort((a, b) => b.personalizationScore - a.personalizationScore);
  }
}

/**
 * Analyze sentiment of user content using OpenAI
 * @param {string} content - User content to analyze
 * @returns {Promise<Object>} - Sentiment analysis results
 */
async function analyzeSentiment(content) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Analyze the sentiment of the following text. Respond in JSON format with sentiment (positive, negative, or neutral), score (between -1 and 1), and confidence (between 0 and 1)."
        },
        {
          role: "user",
          content: `Analyze sentiment: "${content}"`
        }
      ],
      temperature: 0.1,
      max_tokens: 100,
    });

    const responseText = completion.choices[0].message.content;
    
    // Try to parse as JSON
    try {
      const result = JSON.parse(responseText);
      return {
        sentiment: result.sentiment || 'neutral',
        score: result.score || 0,
        confidence: result.confidence || 0.8
      };
    } catch (parseError) {
      // Fallback to keyword-based analysis if parsing fails
      const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'like'];
      const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'disappointing', 'worst', 'hate', 'dislike'];
      
      let positiveCount = 0;
      let negativeCount = 0;
      
      const words = content.toLowerCase().split(/\s+/);
      
      words.forEach(word => {
        if (positiveWords.includes(word)) positiveCount++;
        if (negativeWords.includes(word)) negativeCount++;
      });
      
      let sentiment = 'neutral';
      let score = 0;
      
      if (positiveCount > negativeCount) {
        sentiment = 'positive';
        score = positiveCount / (positiveCount + negativeCount);
      } else if (negativeCount > positiveCount) {
        sentiment = 'negative';
        score = - (negativeCount / (positiveCount + negativeCount));
      }
      
      return {
        sentiment,
        score,
        confidence: Math.min(0.8, Math.abs(score) * 2)
      };
    }
  } catch (error) {
    console.error('Error analyzing sentiment with OpenAI:', error.message);
    // Fallback to mock sentiment analysis
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'disappointing', 'worst'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    const words = content.toLowerCase().split(/\s+/);
    
    words.forEach(word => {
      if (positiveWords.includes(word)) positiveCount++;
      if (negativeWords.includes(word)) negativeCount++;
    });
    
    let sentiment = 'neutral';
    let score = 0;
    
    if (positiveCount > negativeCount) {
      sentiment = 'positive';
      score = positiveCount / (positiveCount + negativeCount);
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative';
      score = - (negativeCount / (positiveCount + negativeCount));
    }
    
    return {
      sentiment,
      score,
      confidence: Math.min(0.8, Math.abs(score) * 2)
    };
  }
}

/**
 * Generate automated responses to user posts using OpenAI
 * @param {string} postContent - Content of the post to respond to
 * @returns {Promise<Array>} - Array of suggested responses
 */
async function generateAutomatedResponses(postContent) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Generate 3 different types of responses to a social media post: 1) An engaging response that asks for more information, 2) An agreement response that shows support, 3) An appreciation response that thanks the poster. Respond in JSON format as an array of response objects."
        },
        {
          role: "user",
          content: `Generate responses for this post: "${postContent}"`
        }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const responseText = completion.choices[0].message.content;
    
    // Try to parse as JSON
    try {
      const responses = JSON.parse(responseText);
      return responses.map((response, index) => ({
        id: `response_${index + 1}`,
        ...response
      }));
    } catch (parseError) {
      // Fallback to text-based responses if parsing fails
      return [
        {
          id: 'response_1',
          content: responseText.substring(0, 80) + '...',
          type: 'engagement'
        },
        {
          id: 'response_2',
          content: 'I agree with your perspective!',
          type: 'agreement'
        },
        {
          id: 'response_3',
          content: 'Thanks for sharing this!',
          type: 'appreciation'
        }
      ];
    }
  } catch (error) {
    console.error('Error generating automated responses with OpenAI:', error.message);
    // Fallback to mock responses
    return [
      {
        id: 'response_1',
        content: 'This is really interesting! Can you tell me more?',
        type: 'engagement'
      },
      {
        id: 'response_2',
        content: 'I totally agree with your perspective.',
        type: 'agreement'
      },
      {
        id: 'response_3',
        content: 'Thanks for sharing this. It gave me a new perspective.',
        type: 'appreciation'
      }
    ];
  }
}

/**
 * Detect content topics and categories using OpenAI
 * @param {string} content - Content to analyze
 * @returns {Promise<Array>} - Array of detected topics
 */
async function detectContentTopics(content) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Identify the main topics in the following text. Respond in JSON format as an array of topic objects, each with name, confidence (0-1), and relevant keywords found."
        },
        {
          role: "user",
          content: `Identify topics: "${content}"`
        }
      ],
      temperature: 0.3,
      max_tokens: 150,
    });

    const responseText = completion.choices[0].message.content;
    
    // Try to parse as JSON
    try {
      const topics = JSON.parse(responseText);
      return topics;
    } catch (parseError) {
      // Fallback to keyword-based detection if parsing fails
      const topicKeywords = {
        technology: ['tech', 'software', 'AI', 'blockchain', 'crypto', 'programming', 'digital', 'innovation'],
        entertainment: ['music', 'movie', 'film', 'TV', 'show', 'concert', 'entertainment', 'celebrity'],
        sports: ['football', 'basketball', 'soccer', 'tennis', 'game', 'match', 'sports', 'athlete'],
        politics: ['government', 'election', 'policy', 'president', 'senate', 'congress', 'politics', 'political'],
        science: ['research', 'study', 'experiment', 'discovery', 'scientist', 'science', 'scientific'],
        health: ['fitness', 'exercise', 'diet', 'nutrition', 'wellness', 'health', 'medical', 'doctor']
      };
      
      const words = content.toLowerCase().split(/\s+/);
      const detectedTopics = [];
      
      Object.keys(topicKeywords).forEach(topic => {
        const keywords = topicKeywords[topic];
        const matches = words.filter(word => keywords.includes(word));
        
        if (matches.length > 0) {
          detectedTopics.push({
            name: topic,
            confidence: Math.min(0.95, matches.length / keywords.length),
            keywords: matches
          });
        }
      });
      
      return detectedTopics;
    }
  } catch (error) {
    console.error('Error detecting content topics with OpenAI:', error.message);
    // Fallback to mock topic detection
    const topicKeywords = {
      technology: ['tech', 'software', 'AI', 'blockchain', 'crypto', 'programming'],
      entertainment: ['music', 'movie', 'film', 'TV', 'show', 'concert'],
      sports: ['football', 'basketball', 'soccer', 'tennis', 'game', 'match'],
      politics: ['government', 'election', 'policy', 'president', 'senate', 'congress'],
      science: ['research', 'study', 'experiment', 'discovery', 'scientist'],
      health: ['fitness', 'exercise', 'diet', 'nutrition', 'wellness']
    };
    
    const words = content.toLowerCase().split(/\s+/);
    const topics = [];
    
    Object.keys(topicKeywords).forEach(topic => {
      const keywords = topicKeywords[topic];
      const matches = words.filter(word => keywords.includes(word));
      
      if (matches.length > 0) {
        topics.push({
          name: topic,
          confidence: Math.min(0.95, matches.length / keywords.length),
          keywords: matches
        });
      }
    });
    
    return topics;
  }
}

module.exports = {
  generateContentSuggestions,
  personalizeContentFeed,
  analyzeSentiment,
  generateAutomatedResponses,
  detectContentTopics
};