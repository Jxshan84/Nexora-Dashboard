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

      const settings =
        await GuildSettings.findOne({
          guildId: guild.id
        });

      res.json({
        success: true,

        guild: {
          id: guild.id,
          name: guild.name,
          icon: guild.iconURL({
            dynamic: true
          }),
          ownerId: guild.ownerId,
          members: guild.memberCount,
          channels: guild.channels.cache.size,
          roles: guild.roles.cache.size
        },

        settings: settings || {}
      });

    } catch (err) {
      console.error(err);

      res.status(500).json({
        success: false,
        message: "Internal Server Error"
      });
    }

  });

  router.get("/:guildId", async (req, res) => {

    let settings =
      await GuildSettings.findOne({
        guildId: req.params.guildId
      });

    if (!settings) {
      settings =
        await GuildSettings.create({
          guildId: req.params.guildId
        });
    }

    res.json({
      success: true,
      settings
    });

  });

  router.post("/:guildId", async (req, res) => {

    const settings =
      await GuildSettings.findOneAndUpdate(

        {
          guildId: req.params.guildId
        },

        req.body,

        {
          new: true,
          upsert: true
        }

      );

    res.json({
      success: true,
      settings
    });

  });

  return router;

};