const {
  SlashCommandBuilder,
  EmbedBuilder
} = require("discord.js");

const User = require("../../models/User");

const DAILY_COINS = 500;
const COOLDOWN = 24 * 60 * 60 * 1000;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Claim your daily reward"),

  async execute(interaction) {

    let user = await User.findOne({
      userId: interaction.user.id
    });

    if (!user) {
      user = await User.create({
        userId: interaction.user.id
      });
    }

    if (!user.lastDaily) {
      user.lastDaily = 0;
    }

    const now = Date.now();

    if (now - user.lastDaily < COOLDOWN) {

      const remaining = COOLDOWN - (now - user.lastDaily);

      const hours = Math.floor(remaining / 3600000);
      const minutes = Math.floor((remaining % 3600000) / 60000);

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setTitle("⏳ Daily Already Claimed")
            .setDescription(
              `Come back in **${hours}h ${minutes}m**`
            )
        ],
        ephemeral: true
      });

    }

    user.coins += DAILY_COINS;
    user.lastDaily = now;

    await user.save();

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("🎁 Daily Reward")
      .setDescription(
        `You received **${DAILY_COINS} Coins**!\n\n💰 Wallet: **${user.coins} Coins**`
      )
      .setFooter({
        text: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL()
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed]
    });

  }
};