const mongoose = require('mongoose');

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/triveni';

  try {
    console.log(`Connecting to primary MongoDB at: ${primaryUri}`);
    await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('✅ Connected successfully to primary MongoDB instance.');
  } catch (primaryErr) {
    console.warn('⚠️ Could not connect to primary MongoDB instance:', primaryErr.message);
    console.log('🔄 Attempting fallback to in-memory MongoDB for local dev/testing...');
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const fallbackUri = mongod.getUri();
      console.log(`Fallback MongoMemoryServer running at: ${fallbackUri}`);
      
      await mongoose.connect(fallbackUri);
      console.log('✅ Connected successfully to fallback in-memory MongoDB instance.');
    } catch (fallbackErr) {
      console.error('❌ Failed to connect to fallback MongoDB as well:', fallbackErr.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
