import React, { useState } from "react";
import LandingPage from "./components/LandingPage.jsx";
import PadEditor from "./components/PadEditor.jsx";

export default function App() {
  const [code, setCode] = useState(null);

  return code ? (
    <PadEditor code={code} onBack={() => setCode(null)} />
  ) : (
    <LandingPage onLoad={setCode} />
  );
}
