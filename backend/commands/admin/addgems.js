const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addgems")
    .setDescription("Add Premium Gems to a user"),

  async execute(interaction) {
    await interaction.reply({
      content: "💎 Add Gems command coming soon.",
      ephemeral: true
    });
  }
};