const {
  generateHash,
  generateSalt,
  validateCredentials,
  generateAuthToken,
  validateAuthToken,
  encryptData,
  decryptData,
  sanitizeInput,
  checkRateLimit,
  validateSuiAddress
} = require('./securityService');

async function testSecurityService() {
  console.log('Testing Security Service');
  
  try {
    console.log('\n1. Testing hash generation...');
    const salt = generateSalt();
    console.log('Generated salt:', salt);
    
    const hash = generateHash('testpassword', salt);
    console.log('Generated hash:', hash);
    
    console.log('\n2. Testing credential validation...');
    const isValid = await validateCredentials('user1', 'testpassword');
    console.log('Credential validation result:', isValid);
    
    console.log('\n3. Testing auth token generation...');
    const token = generateAuthToken('user1');
    console.log('Generated token:', token);
    
    console.log('\n4. Testing auth token validation...');
    const tokenValidation = await validateAuthToken(token);
    console.log('Token validation result:', tokenValidation);
    
    console.log('\n5. Testing data encryption/decryption...');
    const key = 'testkey';
    const originalData = 'This is secret data';
    const encrypted = encryptData(originalData, key);
    console.log('Encrypted data:', encrypted);
    
    const decrypted = decryptData(encrypted, key);
    console.log('Decrypted data:', decrypted);
    console.log('Data integrity:', originalData === decrypted);
    
    console.log('\n6. Testing input sanitization...');
    const maliciousInput = '<script>alert("XSS")</script>';
    const sanitized = sanitizeInput(maliciousInput);
    console.log('Original input:', maliciousInput);
    console.log('Sanitized input:', sanitized);
    
    console.log('\n7. Testing rate limiting...');
    const isAllowed = await checkRateLimit('user1', 'post');
    console.log('Rate limit check result:', isAllowed);
    
    console.log('\n8. Testing Sui address validation...');
    const validAddress = '0x1234567890123456789012345678901234567890123456789012345678901234';
    const invalidAddress = '0x123';
    
    console.log('Valid address check:', validateSuiAddress(validAddress));
    console.log('Invalid address check:', validateSuiAddress(invalidAddress));
    
    console.log('\nAll security tests completed successfully!');
  } catch (error) {
    console.error('Security test failed:', error);
  }
}

testSecurityService();