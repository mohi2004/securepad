function str2ab(str) {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

function ab2str(buf) {
  const decoder = new TextDecoder();
  return decoder.decode(buf);
}

function ab2base64(buf) {
  const binary = String.fromCharCode(...new Uint8Array(buf));
  return btoa(binary);
}

function base642ab(base64) {
  const binary = atob(base64);
  const buf = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) buf[i] = binary.charCodeAt(i);
  return buf;
}

async function getKey(passphrase) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("securepad-salt"),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encrypt(text, passphrase) {
  const key = await getKey(passphrase);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    str2ab(text)
  );
  return ab2base64(iv) + ":" + ab2base64(cipher);
}

export async function decrypt(data, passphrase) {
  const [ivB64, cipherB64] = data.split(":");
  if (!ivB64 || !cipherB64) throw new Error("Invalid encrypted data");
  const key = await getKey(passphrase);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base642ab(ivB64) },
    key,
    base642ab(cipherB64)
  );
  return ab2str(decrypted);
}
