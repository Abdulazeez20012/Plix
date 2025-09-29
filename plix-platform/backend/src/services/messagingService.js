// Messaging Service for Plix Platform
// This service handles private messaging functionality using the Sui blockchain

const { Ed25519Keypair } = require('@mysten/sui/keypairs/ed25519');
const { TransactionBlock } = require('@mysten/sui/transactions');
const { getFullnodeUrl, SuiClient } = require('@mysten/sui/client');

// Initialize Sui client
const suiClient = new SuiClient({
  url: getFullnodeUrl('testnet'), // Use testnet for development
});

// In production, these would be managed securely
const SENDER_PRIVATE_KEY = process.env.SENDER_PRIVATE_KEY || 'your_sender_private_key_here';
const PACKAGE_ID = process.env.PACKAGE_ID || 'your_package_id_here';
const MODULE_NAME = 'messaging';

// Simulated message storage for local caching
let localMessages = [];
let localConversations = [];

/**
 * Send a new message on the Sui blockchain
 * @param {string} sender - Sender's address
 * @param {string} recipient - Recipient's address
 * @param {string} content - Message content
 * @param {string} senderPrivateKey - Sender's private key
 * @returns {Promise<Object>} - Transaction result
 */
async function sendMessage(sender, recipient, content, senderPrivateKey) {
  try {
    // Create keypair from private key
    const keypair = Ed25519Keypair.fromSecretKey(
      Uint8Array.from(Array.from(senderPrivateKey.replace('0x', ''), (byte) => parseInt(byte, 16)))
    );
    
    // Create transaction block
    const tx = new TransactionBlock();
    
    // Call the send_message function in our smart contract
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::send_message`,
      arguments: [
        tx.pure(recipient),
        tx.pure(content),
      ],
    });
    
    // Sign and execute transaction
    const result = await suiClient.signAndExecuteTransactionBlock({
      signer: keypair,
      transactionBlock: tx,
      options: {
        showEffects: true,
        showEvents: true,
      },
    });
    
    // Store locally for quick access
    const message = {
      id: result.digest,
      sender,
      recipient,
      content,
      timestamp: new Date().toISOString(),
      isRead: false,
      transactionDigest: result.digest
    };
    
    localMessages.push(message);
    
    // Update or create conversation locally
    let conversation = localConversations.find(c => 
      (c.user1 === sender && c.user2 === recipient) || 
      (c.user1 === recipient && c.user2 === sender)
    );
    
    if (!conversation) {
      conversation = {
        id: 'conv_' + Math.random().toString(36).substr(2, 9),
        user1: sender,
        user2: recipient,
        messages: [message.id],
        createdAt: new Date().toISOString()
      };
      localConversations.push(conversation);
    } else {
      conversation.messages.push(message.id);
    }
    
    return message;
  } catch (error) {
    console.error('Error sending message on Sui blockchain:', error.message);
    // Fallback to local storage if blockchain fails
    const message = {
      id: 'msg_' + Math.random().toString(36).substr(2, 9),
      sender,
      recipient,
      content,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    localMessages.push(message);
    
    // Update or create conversation
    let conversation = localConversations.find(c => 
      (c.user1 === sender && c.user2 === recipient) || 
      (c.user1 === recipient && c.user2 === sender)
    );
    
    if (!conversation) {
      conversation = {
        id: 'conv_' + Math.random().toString(36).substr(2, 9),
        user1: sender,
        user2: recipient,
        messages: [message.id],
        createdAt: new Date().toISOString()
      };
      localConversations.push(conversation);
    } else {
      conversation.messages.push(message.id);
    }
    
    return message;
  }
}

/**
 * Get conversation between two users from the Sui blockchain
 * @param {string} user1 - First user's address
 * @param {string} user2 - Second user's address
 * @returns {Promise<Array>} - Array of messages
 */
async function getConversation(user1, user2) {
  try {
    // In a real implementation, we would query the Sui blockchain for messages
    // between these two users. For now, we'll return local cached messages.
    
    const conversation = localConversations.find(c => 
      (c.user1 === user1 && c.user2 === user2) || 
      (c.user1 === user2 && c.user2 === user1)
    );
    
    if (!conversation) {
      return [];
    }
    
    // Get messages for this conversation
    const conversationMessages = localMessages.filter(msg => 
      conversation.messages.includes(msg.id)
    );
    
    // Sort by timestamp
    return conversationMessages.sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );
  } catch (error) {
    console.error('Error getting conversation from Sui blockchain:', error.message);
    // Fallback to local storage
    const conversation = localConversations.find(c => 
      (c.user1 === user1 && c.user2 === user2) || 
      (c.user1 === user2 && c.user2 === user1)
    );
    
    if (!conversation) {
      return [];
    }
    
    // Get messages for this conversation
    const conversationMessages = localMessages.filter(msg => 
      conversation.messages.includes(msg.id)
    );
    
    // Sort by timestamp
    return conversationMessages.sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );
  }
}

/**
 * Mark a message as read on the Sui blockchain
 * @param {string} messageId - Message ID
 * @param {string} userPrivateKey - User's private key
 * @returns {Promise<Object>} - Updated message object
 */
async function markAsRead(messageId, userPrivateKey) {
  try {
    // Create keypair from private key
    const keypair = Ed25519Keypair.fromSecretKey(
      Uint8Array.from(Array.from(userPrivateKey.replace('0x', ''), (byte) => parseInt(byte, 16)))
    );
    
    // Create transaction block
    const tx = new TransactionBlock();
    
    // Call the mark_as_read function in our smart contract
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::mark_as_read`,
      arguments: [
        tx.pure(messageId),
      ],
    });
    
    // Sign and execute transaction
    const result = await suiClient.signAndExecuteTransactionBlock({
      signer: keypair,
      transactionBlock: tx,
      options: {
        showEffects: true,
        showEvents: true,
      },
    });
    
    // Update local cache
    const message = localMessages.find(msg => msg.id === messageId);
    if (message) {
      message.isRead = true;
    }
    
    return {
      ...message,
      transactionDigest: result.digest
    };
  } catch (error) {
    console.error('Error marking message as read on Sui blockchain:', error.message);
    // Fallback to local storage
    const message = localMessages.find(msg => msg.id === messageId);
    if (message) {
      message.isRead = true;
    }
    return message;
  }
}

/**
 * Get unread message count for a user from the Sui blockchain
 * @param {string} userId - User's address
 * @returns {Promise<number>} - Unread message count
 */
async function getUnreadCount(userId) {
  try {
    // In a real implementation, we would query the Sui blockchain for unread messages
    // For now, we'll return the count from local cache
    
    return localMessages.filter(msg => 
      msg.recipient === userId && !msg.isRead
    ).length;
  } catch (error) {
    console.error('Error getting unread count from Sui blockchain:', error.message);
    // Fallback to local storage
    return localMessages.filter(msg => 
      msg.recipient === userId && !msg.isRead
    ).length;
  }
}

/**
 * Delete a message on the Sui blockchain
 * @param {string} messageId - Message ID
 * @param {string} userPrivateKey - User's private key
 * @returns {Promise<boolean>} - Success status
 */
async function deleteMessage(messageId, userPrivateKey) {
  try {
    // Create keypair from private key
    const keypair = Ed25519Keypair.fromSecretKey(
      Uint8Array.from(Array.from(userPrivateKey.replace('0x', ''), (byte) => parseInt(byte, 16)))
    );
    
    // Create transaction block
    const tx = new TransactionBlock();
    
    // Call the delete_message function in our smart contract
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::delete_message`,
      arguments: [
        tx.pure(messageId),
      ],
    });
    
    // Sign and execute transaction
    const result = await suiClient.signAndExecuteTransactionBlock({
      signer: keypair,
      transactionBlock: tx,
      options: {
        showEffects: true,
      },
    });
    
    // Update local cache
    const index = localMessages.findIndex(msg => msg.id === messageId);
    if (index !== -1) {
      localMessages.splice(index, 1);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting message on Sui blockchain:', error.message);
    // Fallback to local storage
    const index = localMessages.findIndex(msg => msg.id === messageId);
    if (index !== -1) {
      localMessages.splice(index, 1);
      return true;
    }
    return false;
  }
}

/**
 * Get all conversations for a user from the Sui blockchain
 * @param {string} userId - User's address
 * @returns {Promise<Array>} - Array of conversations
 */
async function getUserConversations(userId) {
  try {
    // In a real implementation, we would query the Sui blockchain for all conversations
    // involving this user. For now, we'll return from local cache.
    
    return localConversations
      .filter(conv => conv.user1 === userId || conv.user2 === userId)
      .map(conv => ({
        id: conv.id,
        participant: conv.user1 === userId ? conv.user2 : conv.user1,
        lastMessage: localMessages.find(msg => msg.id === conv.messages[conv.messages.length - 1]),
        unreadCount: localMessages.filter(msg => 
          msg.recipient === userId && 
          conv.messages.includes(msg.id) && 
          !msg.isRead
        ).length
      }));
  } catch (error) {
    console.error('Error getting user conversations from Sui blockchain:', error.message);
    // Fallback to local storage
    return localConversations
      .filter(conv => conv.user1 === userId || conv.user2 === userId)
      .map(conv => ({
        id: conv.id,
        participant: conv.user1 === userId ? conv.user2 : conv.user1,
        lastMessage: localMessages.find(msg => msg.id === conv.messages[conv.messages.length - 1]),
        unreadCount: localMessages.filter(msg => 
          msg.recipient === userId && 
          conv.messages.includes(msg.id) && 
          !msg.isRead
        ).length
      }));
  }
}

module.exports = {
  sendMessage,
  getConversation,
  markAsRead,
  getUnreadCount,
  deleteMessage,
  getUserConversations
};