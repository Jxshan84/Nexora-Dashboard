const express = require("express");
const router = express.Router();

const GuildSettings = require("../models/GuildSettings");

module.exports = () => {

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
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  });

  router.post("/:guildId", async (req, res) => {
    try {
      const data = req.body;

      const settings = await GuildSettings.findOneAndUpdate(
        { guildId: req.params.guildId },
        {
          prefix: data.prefix,
          modLogChannel: data.modLogChannel,
          welcomeChannel: data.welcomeChannel,
          leaveChannel: data.leaveChannel,
          autoRole: data.autoRole,
          gemsLogChannel: data.gemsLogChannel,
          ticketCategory: data.ticketCategory,
          automod: data.automod,
          antiLink: data.antiLink,
          isPremium: data.isPremium
        },
        { new: true, upsert: true }
      );

      res.json({
        success: true,
        settings
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Save failed"
      });
    }
  });

  return router;
};