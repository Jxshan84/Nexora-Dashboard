const mongoose = require("mongoose");

const guildSettingsSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true
  },

  prefixes: {
    type: [String],
    default: ["/"]
  },

  defaultPrefix: {
    type: String,
    default: "/"
  },

  isPremium: {
    type: Boolean,
    default: false
  },

  modLogChannel: {
    type: String,
    default: null
  },

  welcomeChannel: {
    type: String,
    default: null
  },

  leaveChannel: {
    type: String,
    default: null
  },

  autoRole: {
    type: String,
    default: null
  },

  verificationRole: {
    type: String,
    default: null
  },

  ticketCategory: {
    type: String,
    default: null
  },

  antiLink: {
    type: Boolean,
    default: false
  },

  antiBot: {
    type: Boolean,
    default: false
  },

  automod: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
});

module.exports =
  mongoose.models.GuildSettings ||
  mongoose.model("GuildSettings", guildSettingsSchema);