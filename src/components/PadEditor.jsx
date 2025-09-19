import React, { useState, useEffect } from "react";
import { encrypt, decrypt } from "../utils/crypto";
import { savePad, loadPad } from "../utils/api";
 // <-- import API calls

export default function PadEditor({ code, onBack }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPadContent() {
      setLoading(true);
      setError(null);
      try {
        const encryptedData = await loadPad(code); // load from backend
        if (encryptedData) {
          const decrypted = await decrypt(encryptedData, code);
          setContent(decrypted);
        } else {
          setContent(""); // New pad
        }
      } catch (e) {
        setError("Failed to load or decrypt. Maybe wrong code?");
        setContent("");
      }
      setLoading(false);
    }
    loadPadContent();
  }, [code]);


  async function handleSave() {
  try {
    const encrypted = await encrypt(content, code);
    await savePad(code, encrypted);
    setError(null); // clear any previous error
    alert("Pad saved successfully!");
  } catch (e) {
    console.error("Manual save error:", e);
    setError("Failed to encrypt/save content.");
  }
}

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
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={20}
          cols={80}
          placeholder="Start typing your encrypted pad..."
        />
        <br />
        <button onClick={handleSave}>Save</button> {/* Save button */}
      </>
    )}
  </div>
);


  // Auto-save encrypted content every 2 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const encrypted = await encrypt(content, code);
        await savePad(code, encrypted); // save to backend
      } catch (e) {
        setError("Failed to encrypt/save content.");
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
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={20}
          cols={80}
          placeholder="Start typing your encrypted pad..."
        />
      )}
    </div>
  );
}
