import dbConnect from "../../lib/dbConnect.js";
import Pad from "../../models/Pad.js";

export default async function handler(req, res) {
  try {
    await dbConnect();

    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Missing pad ID" });

    if (req.method === "POST") {
      const { encrypted } = req.body;
      if (!encrypted) return res.status(400).json({ error: "Missing encrypted content." });

      const pad = await Pad.findOneAndUpdate(
        { _id: id },
        { encrypted, updatedAt: new Date() },
        { upsert: true, new: true }
      );

      return res.status(200).json({ success: true, encrypted: pad.encrypted });
    }

    if (req.method === "GET") {
      const pad = await Pad.findOne({ _id: id }).lean();
      if (!pad) return res.status(404).json({ error: "Pad not found." });

      return res.status(200).json({ encrypted: pad.encrypted || "" });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });

  } catch (err) {
    console.error("❌ API Error:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      details: err.message || "Unknown error"
    });
  }
}
