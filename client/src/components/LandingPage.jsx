import React, { useState } from "react";
import { loadPad } from "../utils/api.js";

export default function LandingPage({ onLoad }) {
  const [padId, setPadId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoad = async () => {
    setLoading(true);
    try {
      const pad = await loadPad(padId.trim() || null);
      onLoad(pad.id);
    } catch (err) {
      alert("Failed to load pad. Maybe wrong code or network issue?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkbg flex flex-col justify-center items-center px-4">
      <h1 className="text-5xl text-white font-bold mb-8 tracking-wide">SecurePad</h1>

      <input
        type="text"
        value={padId}
        onChange={(e) => setPadId(e.target.value)}
        placeholder="Enter pad code (or leave blank for new pad)"
        className="w-full max-w-md p-3 mb-6 rounded-lg border border-gray-600 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <div className="flex gap-4">
        <button
          onClick={handleLoad}
          disabled={loading}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-indigo-600 transition"
        >
          {loading ? "Loading..." : "Open Pad"}
        </button>

        <button
          onClick={() => setPadId("")}
          className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-gray-700 transition"
        >
          Delete Pad
        </button>
      </div>
    </div>
  );
}
