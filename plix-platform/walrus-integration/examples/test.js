const WalrusIntegration = require('../src/index');

async function testWalrusIntegration() {
  console.log('Testing Walrus Integration for Plix Platform');
  
  // Initialize Walrus integration
  const walrus = new WalrusIntegration({
    // Configuration would go here in a real implementation
  });
  
  try {
    // Test storing content
    console.log('\n1. Storing content...');
    const content = 'Hello, this is a test post content for Plix!';
    const metadata = {
      userId: 'user_123',
      contentType: 'text/plain',
      tags: ['test', 'plix', 'social']
    };
    
    const storeResult = await walrus.storeContent(content, metadata);
    console.log('Store result:', storeResult);
    
    // Test retrieving content
    console.log('\n2. Retrieving content...');
    const retrievedContent = await walrus.retrieveContent(storeResult.blobId);
    console.log('Retrieved content:', retrievedContent.toString());
    
    // Test getting metadata
    console.log('\n3. Getting metadata...');
    const meta = await walrus.getContentMetadata(storeResult.blobId);
    console.log('Metadata:', meta);
    
    // Test deleting content
    console.log('\n4. Deleting content...');
    const deleted = await walrus.deleteContent(storeResult.blobId);
    console.log('Delete result:', deleted);
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testWalrusIntegration();