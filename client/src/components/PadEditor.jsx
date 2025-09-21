import React, { useState, useEffect } from "react";
import { savePad, loadPad } from "../utils/api.js";

export default function PadEditor({ code, onBack }) {
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPad = async () => {
      try {
        const pad = await loadPad(code);
        setContent(pad.encrypted);
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
    } catch (err) {
      alert("Failed to save pad.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
        >
          Back
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing..."
        className="flex-1 w-full p-4 rounded-xl border border-gray-300 resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 text-gray-800 bg-white/80 backdrop-blur-md"
      />
    </div>
  );
}
