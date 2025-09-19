const API_BASE = "http://localhost:3000/api"; // Your backend URL

export async function savePad(id, encrypted) {
  try {
    const res = await fetch(`${API_BASE}/pad/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ encrypted }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API error: ${res.status} ${text}`);
    }
    return await res.json();
  } catch (e) {
    console.error("savePad error:", e);
    throw e;
  }
}

export async function loadPad(id) {
  try {
    const res = await fetch(`${API_BASE}/pad/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API error: ${res.status} ${text}`);
    }
    const data = await res.json();
    return data.encrypted;
  } catch (e) {
    console.error("loadPad error:", e);
    throw e;
  }
}
