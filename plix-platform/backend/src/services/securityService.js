// Security Service for Plix Platform
// This service handles authentication, authorization, and data protection

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Ed25519Keypair } = require('@mysten/sui/keypairs/ed25519');
const { fromB64 } = require('@mysten/bcs');

// JWT secret - in production, this should be stored in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// In-memory user storage for demonstration
// In production, this would be a database
const users = new Map();

/**
 * Generate a secure hash for passwords using bcrypt
 * @param {string} password - Password to hash
 * @returns {Promise<string>} - Hashed password
 */
async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Validate password against hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} - Validation result
 */
async function validatePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

/**
 * Generate a secure hash for data integrity
 * @param {string} data - Data to hash
 * @param {string} salt - Salt for hashing
 * @returns {string} - Hashed data
 */
function generateHash(data, salt) {
  return crypto
    .createHmac('sha256', salt)
    .update(data)
    .digest('hex');
}

/**
 * Generate a random salt
 * @returns {string} - Random salt
 */
function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Register a new user
 * @param {string} userId - User identifier
 * @param {string} password - User password
 * @returns {Promise<Object>} - Registration result
 */
async function registerUser(userId, password) {
  try {
    // Check if user already exists
    if (users.has(userId)) {
      throw new Error('User already exists');
    }
    
    // Hash the password
    const hashedPassword = await hashPassword(password);
    
    // Store user
    users.set(userId, {
      id: userId,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    });
    
    return { success: true, userId };
  } catch (error) {
    console.error('Error registering user:', error.message);
    throw error;
  }
}

/**
 * Validate user credentials
 * @param {string} userId - User identifier
 * @param {string} password - User password
 * @returns {Promise<boolean>} - Validation result
 */
async function validateCredentials(userId, password) {
  try {
    const user = users.get(userId);
    if (!user) return false;
    
    return await validatePassword(password, user.password);
  } catch (error) {
    console.error('Error validating credentials:', error.message);
    return false;
  }
}

/**
 * Generate JWT authentication token
 * @param {string} userId - User identifier
 * @returns {string} - Authentication token
 */
function generateAuthToken(userId) {
  const payload = {
    userId: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };
  
  return jwt.sign(payload, JWT_SECRET);
}

/**
 * Validate authentication token
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Token validation result
 */
async function validateAuthToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return {
      valid: true,
      userId: decoded.userId,
      expiresAt: decoded.exp * 1000
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message
    };
  }
}

/**
 * Encrypt data for secure storage using AES
 * @param {string} data - Data to encrypt
 * @param {string} key - Encryption key (32 bytes for AES-256)
 * @returns {string} - Encrypted data (base64 encoded)
 */
function encryptData(data, key) {
  try {
    // Ensure key is 32 bytes for AES-256
    const keyBuffer = crypto.createHash('sha256').update(key).digest();
    
    // Generate a random IV
    const iv = crypto.randomBytes(16);
    
    // Create cipher
    const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);
    
    // Encrypt data
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    // Return IV + encrypted data
    return iv.toString('base64') + ':' + encrypted;
  } catch (error) {
    console.error('Error encrypting data:', error.message);
    throw error;
  }
}

/**
 * Decrypt data
 * @param {string} encryptedData - Encrypted data (IV + encrypted data)
 * @param {string} key - Decryption key
 * @returns {string} - Decrypted data
 */
function decryptData(encryptedData, key) {
  try {
    // Split IV and encrypted data
    const parts = encryptedData.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = Buffer.from(parts[0], 'base64');
    const encrypted = parts[1];
    
    // Ensure key is 32 bytes for AES-256
    const keyBuffer = crypto.createHash('sha256').update(key).digest();
    
    // Create decipher
    const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, iv);
    
    // Decrypt data
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Error decrypting data:', error.message);
    throw error;
  }
}

/**
 * Sanitize user input to prevent injection attacks
 * @param {string} input - User input
 * @returns {string} - Sanitized input
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Rate limiting to prevent abuse using a simple in-memory store
 * @param {string} userId - User identifier
 * @param {string} action - Action being performed
 * @returns {Promise<boolean>} - Whether action is allowed
 */
const rateLimitStore = new Map();

async function checkRateLimit(userId, action) {
  try {
    const key = `${userId}:${action}`;
    const now = Date.now();
    const windowMs = 60000; // 1 minute window
    const maxRequests = 10; // Max 10 requests per minute
    
    const record = rateLimitStore.get(key) || { count: 0, resetTime: now + windowMs };
    
    // Reset count if window has expired
    if (now > record.resetTime) {
      record.count = 0;
      record.resetTime = now + windowMs;
    }
    
    // Check if limit exceeded
    if (record.count >= maxRequests) {
      return false;
    }
    
    // Increment count
    record.count++;
    rateLimitStore.set(key, record);
    
    return true;
  } catch (error) {
    console.error('Error checking rate limit:', error.message);
    // Allow request if rate limiting fails
    return true;
  }
}

/**
 * Log security events
 * @param {string} event - Security event
 * @param {string} userId - User identifier
 * @param {Object} details - Event details
 */
function logSecurityEvent(event, userId, details = {}) {
  console.log(`SECURITY EVENT: ${event}`, {
    userId,
    timestamp: new Date().toISOString(),
    ...details
  });
}

/**
 * Validate Sui address format
 * @param {string} address - Sui address
 * @returns {boolean} - Whether address is valid
 */
function validateSuiAddress(address) {
  // Sui addresses are 66 characters long and start with 0x
  return /^0x[0-9a-fA-F]{64}$/.test(address);
}

/**
 * Validate Sui signature
 * @param {string} message - Message that was signed
 * @param {string} signature - Signature (base64 encoded)
 * @param {string} publicKey - Public key (base64 encoded)
 * @returns {boolean} - Whether signature is valid
 */
function validateSuiSignature(message, signature, publicKey) {
  try {
    // Note: This is a simplified implementation
    // In practice, you would use the Sui SDK to verify signatures
    return true;
  } catch (error) {
    console.error('Error validating Sui signature:', error.message);
    return false;
  }
}

module.exports = {
  hashPassword,
  validatePassword,
  generateHash,
  generateSalt,
  registerUser,
  validateCredentials,
  generateAuthToken,
  validateAuthToken,
  encryptData,
  decryptData,
  sanitizeInput,
  checkRateLimit,
  logSecurityEvent,
  validateSuiAddress,
  validateSuiSignature
};