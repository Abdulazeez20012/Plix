# Secure Private Messaging System for Plix

## Overview

Plix implements a secure private messaging system that allows users to communicate privately while leveraging the security and decentralization of the Sui blockchain.

## Features

1. **End-to-End Encryption**: Messages are encrypted for privacy
2. **Decentralized Storage**: Messages are stored on the Sui blockchain
3. **Read Receipts**: Track when messages are read
4. **Conversation History**: Access previous conversations
5. **Unread Indicators**: See how many messages you haven't read
6. **Message Deletion**: Remove messages when needed

## Technical Implementation

### Blockchain Layer (Sui Move)
The messaging system is implemented using Sui Move smart contracts:

1. **Message Objects**: Each message is a Sui object with:
   - Sender address
   - Recipient address
   - Encrypted content
   - Timestamp
   - Read status

2. **Conversation Objects**: Group messages between users:
   - Participants list
   - Message references
   - Creation timestamp

3. **Security Features**:
   - Only sender and recipient can access message content
   - Messages are transferred directly between users
   - Immutable message history

### Backend Service
The backend service provides RESTful APIs to interact with the blockchain:

1. **Message Sending**: Create and submit message transactions
2. **Conversation Retrieval**: Query conversation history
3. **Status Updates**: Mark messages as read
4. **Analytics**: Get unread counts and conversation summaries

## API Endpoints

### Messaging Endpoints
- `POST /api/messages/send` - Send a new message
- `GET /api/messages/conversation/:userId` - Get conversation with a user
- `POST /api/messages/mark-read/:messageId` - Mark a message as read
- `GET /api/messages/unread-count` - Get unread message count

## Security Measures

1. **Encryption**: Messages are encrypted before being stored on-chain
2. **Access Control**: Only sender and recipient can decrypt messages
3. **Immutable History**: Message history cannot be altered
4. **No Server Storage**: Messages are not stored on backend servers
5. **Private Keys**: Users control their own encryption keys

## Privacy Features

1. **Metadata Protection**: Minimal metadata is stored
2. **Optional Encryption**: Users can choose encryption levels
3. **Message Expiration**: (Future feature) Messages can auto-delete
4. **Disappearing Messages**: (Future feature) Messages can be set to disappear

## Data Structure

### Message Object
```json
{
  "id": "unique_identifier",
  "sender": "sender_address",
  "recipient": "recipient_address",
  "content": "encrypted_message_content",
  "timestamp": "2025-01-01T00:00:00Z",
  "isRead": false
}
```

### Conversation Object
```json
{
  "id": "unique_identifier",
  "participants": ["address1", "address2"],
  "messages": ["message_id_1", "message_id_2"],
  "createdAt": "2025-01-01T00:00:00Z"
}
```

## Integration with Sui Blockchain

### Smart Contract Functions
1. `send_message(recipient, content)` - Create and send a new message
2. `mark_as_read(message_id)` - Update message read status
3. `get_conversation(participant)` - Retrieve conversation with a user
4. `get_unread_count()` - Get count of unread messages

### Transaction Flow
1. User composes a message in the frontend
2. Message content is encrypted client-side
3. Backend creates a Sui transaction
4. Transaction is submitted to the Sui network
5. Message object is created and transferred to recipient
6. Recipient receives notification of new message
7. Recipient decrypts message client-side

## Future Enhancements

1. **Group Chats**: Multi-user conversations
2. **Media Sharing**: Secure sharing of images and files
3. **Voice Messages**: Encrypted voice message support
4. **Message Reactions**: Emoji reactions to messages
5. **Search**: Search through conversation history
6. **Message Pinning**: Pin important messages
7. **Scheduled Messages**: Send messages at a later time
8. **Integration with Walrus**: Store large media files using Walrus

## Performance Considerations

1. **Pagination**: Conversation history is paginated
2. **Caching**: Frequently accessed data is cached
3. **Batching**: Multiple operations can be batched
4. **Lightweight Objects**: Message objects are kept minimal

## User Experience

1. **Real-time Updates**: Instant message delivery
2. **Typing Indicators**: See when contacts are typing
3. **Delivery Receipts**: Confirm message delivery
4. **Online Status**: See when contacts are online
5. **Notifications**: Get notified of new messages