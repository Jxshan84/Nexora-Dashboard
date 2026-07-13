const {
  SlashCommandBuilder
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Shows bot ping"),

  async execute(interaction, client) {
    await interaction.reply({
      content: `🏓 Pong! ${client.ws.ping}ms`
    });
  }
};