import dbConnect from "../../lib/dbConnect.js";
import Pad from "../../models/Pad.js";

export default async function handler(req, res) {
  try {
    await dbConnect();
    const { id } = req.query;

    if (req.method === "POST") {
      const { encrypted } = req.body;
      if (!encrypted) return res.status(400).json({ error: "Missing encrypted content." });

      await Pad.findOneAndUpdate(
        { _id: id },
        { encrypted, updatedAt: new Date() },
        { upsert: true, new: true }
      );

      return res.status(200).json({ success: true });
    }

    if (req.method === "GET") {
      const pad = await Pad.findById(id);
      if (!pad) return res.status(404).json({ error: "Pad not found." });
      return res.status(200).json(pad);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
