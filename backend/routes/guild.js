const express = require("express");
const router = express.Router();

const GuildSettings = require("../models/GuildSettings");

module.exports = (client) => {

  router.get("/:guildId/stats", async (req, res) => {
    try {
      const guild = client.guilds.cache.get(req.params.guildId);

      if (!guild) {
        return res.status(404).json({
          success: false,
          message: "Guild not found"
        });
      }

      let settings = await GuildSettings.findOne({ guildId: guild.id });

      if (!settings) {
        settings = await GuildSettings.create({ guildId: guild.id });
      }

      res.json({
        success: true,
        guild: {
          id: guild.id,
          name: guild.name,
          icon: guild.iconURL({ dynamic: true }),
          ownerId: guild.ownerId,
          members: guild.memberCount,
          channels: guild.channels.cache.size,
          roles: guild.roles.cache.size
        },
        settings
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Internal Server Error"
      });
    }
  });

  router.get("/:guildId/channels", async (req, res) => {
    try {
      const guild = client.guilds.cache.get(req.params.guildId);

      if (!guild) {
        return res.status(404).json({
          success: false,
          message: "Guild not found"
        });
      }

      const channels = guild.channels.cache
        .filter(ch => ch.type === 0)
        .map(ch => ({
          id: ch.id,
          name: ch.name
        }));

      res.json({
        success: true,
        channels
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Failed to load channels"
      });
    }
  });

  router.get("/:guildId/roles", async (req, res) => {
    try {
      const guild = client.guilds.cache.get(req.params.guildId);

      if (!guild) {
        return res.status(404).json({
          success: false,
          message: "Guild not found"
        });
      }

      const roles = guild.roles.cache
        .filter(role => role.name !== "@everyone")
        .sort((a, b) => b.position - a.position)
        .map(role => ({
          id: role.id,
          name: role.name,
          color: role.hexColor,
          position: role.position
        }));

      res.json({
        success: true,
        roles
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Failed to load roles"
      });
    }
  });

  router.get("/:guildId", async (req, res) => {
    try {
      let settings = await GuildSettings.findOne({
        guildId: req.params.guildId
      });

      if (!settings) {
        settings = await GuildSettings.create({
          guildId: req.params.guildId
        });
      }

      res.json({
        success: true,
        settings
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Failed to load settings"
      });
    }
  });

  router.post("/:guildId", async (req, res) => {
    try {
      const body = {
        prefix: req.body.prefix || "/",
        welcomeChannel: req.body.welcomeChannel || null,
        leaveChannel: req.body.leaveChannel || null,
        modLogChannel: req.body.modLogChannel || null,
        ticketCategory: req.body.ticketCategory || null,
        autoRole: req.body.autoRole || null,
        verificationRole: req.body.verifyRole || req.body.verificationRole || null,
        antiLink: req.body.antiLink === true,
        antiBot: req.body.antiBot === true,
        automod: req.body.automod === true
      };

      const settings = await GuildSettings.findOneAndUpdate(
        { guildId: req.params.guildId },
        body,
        { new: true, upsert: true }
      );

      res.json({
        success: true,
        settings
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Failed to save settings"
      });
    }
  });

  return router;
};