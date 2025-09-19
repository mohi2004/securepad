import mongoose from "mongoose";
import { Schema, model, models } from "mongoose";

// Connect to MongoDB once per cold start
let conn = null;
async function connect() {
  if (!conn) {
    if (!process.env.MONGO_URI) {
      throw new Error("Missing MONGO_URI in environment variables");
    }
    conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  return conn;
}

// Define Pad schema
const Pad = models.Pad || model(
  "Pad",
  new Schema({
    _id: String,
    encrypted: String,
    updatedAt: { type: Date, default: Date.now },
  })
);

export default async function handler(req, res) {
  try {
    await connect();
    const { id } = req.query;

    if (!id) return res.status(400).json({ error: "Missing pad ID" });

    if (req.method === "POST") {
      const { encrypted } = req.body;
      if (!encrypted)
        return res.status(400).json({ error: "Missing encrypted content" });

      const pad = await Pad.findByIdAndUpdate(
        id,
        { encrypted, updatedAt: new Date() },
        { upsert: true, new: true }
      );
      return res.json({ success: true, pad });
    }

    if (req.method === "GET") {
      const pad = await Pad.findById(id);
      if (!pad) return res.status(404).json({ error: "Pad not found" });
      return res.json(pad);
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("API handler error:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
}
