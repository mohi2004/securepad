import React, { useState } from "react";

export default function LandingPage({ onLoad }) {
  const [code, setCode] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (code.trim()) {
      onLoad(code.trim());
    }
  }

  return (
    <div className="landing-page">
      <h1>Welcome to CodedPad Clone</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter your code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="submit">Load / Create Pad</button>
      </form>
    </div>
  );
}
