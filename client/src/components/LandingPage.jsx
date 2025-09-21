import React, { useState } from "react";
import { loadPad } from "../utils/api.js";

export default function LandingPage({ onLoad }) {
  const [padId, setPadId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLoad = async () => {
    setError("");
    setLoading(true);
    try {
      const pad = await loadPad(padId.trim() || null);
      onLoad(pad.id);
    } catch (err) {
      setError("Could not load pad. Please check the code or try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="w-full max-w-md rounded-2xl bg-white/90 p-8 shadow-xl backdrop-blur">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-6">
          SecurePad
        </h1>

        <p className="text-center text-gray-600 mb-6">
          Enter a pad code to open an existing pad<br />
          or leave blank to create a brand-new one.
        </p>

        <input
          type="text"
          value={padId}
          onChange={(e) => setPadId(e.target.value)}
          placeholder="Pad code (optional)"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-lg 
                     focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:outline-none"
        />

        {error && (
          <p className="mt-3 text-center text-sm text-red-600">{error}</p>
        )}

        <button
          onClick={handleLoad}
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-3 text-lg font-semibold
                     text-white transition-colors duration-200 hover:bg-indigo-700
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Opening…" : "Open Pad"}
        </button>

        <footer className="mt-6 text-center text-xs text-gray-500">
          Your notes stay encrypted and private.
        </footer>
      </div>
    </div>
  );
}
