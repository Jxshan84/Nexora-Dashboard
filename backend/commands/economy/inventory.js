const {
  SlashCommandBuilder,
  EmbedBuilder
} = require("discord.js");

const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inventory")
    .setDescription("View your inventory"),

  async execute(interaction) {

    let user = await User.findOne({
      userId: interaction.user.id
    });

    if (!user) {
      user = await User.create({
        userId: interaction.user.id
      });
    }

    if (!user.inventory.length) {
      return interaction.reply({
        content: "🎒 Your inventory is empty.",
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`🎒 ${interaction.user.username}'s Inventory`)
      .setDescription(
        user.inventory
          .map((item, i) => `**${i + 1}.** ${item}`)
          .join("\n")
      )
      .setFooter({
        text: `Total Items: ${user.inventory.length}`
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed]
    });

  }
};