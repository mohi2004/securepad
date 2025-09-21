import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./dbconnect.js";     // relative path
import Pad from "./models/pad.js";          // relative path

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: ["https://securepad-dun.vercel.app"] }));
app.use(express.json());

await dbConnect();

// GET pad
app.get("/api/pads", async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Missing pad ID." });

  try {
    let pad = await Pad.findById(id);
    if (!pad) pad = await Pad.create({ _id: id, encrypted: "" });
    res.json(pad);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST pad
app.post("/api/pads", async (req, res) => {
  const { id, encrypted } = req.body;
  if (!id || !encrypted) return res.status(400).json({ error: "Missing pad ID or content." });

  try {
    const pad = await Pad.findOneAndUpdate(
      { _id: id },
      { encrypted, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json({ success: true, pad });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE pad
app.delete("/api/pads", async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "Missing pad ID." });

  try {
    const pad = await Pad.findByIdAndDelete(id);
    if (!pad) return res.status(404).json({ error: "Pad not found." });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

