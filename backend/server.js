const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// Fake bot data (baad me real Discord bot se connect hoga)
let botStatus = {
  online: true,
  servers: 5,
  ping: 120
};

// Enable CORS (frontend access ke liye important)
const cors = require("cors");
app.use(cors());

// API route
app.get("/api/status", (req, res) => {
  res.json(botStatus);
});

// Home route (test ke liye)
app.get("/", (req, res) => {
  res.send("Nexora API is running 🚀");
});

// Start server
app.listen(PORT, () => {
  console.log("API running on port " + PORT);
});