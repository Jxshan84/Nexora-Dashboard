const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("untimeout")
    .setDescription("Remove timeout from a member")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("User to remove timeout from")
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
        content: "❌ I cannot remove this timeout.",
        ephemeral: true
      });
    }

    await member.timeout(null, reason);

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("✅ Timeout Removed")
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