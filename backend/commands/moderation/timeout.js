const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a member")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("User to timeout")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName("minutes")
        .setDescription("Timeout duration in minutes")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("reason")
        .setDescription("Reason")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {

    const target = interaction.options.getUser("user");
    const minutes = interaction.options.getInteger("minutes");
    const reason =
      interaction.options.getString("reason") || "No reason provided";

    const member = await interaction.guild.members
      .fetch(target.id)
      .catch(() => null);

    if (!member) {
      return interaction.reply({
        content: "❌ User not found.",
        ephemeral: true
      });
    }

    if (!member.moderatable) {
      return interaction.reply({
        content: "❌ I cannot timeout this member.",
        ephemeral: true
      });
    }

    if (minutes < 1 || minutes > 40320) {
      return interaction.reply({
        content: "❌ Timeout must be between 1 minute and 28 days.",
        ephemeral: true
      });
    }

    await member.timeout(minutes * 60 * 1000, reason);

    const embed = new EmbedBuilder()
      .setColor("Yellow")
      .setTitle("⏳ Member Timed Out")
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

    await interaction.reply({
      embeds: [embed]
    });

  }
};