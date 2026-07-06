const {
  SlashCommandBuilder,
  EmbedBuilder
} = require("discord.js");

const ShopItem = require("../../models/ShopItem");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("View the global Rudra shop"),

  async execute(interaction) {

    const items = await ShopItem.find({
      enabled: true
    }).sort({ category: 1, price: 1 });

    if (!items.length) {
      return interaction.reply({
        content: "🛒 The shop is currently empty.",
        ephemeral: true
      });
    }

    const description = items.map((item, index) => {

      const emoji =
        item.currency === "coins"
          ? "🪙"
          : item.currency === "gems"
          ? "💎"
          : "👑";

      return `**${index + 1}. ${item.name}**
📂 ${item.category}
💰 ${item.price} ${emoji}
📝 ${item.description}`;
    }).join("\n\n");

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("🛒 Rudra Global Shop")
      .setDescription(description)
      .setFooter({
        text: `Total Items: ${items.length}`
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed]
    });

  }
};