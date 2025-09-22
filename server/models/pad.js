import mongoose from "mongoose";

const PadSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  encrypted: { type: String, default: "" },
  locked: { type: Boolean, default: false },
  passwordHash: { type: String },  // 🔐 store hashed password
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Pad || mongoose.model("Pad", PadSchema);
