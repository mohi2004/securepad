// Load pad content
export async function loadPad(padId) {
  try {
    const res = await fetch(`/api/pads?id=${padId}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to fetch pad");
    }
    const data = await res.json();
    return data.encrypted || "";
  } catch (e) {
    console.error("Load API error:", e);
    throw e;
  }
}

// Save pad content
export async function savePad(padId, encrypted) {
  try {
    const res = await fetch(`/api/pads?id=${padId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ encrypted }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to save pad");
    }

    const data = await res.json();
    return data; // { success: true, encrypted: ... }
  } catch (e) {
    console.error("Save API error:", e);
    throw e;
  }
}
