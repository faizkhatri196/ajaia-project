import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    try {
      console.log('[Database] Connecting to MongoDB Atlas...');
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[Database] Connected to MongoDB Atlas: ${conn.connection.host}`);
      return;
    } catch (atlasError) {
      console.warn(`[Database Warning] Unable to connect to MongoDB Atlas (${atlasError.message}). Falling back to MongoMemoryServer...`);
    }
  }

  try {
    console.log('[Database] Launching MongoMemoryServer fallback...');
    mongoMemoryServer = await MongoMemoryServer.create();
    const mongoUri = mongoMemoryServer.getUri();
    const conn = await mongoose.connect(mongoUri);
    console.log(`[Database] Connected to MongoMemoryServer: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
  } catch (error) {
    console.error(`[Database Disconnect Error] ${error.message}`);
  }
};
