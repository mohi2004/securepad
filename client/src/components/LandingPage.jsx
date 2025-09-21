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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500">
      <div className="bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-4xl font-extrabold mb-6 text-gray-800 tracking-tight">
          Secure<span className="text-indigo-600">Pad</span>
        </h1>

        <input
          type="text"
          value={padId}
          onChange={(e) => setPadId(e.target.value)}
          placeholder="Enter pad code or leave blank"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 mb-6 text-gray-800"
        />

        <button
          onClick={handleLoad}
          disabled={loading}
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          {loading ? "Loading..." : "Open Pad"}
        </button>

        <p className="mt-6 text-sm text-gray-600">
          Your notes are private & encrypted
        </p>
      </div>
    </div>
  );
}
