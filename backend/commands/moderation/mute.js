const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mute a member")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("User to mute")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName("minutes")
        .setDescription("Mute duration in minutes")
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
      interaction.options.getUser("user");

    const minutes =
      interaction.options.getInteger(
        "minutes"
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
        content: "❌ User not found."
      });
    }

    if (!member.moderatable) {
      return interaction.editReply({
        content:
          "❌ I cannot mute this member."
      });
    }

    await member.timeout(
      minutes * 60 * 1000,
      reason
    );

    const embed = new EmbedBuilder()
      .setColor("Yellow")
      .setTitle("🔇 Member Muted")
      .addFields(
        {
          name: "User",
          value: target.tag,
          inline: true
        },
        {
          name: "Duration",
          value: `${minutes} minute(s)`,
          inline: true
        },
        {
          name: "Moderator",
          value: interaction.user.tag,
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