import React, { useState } from "react";

export default function LandingPage({ onLoad }) {
  const [code, setCode] = useState("");

  const handleLoad = () => {
    if (!code) return alert("Enter pad code or leave blank for new pad");
    onLoad(code);
  };

  return (
    <div>
      <h1>SecurePad</h1>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter pad code"
      />
      <button onClick={handleLoad}>Load Pad</button>
    </div>
  );
}
