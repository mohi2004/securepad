// utils/crypto.js

function str2ab(str) {
  return new TextEncoder().encode(str);
}

function ab2str(buf) {
  return new TextDecoder().decode(buf);
}

function uint8ToBase64(u8Arr) {
  let CHUNK_SIZE = 0x8000; // 32k
  let index = 0;
  let result = '';
  let slice;
  while (index < u8Arr.length) {
    slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, u8Arr.length));
    result += String.fromCharCode.apply(null, slice);
    index += CHUNK_SIZE;
  }
  return btoa(result);
}

function base64ToUint8(base64) {
  const raw = atob(base64);
  const rawLength = raw.length;
  const array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

export async function deriveKey(passphrase, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function encrypt(text, passphrase) {
  try {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(passphrase, salt);

    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      str2ab(text)
    );

    const encryptedBytes = new Uint8Array(encrypted);
    const combined = new Uint8Array(salt.byteLength + iv.byteLength + encryptedBytes.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.byteLength);
    combined.set(encryptedBytes, salt.byteLength + iv.byteLength);

    return uint8ToBase64(combined);
  } catch (e) {
    console.error("Encrypt error:", e);
    throw e;
  }
}

export async function decrypt(base64Data, passphrase) {
  try {
    const combined = base64ToUint8(base64Data);

    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const data = combined.slice(28);

    const key = await deriveKey(passphrase, salt);

    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      data
    );

    return ab2str(decrypted);
  } catch (e) {
    console.error("Decrypt error:", e);
    throw e;
  }
}
