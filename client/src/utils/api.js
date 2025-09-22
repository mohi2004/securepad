// src/api/pads.js

const BASE_URL = "https://securepad-production-f6d4.up.railway.app"; // Railway backend https://securepad-production-f6d4.up.railway.app  http://localhost:5000

// Generate a random 6-character pad ID
function generatePadId() {
  return Math.random().toString(36).slice(2, 8);
}

/**
 * Load a pad by ID. If ID is missing, generate one and let backend auto-create it.
 * Returns { id, encrypted }.
 */
export async function loadPad(padId) {
  const id = padId || generatePadId();
  try {
    const res = await fetch(`${BASE_URL}/api/pads?id=${id}`);
    if (!res.ok) throw new Error("Failed to fetch pad");

    const data = await res.json();

    return {
      id,
      locked: data.locked || false,   // explicitly include locked state
      encrypted: data.locked ? "" : (data.encrypted || ""), // only return content if unlocked
    };
  } catch (err) {
    console.error("Error loading pad:", err);
    throw err;
  }
}


/**
 * Save (create or update) a pad’s encrypted content.
 * Requires both padId and encrypted content.
 */
export async function savePad(padId, encrypted) {
  if (!padId) throw new Error("padId is required to save");

  try {
    const res = await fetch(`${BASE_URL}/api/pads`, {  // POST to /api/pads
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: padId, encrypted }), // Send id and encrypted in body
    });

    if (!res.ok) throw new Error("Failed to save pad");
    return res.json();
  } catch (err) {
    console.error("Error saving pad:", err);
    throw err;
  }
}


export async function deletePad(padId) {
  if (!padId) throw new Error("padId is required to delete");

  const res = await fetch(`${BASE_URL}/api/pads`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: padId }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to delete pad: ${text}`);
  }

  return res.json();
}


export async function lockPad(padId, password) {
  if (!padId || !password) throw new Error("Pad ID and password required");

  const res = await fetch(`${BASE_URL}/api/pads/lock`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: padId, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to lock pad: ${text}`);
  }

  return res.json();
}

export async function unlockPad(padId, password) {
  if (!padId || !password) throw new Error("Pad ID and password required");

  const res = await fetch(`${BASE_URL}/api/pads/unlock`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: padId, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to unlock pad: ${text}`);
  }

  return res.json(); // returns { success, locked: false, encrypted }
}