const { homeEmbed } = require("./helpEmbeds");
const { createCategoryEmbed } = require("./helpCommands");

async function startHelpCollector(message, interaction) {
  const collector = message.createMessageComponentCollector({
    time: 300000,
  });

  collector.on("collect", async (i) => {
    if (i.user.id !== interaction.user.id) {
      return i.reply({
        content: "❌ This help menu isn't for you.",
        ephemeral: true,
      });
    }

    if (i.isStringSelectMenu()) {
      const value = i.values[0];

      if (value === "home") {
        return i.update({
          embeds: [homeEmbed(interaction.client, interaction.user)],
        });
      }

      return i.update({
        embeds: [
          createCategoryEmbed(
            interaction.client,
            interaction.user,
            value
          ),
        ],
      });
    }

    if (i.isButton()) {
      if (i.customId === "refresh_help") {
        return i.update({
          embeds: [
            homeEmbed(interaction.client, interaction.user),
          ],
        });
      }
    }
  });

  collector.on("end", async () => {
    try {
      await message.edit({
        components: [],
      });
    } catch {}
  });
}

module.exports = {
  startHelpCollector,
};