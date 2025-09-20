import mongoose from "mongoose";

const PadSchema = new mongoose.Schema({
  _id: { type: String },               // Pad code as _id
  encrypted: { type: String, default: "" },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Pad || mongoose.model("Pad", PadSchema);
