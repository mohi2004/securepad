export async function loadPad(padId) {
  const res = await fetch(`/api/pads?id=${padId}`);
  if (!res.ok) throw new Error("Failed to fetch pad");
  const data = await res.json();
  return data.encrypted || "";
}

export async function savePad(padId, encrypted) {
  const res = await fetch(`/api/pads?id=${padId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ encrypted }),
  });
  if (!res.ok) throw new Error("Failed to save pad");
  return res.json();
}
