import React, { useState, useEffect } from "react";
import {
  loadPad,
  savePad,
  deletePad,
  lockPad,
  unlockPad,
} from "../utils/api.js";

export default function PadEditor({ code, onBack }) {
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [locked, setLocked] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
  const fetchPad = async () => {
    try {
      const pad = await loadPad(code);
      setLocked(pad.locked);

      if (!pad.locked) {
        setContent(pad.encrypted || "");
      } else {
        setContent(""); // clear if locked
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load pad. Maybe wrong code or network issue.");
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

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this pad?")) return;

    setDeleting(true);
    try {
      await deletePad(code);
      setContent("");
      alert("Pad deleted successfully!");
      onBack();
    } catch (err) {
      console.error(err);
      alert("Failed to delete pad: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleLock = async () => {
    const pass = prompt("Enter a password to lock this pad:");
    if (!pass) return;
    try {
      await lockPad(code, pass);
      setLocked(true);
      setContent(""); // clear local content
      alert("Pad locked!");
    } catch (err) {
      alert("Failed to lock pad: " + err.message);
    }
  };

  const handleUnlock = async () => {
    if (!password) {
      alert("Please enter a password!");
      return;
    }

    try {
      const res = await unlockPad(code, password);
      setContent(res.encrypted);
      setLocked(false);
      setPassword(""); // clear password field
      alert("Pad unlocked!");
    } catch (err) {
      alert("Wrong password!");
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

        <div className="flex gap-4">
          {!locked && (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-primary rounded hover:bg-indigo-600 transition"
              >
                {saving ? "Saving..." : "Save Pad"}
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
              >
                {deleting ? "Deleting..." : "Delete Pad"}
              </button>

              <button
                onClick={handleLock}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 transition"
              >
                Lock Pad
              </button>
            </>
          )}

          {locked && (
            <button
              onClick={handleUnlock}
              className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-700 transition"
            >
              Unlock Pad
            </button>
          )}
        </div>
      </div>

      {locked ? (
        <div className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password to unlock..."
            className="p-3 bg-gray-900 rounded border border-gray-700"
          />
        </div>
      ) : (
        <textarea
          className="flex-1 w-full p-4 bg-gray-900 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing your secure pad..."
        />
      )}
    </div>
  );
}
