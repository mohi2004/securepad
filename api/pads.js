import dbConnect from "../../lib/dbConnect.js";
import Pad from "../../models/Pad.js";

export default async function handler(req, res) {
  try {
    console.log("🔎 Request:", req.method, req.query);
    await dbConnect();
    console.log("✅ DB connected");

    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Missing pad ID" });

    // POST -> Save or update pad
    if (req.method === "POST") {
      const { encrypted } = req.body;
      if (!encrypted) return res.status(400).json({ error: "Missing encrypted content." });

      const pad = await Pad.findOneAndUpdate(
        { _id: id },                     // Use _id as string
        { encrypted, updatedAt: new Date() },
        { upsert: true, new: true }
      );

      return res.status(200).json({ success: true, encrypted: pad.encrypted });
    }

    // GET -> Load pad
    if (req.method === "GET") {
      const pad = await Pad.findOne({ _id: id }).lean(); // <-- use findOne + .lean()
      if (!pad) return res.status(404).json({ error: "Pad not found." });

      return res.status(200).json({ encrypted: pad.encrypted || "" });
    }

    // Method not allowed
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);

  } catch (err) {
    console.error("❌ API Error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
