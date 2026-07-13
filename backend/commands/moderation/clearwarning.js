const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} = require("discord.js");

const Warn = require("../../models/Warn");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clearwarnings")
    .setDescription("Clear all warnings of a member")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("User")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.ModerateMembers
    ),

  async execute(interaction) {

    await interaction.deferReply();

    const target =
      interaction.options.getUser("user");

    const result =
      await Warn.deleteMany({
        guildId: interaction.guild.id,
        userId: target.id
      });

    if (result.deletedCount === 0) {
      return interaction.editReply({
        content:
          "❌ This user has no warnings."
      });
    }

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("🗑️ Warnings Cleared")
      .addFields(
        {
          name: "User",
          value: target.tag,
          inline: true
        },
        {
          name: "Moderator",
          value: interaction.user.tag,
          inline: true
        },
        {
          name: "Warnings Removed",
          value: `${result.deletedCount}`,
          inline: true
        }
      )
      .setTimestamp();

    await interaction.editReply({
      embeds: [embed]
    });

  }
};