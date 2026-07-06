const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("removegems")
    .setDescription("Remove Premium Gems from a user"),

  async execute(interaction) {
    await interaction.reply({
      content: "💎 Remove Gems command coming soon.",
      ephemeral: true
    });
  }
};