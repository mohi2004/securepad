import React, { useState, useEffect } from "react";
import { encrypt, decrypt } from "../utils/crypto";
import { savePad, loadPad } from "../utils/api";

export default function PadEditor({ code, onBack }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load pad on mount or code change
  useEffect(() => {
    async function loadPadContent() {
      setLoading(true);
      setError(null);
      try {
        const encryptedData = await loadPad(code);
        if (encryptedData) {
          try {
            const decrypted = await decrypt(encryptedData, code);
            setContent(decrypted);
          } catch {
            setContent("");
            setError("Failed to decrypt. Pad may be corrupted or code is wrong.");
          }
        } else {
          setContent(""); // New pad
        }
      } catch (e) {
        setError("Failed to load pad. Maybe wrong code or network issue?");
        setContent("");
      }
      setLoading(false);
    }
    loadPadContent();
  }, [code]);

  // Manual save
  async function handleSave() {
    try {
      const encrypted = await encrypt(content, code);
      await savePad(code, encrypted);
      setError(null);
      alert("Pad saved successfully!");
    } catch (e) {
      console.error("Manual save error:", e);
      setError("Failed to encrypt/save content.");
    }
  }

  // Auto-save every 2 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!content) return;
      try {
        const encrypted = await encrypt(content, code);
        await savePad(code, encrypted);
      } catch (e) {
        console.error("Auto-save error:", e);
        setError("Failed to auto-save content.");
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [content, code]);

  return (
    <div className="pad-editor">
      <button onClick={onBack}>Back</button>
      {loading ? (
        <p>Loading pad...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
          <textarea
            id="pad-content"
            name="pad-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            cols={80}
            placeholder="Start typing your encrypted pad..."
          />
          <br />
          <button onClick={handleSave}>Save</button>
        </>
      )}
    </div>
  );
}
