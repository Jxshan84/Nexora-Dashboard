const {
  SlashCommandBuilder,
  EmbedBuilder
} = require("discord.js");

const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addgems")
    .setDescription("Add Premium Gems to a user")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("User")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName("amount")
        .setDescription("Amount of Premium Gems")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("reason")
        .setDescription("Reason")
        .setRequired(false)
    ),

  async execute(interaction) {

    const manager = await User.findOne({
      userId: interaction.user.id
    });

    if (
      interaction.user.id !== process.env.OWNER_ID &&
      (!manager || !manager.isCurrencyManager)
    ) {
      return interaction.reply({
        content: "❌ You don't have permission to use this command.",
        ephemeral: true
      });
    }

    const target = interaction.options.getUser("user");
    const amount = interaction.options.getInteger("amount");
    const reason =
      interaction.options.getString("reason") || "No reason provided";

    if (amount <= 0) {
      return interaction.reply({
        content: "❌ Amount must be greater than 0.",
        ephemeral: true
      });
    }

    let user = await User.findOne({
      userId: target.id
    });

    if (!user) {
      user = await User.create({
        userId: target.id
      });
    }

    user.premiumGems += amount;

    await user.save();

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("💎 Premium Gems Added")
      .addFields(
        {
          name: "User",
          value: `${target}`,
          inline: true
        },
        {
          name: "Amount",
          value: `+${amount} 💎`,
          inline: true
        },
        {
          name: "Balance",
          value: `${user.premiumGems} 💎`,
          inline: true
        },
        {
          name: "Reason",
          value: reason
        }
      )
      .setFooter({
        text: `Added by ${interaction.user.tag}`
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed]
    });

  }
};