const express = require("express");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = "pads.json";

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Load pads from local file
function loadPads() {
  if (fs.existsSync(DATA_FILE)) {
    return JSON.parse(fs.readFileSync(DATA_FILE));
  }
  return {};
} 

// Save pads to local file
function savePads(pads) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(pads, null, 2));
}

// Save encrypted content
app.post("/api/pad/:id", (req, res) => {
  const id = req.params.id;
  const { encrypted } = req.body;

  if (!encrypted) {
    return res.status(400).json({ error: "Missing encrypted content." });
  }

  const pads = loadPads();
  pads[id] = {
    encrypted,
    updatedAt: new Date().toISOString(),
  };
  savePads(pads);

  res.json({ success: true });
});

// Load encrypted content
app.get("/api/pad/:id", (req, res) => {
  const id = req.params.id;
  const pads = loadPads();

  if (!pads[id]) {
    return res.status(404).json({ error: "Pad not found." });
  }

  res.json(pads[id]);
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
