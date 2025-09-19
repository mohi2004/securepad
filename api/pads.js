import mongoose from "mongoose";
import { Schema, model, models } from "mongoose";

// 1. Connect to Mongo only once per cold start
let conn = null;
async function connect() {
  if (!conn) {
    conn = await mongoose.connect(process.env.MONGO_URI);
  }
  return conn;
}

// 2. Define schema
const Pad = models.Pad || model("Pad", new Schema({
  _id: String,
  encrypted: String,
  updatedAt: Date
}));

// 3. Request handler
export default async function handler(req, res) {
  await connect();
  const { id } = req.query;

  if (req.method === "POST") {
    const { encrypted } = req.body;
    if (!encrypted) return res.status(400).json({ error: "Missing encrypted content" });

    await Pad.findByIdAndUpdate(
      id,
      { encrypted, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    return res.json({ success: true });
  }

  if (req.method === "GET") {
    const pad = await Pad.findById(id);
    if (!pad) return res.status(404).json({ error: "Pad not found" });
    return res.json(pad);
  }

  res.status(405).end(); // Other HTTP methods not allowed
}
