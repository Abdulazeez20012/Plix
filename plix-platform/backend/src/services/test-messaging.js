const {
  sendMessage,
  getConversation,
  markAsRead,
  getUnreadCount,
  deleteMessage,
  getUserConversations
} = require('./messagingService');

async function testMessagingService() {
  console.log('Testing Messaging Service');
  
  try {
    console.log('\n1. Sending messages...');
    const message1 = await sendMessage('user1', 'user2', 'Hello User 2!');
    console.log('Sent message 1:', message1);
    
    const message2 = await sendMessage('user2', 'user1', 'Hi User 1!');
    console.log('Sent message 2:', message2);
    
    const message3 = await sendMessage('user1', 'user2', 'How are you?');
    console.log('Sent message 3:', message3);
    
    console.log('\n2. Getting conversation...');
    const conversation = await getConversation('user1', 'user2');
    console.log('Conversation:', conversation);
    
    console.log('\n3. Getting unread count...');
    const unreadCount = await getUnreadCount('user2');
    console.log('Unread count for user2:', unreadCount);
    
    console.log('\n4. Marking message as read...');
    const markedRead = await markAsRead(message1.id);
    console.log('Marked as read:', markedRead);
    
    console.log('\n5. Getting updated unread count...');
    const updatedUnreadCount = await getUnreadCount('user2');
    console.log('Updated unread count for user2:', updatedUnreadCount);
    
    console.log('\n6. Getting user conversations...');
    const userConversations = await getUserConversations('user1');
    console.log('User conversations:', userConversations);
    
    console.log('\nAll messaging tests completed successfully!');
  } catch (error) {
    console.error('Messaging test failed:', error);
  }
}

testMessagingService();