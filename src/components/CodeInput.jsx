import React from "react";

export default function CodeInput({ code, setCode }) {
  return (
    <input
      type="password"
      placeholder="Enter code"
      value={code}
      onChange={(e) => setCode(e.target.value)}
      className="code-input"
    />
  );
}
