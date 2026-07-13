const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} = require("discord.js");

const Warn = require("../../models/Warn");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a member")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("User to warn")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("reason")
        .setDescription("Reason")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.ModerateMembers
    ),

  async execute(interaction) {

    await interaction.deferReply();

    const target =
      interaction.options.getUser(
        "user"
      );

    const reason =
      interaction.options.getString(
        "reason"
      ) || "No reason provided";

    const member =
      await interaction.guild.members
        .fetch(target.id)
        .catch(() => null);

    if (!member) {
      return interaction.editReply({
        content:
          "❌ User not found."
      });
    }

    await Warn.create({
      guildId: interaction.guild.id,
      userId: target.id,
      moderatorId: interaction.user.id,
      reason
    });

    const totalWarns =
      await Warn.countDocuments({
        guildId: interaction.guild.id,
        userId: target.id
      });

    const embed =
      new EmbedBuilder()
        .setColor("Yellow")
        .setTitle(
          "⚠️ Member Warned"
        )
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
            name: "Total Warnings",
            value: String(totalWarns),
            inline: true
          },
          {
            name: "Reason",
            value: reason
          }
        )
        .setTimestamp();

    await interaction.editReply({
      embeds: [embed]
    });

  }
};