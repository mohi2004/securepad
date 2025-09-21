import React, { useState, useEffect } from "react";
import { loadPad, savePad } from "../utils/api.js";

export default function PadEditor({ code, onBack }) {
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPad = async () => {
      try {
        const pad = await loadPad(code);
        setContent(pad.encrypted || "");
      } catch (err) {
        console.error(err);
      }
    };
    fetchPad();
  }, [code]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await savePad(code, content);
      alert("Pad saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save pad");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkbg text-white p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-secondary rounded hover:bg-gray-700 transition"
        >
          Back
        </button>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-primary rounded hover:bg-indigo-600 transition"
        >
          {saving ? "Saving..." : "Save Pad"}
        </button>
      </div>

      <textarea
        className="flex-1 w-full p-4 bg-gray-900 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing your secure pad..."
      />
    </div>
  );
}
