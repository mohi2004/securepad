const BASE_URL = "https://securepad-production-f6d4.up.railway.app/"; // Change to your deployed backend URL when live

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
  const res = await fetch(`${BASE_URL}/api/pads?id=${id}`);
  if (!res.ok) throw new Error("Failed to fetch pad");
  const data = await res.json();
  return { id, encrypted: data.encrypted || "" };
}

/**
 * Save (create or update) a pad’s encrypted content.
 * Requires both padId and encrypted content.
 */
export async function savePad(padId, encrypted) {
  if (!padId) throw new Error("padId is required to save");

  const res = await fetch(`${BASE_URL}/api/pads?id=${padId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: padId, encrypted }), // Include id in body for backend
  });

  if (!res.ok) throw new Error("Failed to save pad");
  return res.json();
}
