import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Mock user database (in production, use a real database)
const users = [];

// JWT Secret (in production, use environment variable)
const JWT_SECRET = 'your-secret-key-here';

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Sign up route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, company, userType, password } = req.body;

    // Validate userType (allow empty for users who don't select)
    if (userType && !['service_provider', 'supplier'].includes(userType)) {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: users.length + 1,
      name,
      email,
      company,
      userType,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Generate token
    const token = generateToken(newUser.id);

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for admin credentials first
    if (email === 'admin@tatvadirect.com' && password === 'TatvaAdmin@2024') {
      const adminUser = {
        id: 999,
        name: 'Admin User',
        email: 'admin@tatvadirect.com',
        company: 'Tatva Direct',
        userType: 'admin',
        createdAt: new Date().toISOString()
      };

      const token = generateToken(adminUser.id);
      
      return res.json({
        message: 'Admin login successful',
        token,
        user: adminUser
      });
    }

    // Find regular user by email
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user.id);

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Middleware to verify JWT token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    req.userId = decoded.userId;
    next();
  });
};

// Get current user profile
router.get('/profile', authenticateToken, (req, res) => {
  const user = users.find(user => user.id === req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

export { router as authRouter, users };