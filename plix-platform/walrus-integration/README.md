# Walrus Integration for Plix

This module provides integration with Walrus, the decentralized storage system, for the Plix social media platform.

## Overview

Walrus is a decentralized storage system that provides secure and censorship-resistant storage for user-generated content. This integration allows Plix to store user posts, images, videos, and other content in a decentralized manner.

## Features

- Store content on Walrus network
- Retrieve content from Walrus network
- Delete content from Walrus network
- Get metadata for stored content

## Installation

```bash
npm install
```

## Usage

```javascript
const WalrusIntegration = require('./src/index');

const walrus = new WalrusIntegration(config);

// Store content
const result = await walrus.storeContent('Hello Plix!', { userId: '123' });

// Retrieve content
const content = await walrus.retrieveContent(result.blobId);
```

## Testing

```bash
npm test
```

## How it works with Plix

1. When a user creates a post with media, the content is sent to the Walrus network
2. Walrus returns a blob ID that uniquely identifies the stored content
3. The blob ID is stored on the Sui blockchain as part of the post object
4. When users view the post, the frontend uses the blob ID to retrieve the content from Walrus
5. This ensures content is permanently and securely stored while keeping the blockchain lean

## Future Improvements

- Implement actual Walrus network connectivity
- Add encryption for private content
- Implement content pinning mechanisms
- Add support for streaming large files