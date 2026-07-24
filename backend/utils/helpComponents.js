const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

function createMenu() {
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("help_menu")
      .setPlaceholder("📂 Select a Category")
      .addOptions(
        {
          label: "Home",
          value: "home",
          emoji: "🏠",
          description: "Main Help Page",
        },
        {
          label: "Moderation",
          value: "moderation",
          emoji: "🛡️",
          description: "Moderation Commands",
        },
        {
          label: "Economy",
          value: "economy",
          emoji: "💰",
          description: "Economy Commands",
        },
        {
          label: "Music",
          value: "music",
          emoji: "🎵",
          description: "Music Commands",
        },
        {
          label: "Recording",
          value: "recording",
          emoji: "🎙️",
          description: "Recording Commands",
        },
        {
          label: "Configuration",
          value: "configuration",
          emoji: "⚙️",
          description: "Server Settings",
        },
        {
          label: "Management",
          value: "management",
          emoji: "👑",
          description: "Owner Commands",
        }
      )
  );
}

function createButtons() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel("Dashboard")
      .setEmoji("🌐")
      .setStyle(ButtonStyle.Link)
      .setURL("https://nexora-dashboard-one.vercel.app"),

    new ButtonBuilder()
      .setLabel("Support")
      .setEmoji("💬")
      .setStyle(ButtonStyle.Link)
      .setURL("https://discord.gg/DMnyEPmV5m"),

    new ButtonBuilder()
      .setCustomId("refresh_help")
      .setLabel("Refresh")
      .setEmoji("🔄")
      .setStyle(ButtonStyle.Secondary)
  );
}

module.exports = {
  createMenu,
  createButtons,
};