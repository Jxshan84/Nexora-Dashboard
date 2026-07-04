const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

let botStatus = {
  online: true,
  servers: 5,
  ping: 120
};

app.get("/", (req, res) => {
  res.send("API Running");
});

app.get("/api/status", (req, res) => {
  res.json(botStatus);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
{
  "name": "nexora-backend",
  "version": "1.0.0",
  "description": "Backend API for Nexora Dashboard",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.21.2"
  }
}