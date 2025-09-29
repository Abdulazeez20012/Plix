# API Keys Configuration Guide for Plix Platform

This guide provides step-by-step instructions for obtaining and configuring all required API keys for the Plix platform.

## 1. TMDB (The Movie Database) API Key

### Purpose:
Access movie and TV show data for entertainment integration in Plix.

### Steps to Obtain:
1. Visit [TMDB Website](https://www.themoviedb.org/)
2. Click "Join TMDB" or "Login" if you have an account
3. After logging in, go to Settings (click on your avatar)
4. Select "API" from the left sidebar
5. Click "Create" to generate a new API key
6. Fill in the application details:
   - Application Name: Plix
   - Application URL: Your project URL or localhost
   - Application Summary: "Decentralized social media platform with entertainment integration"
7. Accept terms and submit
8. Copy your API key (v3 auth)

### API Key Format:
A 32-character string like: `abcdefghijklmnopqrstuvwxyz123456`

### Documentation:
- [TMDB API Documentation](https://developers.themoviedb.org/3/getting-started/introduction)

## 2. Spotify Developer Credentials

### Purpose:
Access music data and integrate with Spotify for music discovery features.

### Steps to Obtain:
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account or create one
3. Click "Create an App"
4. Fill in the application details:
   - App name: Plix
   - App description: "Decentralized social media platform with music integration"
5. Select "Web API" as the API/SDK
6. Add redirect URIs (for development: http://localhost:3000/callback)
7. Accept terms and create app
8. Go to "Settings" for your app
9. Copy:
   - Client ID (32-character string)
   - Client Secret (32-character string)

### Credentials Format:
- Client ID: 32-character string
- Client Secret: 32-character string

### Documentation:
- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api)

## 3. OpenAI API Key

### Purpose:
Power AI features including content suggestions, personalization, and sentiment analysis.

### Steps to Obtain:
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Go to "API Keys" in the left sidebar
4. Click "Create new secret key"
5. Give your key a name (e.g., "Plix Platform")
6. Click "Create secret key"
7. Copy your API key (starts with "sk-")

### API Key Format:
A string starting with "sk-" followed by alphanumeric characters

### Documentation:
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)

## 4. Sui Blockchain Wallet Credentials

### Purpose:
Enable blockchain operations for messaging and user data management.

### Steps to Obtain:
1. Install Sui Wallet extension or use Sui CLI
2. Create a new wallet or import existing one
3. Get your wallet address (0x followed by 64 hex characters)
4. Export your private key (keep this secure!)
5. For development, you can use Sui CLI:
   ```bash
   sui client new-address ed25519
   sui client active-address
   sui client export-account <address> <password>
   ```

### Credentials Format:
- Wallet Address: 0x followed by 64 hex characters
- Private Key: 64 hex characters (keep this secret!)

### Documentation:
- [Sui Documentation](https://docs.sui.io/)

## 5. Environment Configuration

### Backend Environment Variables (.env file):
```env
# TMDB API Configuration
TMDB_API_KEY=your_tmdb_api_key_here

# Spotify API Configuration
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here

# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Sui Blockchain Configuration
SENDER_PRIVATE_KEY=your_sender_private_key_here
PACKAGE_ID=your_package_id_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=24h

# Walrus Network Configuration
WALRUS_STORE_ENDPOINT=your_walrus_store_endpoint_here
WALRUS_RETRIEVE_ENDPOINT=your_walrus_retrieve_endpoint_here
WALRUS_DELETE_ENDPOINT=your_walrus_delete_endpoint_here
WALRUS_METADATA_ENDPOINT=your_walrus_metadata_endpoint_here

# Server Configuration
PORT=3001
```

### Walrus Integration Environment Variables (.env file):
```env
# Walrus Network Configuration
WALRUS_STORE_ENDPOINT=your_walrus_store_endpoint_here
WALRUS_RETRIEVE_ENDPOINT=your_walrus_retrieve_endpoint_here
WALRUS_DELETE_ENDPOINT=your_walrus_delete_endpoint_here
WALRUS_METADATA_ENDPOINT=your_walrus_metadata_endpoint_here
```

## 6. Testing API Keys

### Backend Services:
1. Navigate to backend directory:
   ```bash
   cd plix-platform/backend
   ```
2. Update .env file with your real API keys
3. Run tests:
   ```bash
   node src/test-entertainment.js
   node src/services/ai/test-ai.js
   node src/services/test-security.js
   node src/services/test-messaging.js
   ```

### Walrus Integration:
1. Navigate to walrus integration directory:
   ```bash
   cd plix-platform/walrus-integration
   ```
2. Update .env file with your real endpoints
3. Run tests:
   ```bash
   node examples/test.js
   ```

## 7. Fallback Mechanisms

All services in Plix include fallback mechanisms:
- If API keys are invalid or services are unavailable, the platform falls back to mock data
- This ensures the platform remains functional during development and testing
- Error messages are logged for debugging purposes

## 8. Security Best Practices

1. Never commit API keys to version control
2. Use environment variables for all sensitive credentials
3. Rotate API keys periodically
4. Restrict API key permissions to only what's needed
5. Monitor API usage for unusual activity
6. Keep private keys secure and never expose them in client-side code

## 9. Troubleshooting

### Common Issues:
1. **401 Unauthorized**: Check API key validity
2. **403 Forbidden**: Check API key permissions
3. **429 Too Many Requests**: Implement rate limiting
4. **Network Errors**: Check internet connection and endpoints

### Debugging Steps:
1. Verify all environment variables are set correctly
2. Check API key formats match expected patterns
3. Ensure network connectivity to API endpoints
4. Review service documentation for any changes
5. Check console logs for detailed error messages

## 10. Next Steps

After obtaining all API keys:
1. Update environment files with real credentials
2. Test each service individually
3. Run integration tests
4. Verify fallback mechanisms work properly
5. Document any issues or special configurations