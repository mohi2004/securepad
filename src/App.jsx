import React, { useState } from "react";
import LandingPage from "./components/Landingpage.jsx";
import PadEditor from "./components/PadEditor.jsx";

export default function App() {
  const [code, setCode] = useState(null);

  return (
    <div>
      {code ? (
        <PadEditor code={code} onBack={() => setCode(null)} />
      ) : (
        <LandingPage onLoad={setCode} />
      )}
    </div>
  );
}
