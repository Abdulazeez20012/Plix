# Testing Guide for Plix Platform Services

This guide provides instructions for testing all services with real credentials and verifying fallback mechanisms.

## Prerequisites

Before testing, ensure you have:
1. All API keys obtained and configured in environment files
2. Backend server running
3. Node.js and npm installed
4. All dependencies installed

## Testing Backend Services

### 1. Entertainment API Testing

Navigate to the backend directory:
```bash
cd plix-platform/backend
```

Run the entertainment service test:
```bash
node src/test-entertainment.js
```

Expected output with valid credentials:
- Real TMDB movie/TV data
- Real Spotify music data
- No fallback to mock data

Expected output with invalid credentials:
- Fallback to mock data
- Error messages in console

### 2. AI Service Testing

Run the AI service test:
```bash
node src/services/ai/test-ai.js
```

Expected output with valid credentials:
- Real AI-generated content suggestions
- Real sentiment analysis results
- Real topic detection

Expected output with invalid credentials:
- Fallback to mock data
- Error messages in console

### 3. Security Service Testing

Run the security service test:
```bash
node src/services/test-security.js
```

Expected output:
- Working encryption/decryption
- Proper hash generation
- Valid token creation and validation
- Input sanitization working

### 4. Messaging Service Testing

Run the messaging service test:
```bash
node src/services/test-messaging.js
```

Expected output with valid credentials:
- Blockchain transaction simulation
- Message storage and retrieval

Expected output with invalid credentials:
- Fallback to local storage
- Error messages in console

## Testing Walrus Integration

Navigate to the Walrus integration directory:
```bash
cd plix-platform/walrus-integration
```

Run the Walrus integration test:
```bash
node examples/test.js
```

Expected output with valid endpoints:
- HTTP requests to real endpoints
- Real storage/retrieval operations

Expected output with invalid endpoints:
- Fallback to mock data
- Error messages in console

## Testing Fallback Mechanisms

### 1. Invalid API Keys Test

To test fallback mechanisms:
1. Temporarily modify your .env files to use invalid API keys
2. Run the tests again
3. Observe fallback to mock data
4. Check console for error messages

### 2. Network Issues Test

To simulate network issues:
1. Disconnect from the internet
2. Run the tests
3. Observe fallback to mock data
4. Check console for network error messages

### 3. Service Downtime Test

To simulate service downtime:
1. Use invalid endpoints in configuration
2. Run the tests
3. Observe fallback to mock data
4. Check console for connection error messages

## Expected Test Results

### With Valid Credentials:
- All services should return real data
- No fallback to mock data
- Minimal console errors
- Proper data structures returned

### With Invalid Credentials:
- Services should gracefully fallback to mock data
- Clear error messages in console
- Same data structures as real data
- No application crashes

## Troubleshooting Common Issues

### 1. API Key Errors (401/403)
- Verify API key format and validity
- Check API key permissions
- Ensure API key is activated

### 2. Network Errors
- Check internet connection
- Verify API endpoints are accessible
- Check firewall/proxy settings

### 3. Rate Limiting (429)
- Implement delays between requests
- Check service rate limits
- Consider caching strategies

### 4. Data Format Issues
- Verify API response parsing
- Check for API version changes
- Review service documentation

## Performance Testing

### Response Time Monitoring
- Track API response times
- Identify slow services
- Optimize accordingly

### Memory Usage
- Monitor memory consumption
- Check for memory leaks
- Optimize data handling

## Security Testing

### Credential Security
- Verify credentials are not exposed
- Check environment variable usage
- Ensure no hardcoded credentials

### Data Encryption
- Verify encryption/decryption works
- Check key management
- Test data integrity

## Integration Testing

### Cross-Service Dependencies
- Test services that depend on others
- Verify data flow between services
- Check error handling across services

### End-to-End Testing
- Test complete user workflows
- Verify data consistency
- Check error recovery

## Logging and Monitoring

### Test Logs
- Review test output logs
- Identify recurring errors
- Monitor performance metrics

### Debug Mode
- Enable debug logging if available
- Get detailed error information
- Track execution flow

## Documentation Updates

After testing, update documentation with:
- Any changes in API behavior
- New error scenarios
- Updated testing procedures
- Performance benchmarks

## Next Steps

After successful testing:
1. Document any issues found
2. Optimize performance if needed
3. Prepare for production deployment
4. Set up monitoring and alerting