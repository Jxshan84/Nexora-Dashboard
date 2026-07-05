require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { Client, GatewayIntentBits } = require("discord.js");

const commandHandler = require("./handlers/commandHandler");

const app = express();

app.use(cors());
app.use(express.json());

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// Home Route
app.get("/", (req, res) => {
  res.send("👑 Rudra Backend Running");
});

// Health API
app.get("/health", (req, res) => {
  res.json({
    status: client.isReady() ? "Online" : "Offline",
    bot: client.user?.tag || "Starting...",
    ping: client.ws.ping,
    servers: client.guilds.cache.size,
    users: client.guilds.cache.reduce(
      (total, guild) => total + (guild.memberCount || 0),
      0
    )
  });
});

// Discord Ready
client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  commandHandler(client);

  console.log("✅ Command Handler Loaded");
});

// Login
client.login(process.env.TOKEN);

// Server Start
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});