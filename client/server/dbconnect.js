import mongoose from "mongoose";

let isConnected = false;

export default async function dbConnect() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("✅ Connected to MongoDB!");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}
