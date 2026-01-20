import express from 'express';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Mock profile database (in production, use a real database)
const profiles = [];

// Get user profile
router.get('/', authenticateToken, (req, res) => {
  try {
    const profile = profiles.find(p => p.userId === req.userId);
    
    if (!profile) {
      // Return empty profile structure based on user type
      const user = getUserById(req.userId);
      const emptyProfile = createEmptyProfile(user.userType, req.userId);
      return res.json({ profile: emptyProfile });
    }

    res.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user profile
router.put('/', authenticateToken, (req, res) => {
  try {
    const profileData = req.body;
    const existingProfileIndex = profiles.findIndex(p => p.userId === req.userId);

    const updatedProfile = {
      ...profileData,
      userId: req.userId,
      updatedAt: new Date().toISOString()
    };

    if (existingProfileIndex >= 0) {
      profiles[existingProfileIndex] = updatedProfile;
    } else {
      updatedProfile.createdAt = new Date().toISOString();
      profiles.push(updatedProfile);
    }

    res.json({ 
      message: 'Profile updated successfully',
      profile: updatedProfile 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Helper function to get user by ID (you'll need to import this from auth.js)
function getUserById(userId) {
  // This should be imported from auth.js or shared
  // For now, returning a mock user
  return { id: userId, userType: 'service_provider' };
}

// Helper function to create empty profile structure
function createEmptyProfile(userType, userId) {
  const baseProfile = {
    userId,
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    createdAt: new Date().toISOString()
  };

  if (userType === 'service_provider') {
    return {
      ...baseProfile,
      gstin: '',
      projects: []
    };
  } else {
    return {
      ...baseProfile,
      mainGstin: '',
      branches: []
    };
  }
}

export { router as profileRouter };