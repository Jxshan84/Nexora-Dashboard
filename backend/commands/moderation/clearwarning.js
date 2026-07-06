const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} = require("discord.js");

const Warn = require("../../models/Warn");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clearwarnings")
    .setDescription("Clear warnings of a member")
    .addUserOption(option =>
      option.setName("user").setDescription("User").setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName("number")
        .setDescription("Warning number to remove. Leave empty to clear all.")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getUser("user");
    const number = interaction.options.getInteger("number");

    const warns = await Warn.find({
      guildId: interaction.guild.id,
      userId: target.id
    }).sort({ createdAt: 1 });

    if (!warns.length) {
      return interaction.reply({
        content: "✅ This user has no warnings.",
        ephemeral: true
      });
    }

    if (number) {
      if (number < 1 || number > warns.length) {
        return interaction.reply({
          content: `❌ Invalid warning number. This user has ${warns.length} warning(s).`,
          ephemeral: true
        });
      }

      await Warn.deleteOne({ _id: warns[number - 1]._id });

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setTitle("✅ Warning Removed")
            .setDescription(`Removed warning **#${number}** from ${target}.`)
            .setTimestamp()
        ]
      });
    }

    await Warn.deleteMany({
      guildId: interaction.guild.id,
      userId: target.id
    });

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setTitle("✅ Warnings Cleared")
          .setDescription(`Cleared **${warns.length}** warning(s) from ${target}.`)
          .setTimestamp()
      ]
    });
  }
};