import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (retries = 5) => {
  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('📍 URI:', process.env.MONGODB_URI ? 'Configured' : 'Missing');
    
    // Connection options
    const options = {
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      bufferMaxEntries: 0,
      maxPoolSize: 10,
      minPoolSize: 5,
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🔌 MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    return conn;

  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    
    if (retries > 0) {
      console.log(`🔄 Retrying connection... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      return connectDB(retries - 1);
    }
    
    // Don't exit process in production, let server continue
    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️  Server will continue without database connection');
      return null;
    } else {
      throw error;
    }
  }
};

export default connectDB;