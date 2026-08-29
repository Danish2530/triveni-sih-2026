import mongoose from "mongoose";

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI;

  if (!primaryUri) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  try {
    console.log("🔄 Connecting to MongoDB...");

    await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 10000
    });

    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw error;
  }
};

export default connectDB;
