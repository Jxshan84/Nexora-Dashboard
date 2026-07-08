const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Delete multiple messages.")
    .addIntegerOption(option =>
      option
        .setName("amount")
        .setDescription("Number of messages (1-100)")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {

    const amount = interaction.options.getInteger("amount");

    await interaction.channel.bulkDelete(amount, true);

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("🧹 Messages Purged")
      .setDescription(`Successfully deleted **${amount}** messages.`)
      .setFooter({
        text: `Action by ${interaction.user.tag}`
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });

  }
};