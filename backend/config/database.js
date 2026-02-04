import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // Remove deprecated options
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
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