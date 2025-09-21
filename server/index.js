import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./dbConnect.js";
import Pad from "./models/Pad.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

await dbConnect(); // ensure connection is established before handling requests
console.log("✅ Connected to MongoDB!");

// GET pad by ID (auto-create if not exists)
app.get("/api/pads", async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Missing pad ID." });

  try {
    let pad = await Pad.findById(id);
    if (!pad) {
      pad = await Pad.create({ _id: id, encrypted: "" });
      console.log(`🔒 Pad created: ${id}`);
    }
    res.status(200).json(pad);
  } catch (err) {
    console.error("GET /api/pads error:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST pad (create or update)
app.post("/api/pads", async (req, res) => {
  const { id, encrypted } = req.body;
  if (!id) return res.status(400).json({ error: "Missing pad ID." });
  if (typeof encrypted !== "string") return res.status(400).json({ error: "Missing or invalid encrypted content." });

  try {
    const pad = await Pad.findOneAndUpdate(
      { _id: id },
      { encrypted, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    console.log(`💾 Pad saved: ${id}`);
    res.status(200).json({ success: true, pad });
  } catch (err) {
    console.error("POST /api/pads error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
