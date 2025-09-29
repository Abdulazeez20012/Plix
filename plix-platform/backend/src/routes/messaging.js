const express = require('express');
const router = express.Router();
const { 
  sendMessage,
  getConversation,
  markAsRead,
  getUnreadCount
} = require('../services/messagingService');

// Send a new message
router.post('/send', async (req, res) => {
  try {
    const { recipient, content, senderPrivateKey } = req.body;
    const sender = req.user?.address || 'anonymous'; // In a real app, this would come from authentication
    
    // Validate required fields
    if (!recipient || !content || !senderPrivateKey) {
      return res.status(400).json({ error: 'Recipient, content, and senderPrivateKey are required' });
    }
    
    const result = await sendMessage(sender, recipient, content, senderPrivateKey);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get conversation between two users
router.get('/conversation/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user?.address || 'anonymous'; // In a real app, this would come from authentication
    
    const conversation = await getConversation(currentUserId, userId);
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark message as read
router.post('/mark-read/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userPrivateKey } = req.body;
    
    if (!userPrivateKey) {
      return res.status(400).json({ error: 'userPrivateKey is required' });
    }
    
    const result = await markAsRead(messageId, userPrivateKey);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get unread message count
router.get('/unread-count', async (req, res) => {
  try {
    const userId = req.user?.address || 'anonymous'; // In a real app, this would come from authentication
    
    const count = await getUnreadCount(userId);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;