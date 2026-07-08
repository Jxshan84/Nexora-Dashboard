const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mute a member using the Muted role.")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Member to mute")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("reason")
        .setDescription("Reason for mute")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {

    const user = interaction.options.getUser("user");
    const reason =
      interaction.options.getString("reason") || "No reason provided.";

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member)
      return interaction.reply({
        content: "❌ Member not found.",
        ephemeral: true
      });

    const muteRole = interaction.guild.roles.cache.find(
      r => r.name.toLowerCase() === "muted"
    );

    if (!muteRole)
      return interaction.reply({
        content: "❌ Muted role not found. Run **/setupmute** first.",
        ephemeral: true
      });

    if (member.roles.cache.has(muteRole.id))
      return interaction.reply({
        content: "❌ This member is already muted.",
        ephemeral: true
      });

    await member.roles.add(muteRole, reason);

    const embed = new EmbedBuilder()
      .setColor("Orange")
      .setTitle("🔇 Member Muted")
      .addFields(
        { name: "Member", value: `${member.user.tag}`, inline: true },
        { name: "Moderator", value: interaction.user.tag, inline: true },
        { name: "Reason", value: reason }
      )
      .setTimestamp();

    await interaction.reply({
      embeds: [embed]
    });

  }
};