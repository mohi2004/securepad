import React, { useEffect, useState } from "react";
import { loadPad, savePad } from "../utils/api.js"; // path from components to utils/api.js

export default function PadEditor({ code, onBack }) {
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPad = async () => {
      try {
        const pad = await loadPad(code);
        setContent(pad.encrypted || "");
      } catch (err) {
        alert("Failed to load pad content.");
        console.error(err);
      }
    };
    fetchPad();
  }, [code]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await savePad(code, content);
      alert("Pad saved!");
    } catch (err) {
      alert("Failed to save pad.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <button onClick={onBack}>Back</button>
      <h2>Pad: {code}</h2>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={15}
        cols={60}
      />
      <button onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
