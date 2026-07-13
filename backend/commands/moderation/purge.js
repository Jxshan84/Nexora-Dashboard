const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Delete multiple messages")
    .addIntegerOption(option =>
      option
        .setName("amount")
        .setDescription(
          "Number of messages to delete (1-100)"
        )
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.ManageMessages
    ),

  async execute(interaction) {

    await interaction.deferReply({
      ephemeral: true
    });

    const amount =
      interaction.options.getInteger(
        "amount"
      );

    try {

      await interaction.channel.bulkDelete(
        amount,
        true
      );

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("🧹 Messages Deleted")
        .setDescription(
          `Successfully deleted **${amount}** messages.`
        )
        .addFields(
          {
            name: "Moderator",
            value: interaction.user.tag,
            inline: true
          }
        )
        .setTimestamp();

      await interaction.editReply({
        embeds: [embed]
      });

    } catch (error) {

      await interaction.editReply({
        content:
          "❌ Failed to delete messages."
      });

    }
  }
};