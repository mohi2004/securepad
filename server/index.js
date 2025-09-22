import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./dbconnect.js";     // relative path
import Pad from "./models/pad.js";          // relative path
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "https://securepad-dun.vercel.app", // production
      "http://localhost:5173",            // local dev
    ],
  })
);
app.use(express.json());

await dbConnect();

// GET pad
// GET pad
// GET pad
app.get("/api/pads", async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Missing pad ID." });

  try {
    let pad = await Pad.findById(id);
    if (!pad) {
      pad = await Pad.create({ _id: id, encrypted: "" });
    }

    if (pad.locked) {
      // ✅ Return locked flag, but no content
      return res.json({ _id: pad._id, locked: true });
    }

    // ✅ When unlocked, return full pad
    res.json({
      _id: pad._id,
      locked: false,
      encrypted: pad.encrypted,
      updatedAt: pad.updatedAt,
    });
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




// 🔒 Lock a pad (set password)
app.post("/api/pads/lock", async (req, res) => {
  const { id, password } = req.body;
  if (!id || !password) {
    return res.status(400).json({ error: "Pad ID and password required." });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const pad = await Pad.findOneAndUpdate(
      { _id: id },
      { locked: true, passwordHash: hash },
      { new: true, upsert: false }
    );

    if (!pad) return res.status(404).json({ error: "Pad not found." });

    res.json({ success: true, locked: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔓 Unlock a pad (check password)
app.post("/api/pads/unlock", async (req, res) => {
  const { id, password } = req.body;
  if (!id || !password) {
    return res.status(400).json({ error: "Pad ID and password required." });
  }

  try {
    const pad = await Pad.findById(id);
    if (!pad) return res.status(404).json({ error: "Pad not found." });

    const match = await bcrypt.compare(password, pad.passwordHash || "");
    if (!match) return res.status(403).json({ error: "Invalid password." });

    res.json({ success: true, locked: false, encrypted: pad.encrypted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

