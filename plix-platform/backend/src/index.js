const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Plix Backend API' });
});

// Entertainment API routes
app.use('/api/entertainment', require('./routes/entertainment'));

// Messaging routes
app.use('/api/messages', require('./routes/messaging'));

// Start server
app.listen(PORT, () => {
  console.log(`Plix backend server running on port ${PORT}`);
});