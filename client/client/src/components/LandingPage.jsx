import React, { useState } from "react";
import { loadPad } from "../utils/api.js";

export default function LandingPage({ onLoad }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLoad() {
    setLoading(true);
    setError("");
    try {
      const pad = await loadPad(code.trim() || null);
      onLoad(pad.id);
    } catch (e) {
      setError("Failed to load pad. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-10 w-full max-w-md">
        {/* Logo / Title */}
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6 tracking-tight">
          Secure<span className="text-indigo-600">Pad</span>
        </h1>

        {/* Input */}
        <label htmlFor="pad-code" className="block text-gray-700 font-medium mb-2">
          Enter a pad code or leave blank to create a new one
        </label>
        <input
          id="pad-code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. abc123"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />

        {/* Button */}
        <button
          onClick={handleLoad}
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-indigo-600 py-3 text-white font-semibold shadow-md hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          {loading ? "Loading…" : "Open Pad"}
        </button>

        {/* Error message */}
        {error && (
          <p className="mt-4 text-center text-red-600 font-medium">{error}</p>
        )}

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Your notes stay private & encrypted.
        </p>
      </div>
    </div>
  );
}
