import mongoose from "mongoose";

const uri = "mongodb+srv://MONGODB_URI:mohith2004@cluster0.cmfhqer.mongodb.net/securepad?retryWrites=true&w=majority&appName=SecurePad";

async function test() {
  try {
    await mongoose.connect(uri, {});
    console.log("✅ Connected!");
    await mongoose.connection.close();
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
  }
}

test();
