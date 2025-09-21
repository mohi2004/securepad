import React, { useState, useEffect } from "react";
import { savePad, loadPad } from "../utils/api.js";

export default function PadEditor({ code, onBack }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPadContent() {
      setLoading(true);
      setError(null);
      try {
        const { encrypted } = await loadPad(code);
        setContent(encrypted);
      } catch (e) {
        setError("Failed to load pad. Maybe wrong code or network issue?");
      }
      setLoading(false);
    }
    loadPadContent();
  }, [code]);

  async function handleSave() {
    try {
      await savePad(code, content);
      alert("Pad saved successfully!");
    } catch (e) {
      console.error(e);
      setError("Failed to save pad.");
    }
  }

  return (
    <div>
      <button onClick={onBack}>Back</button>
      {loading ? (
        <p>Loading pad...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
          <textarea
            rows={20}
            cols={80}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <br />
          <button onClick={handleSave}>Save</button>
        </>
      )}
    </div>
  );
}
