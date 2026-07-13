const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder
} = require("discord.js");

const GuildSettings = require("../../models/GuildSettings");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setupmute")
    .setDescription("Set the mute role")
    .addRoleOption(option =>
      option
        .setName("role")
        .setDescription("Mute role")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
    ),

  async execute(interaction) {

    await interaction.deferReply();

    const role =
      interaction.options.getRole(
        "role"
      );

    let settings =
      await GuildSettings.findOne({
        guildId: interaction.guild.id
      });

    if (!settings) {
      settings =
        await GuildSettings.create({
          guildId: interaction.guild.id
        });
    }

    settings.muteRoleId =
      role.id;

    await settings.save();

    const embed =
      new EmbedBuilder()
        .setColor("Blue")
        .setTitle(
          "🔇 Mute Role Configured"
        )
        .addFields(
          {
            name: "Role",
            value: `<@&${role.id}>`,
            inline: true
          },
          {
            name: "Moderator",
            value:
              interaction.user.tag,
            inline: true
          }
        )
        .setTimestamp();

    await interaction.editReply({
      embeds: [embed]
    });

  }
};