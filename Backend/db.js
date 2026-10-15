import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectToMongo = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/icodesave';
  try {
    await mongoose.connect(uri);
    console.log(`Connected to MongoDB successfully! Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    // Don't crash immediately in dev, log warning
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

export default connectToMongo;
