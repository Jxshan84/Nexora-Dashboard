const express = require("express");
const router = express.Router();

module.exports = (client) => {
  router.get("/stats", async (req, res) => {
    res.json({
      success: true,
      bot: {
        name: client.user ? client.user.username : "Starting...",
        tag: client.user ? client.user.tag : "Starting...",
        id: client.user ? client.user.id : null,
        ping: client.ws.ping,
        uptime: process.uptime(),
        servers: client.guilds.cache.size,
        users: client.guilds.cache.reduce(
          (total, guild) => total + (guild.memberCount || 0),
          0
        ),
        commands: client.commands ? client.commands.size : 0
      }
    });
  });

  return router;
};