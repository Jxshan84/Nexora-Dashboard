const {
  SlashCommandBuilder,
  EmbedBuilder
} = require("discord.js");

const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gems")
    .setDescription("Check your Premium Gems"),

  async execute(interaction) {

    let user = await User.findOne({
      userId: interaction.user.id
    });

    if (!user) {
      user = await User.create({
        userId: interaction.user.id
      });
    }

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("💎 Premium Gems")
      .setDescription(
        `You currently have **${user.premiumGems} 💎 Premium Gems**`
      )
      .setThumbnail(interaction.user.displayAvatarURL())
      .setFooter({
        text: interaction.user.tag
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed]
    });

  }
};