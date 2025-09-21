import React, { useState } from "react";
import { loadPad } from "../utils/api.js"; // path from components to utils/api.js

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
    <div>
      <h1>SecurePad</h1>
      <input
        type="text"
        value={padId}
        onChange={(e) => setPadId(e.target.value)}
        placeholder="Enter pad code (or leave blank for new pad)"
      />
      <button onClick={handleLoad} disabled={loading}>
        {loading ? "Loading..." : "Open Pad"}
      </button>
    </div>
  );
}
