const { SlashCommandBuilder } = require("discord.js");

const { homeEmbed } = require("../../utils/helpEmbeds");
const {
  createMenu,
  createButtons,
} = require("../../utils/helpComponents");

const {
  startHelpCollector,
} = require("../../utils/helpCollector");

module.exports = {
  category: "utility",

  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Open the RUDRA Premium Help Center"),

  async execute(interaction) {
    try {
      const message = await interaction.reply({
        embeds: [
          homeEmbed(
            interaction.client,
            interaction.user
          ),
        ],
        components: [
          createMenu(),
          createButtons(),
        ],
        fetchReply: true,
      });

      await startHelpCollector(
        message,
        interaction
      );
    } catch (error) {
      console.error(
        "Help command error:",
        error
      );

      const response = {
        content:
          "❌ Help Center open nahi ho saka.",
        ephemeral: true,
      };

      if (
        interaction.replied ||
        interaction.deferred
      ) {
        await interaction.followUp(response);
      } else {
        await interaction.reply(response);
      }
    }
  },
};