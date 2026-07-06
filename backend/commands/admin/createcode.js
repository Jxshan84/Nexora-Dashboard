const {
  SlashCommandBuilder,
  EmbedBuilder
} = require("discord.js");

const RedeemCode = require("../../models/RedeemCode");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("createcode")
    .setDescription("Create a Premium Gems redeem code")

    .addStringOption(option =>
      option
        .setName("code")
        .setDescription("Redeem Code")
        .setRequired(true)
    )

    .addIntegerOption(option =>
      option
        .setName("reward")
        .setDescription("Premium Gems Reward")
        .setRequired(true)
    )

    .addIntegerOption(option =>
      option
        .setName("uses")
        .setDescription("Maximum Uses")
        .setRequired(true)
    )

    .addIntegerOption(option =>
      option
        .setName("days")
        .setDescription("Expiry in Days")
        .setRequired(true)
    ),

  async execute(interaction) {

    if (interaction.user.id !== process.env.OWNER_ID) {
      return interaction.reply({
        content: "❌ Only Bot Owner can create redeem codes.",
        ephemeral: true
      });
    }

    const code = interaction.options.getString("code").toUpperCase();
    const reward = interaction.options.getInteger("reward");
    const uses = interaction.options.getInteger("uses");
    const days = interaction.options.getInteger("days");

    const exists = await RedeemCode.findOne({ code });

    if (exists) {
      return interaction.reply({
        content: "❌ This redeem code already exists.",
        ephemeral: true
      });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    await RedeemCode.create({
      code,
      reward,
      uses,
      expiresAt,
      createdBy: interaction.user.id
    });

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("🎁 Redeem Code Created")
      .addFields(
        {
          name: "Code",
          value: code,
          inline: true
        },
        {
          name: "Reward",
          value: `${reward} 💎`,
          inline: true
        },
        {
          name: "Uses",
          value: `${uses}`,
          inline: true
        },
        {
          name: "Expires",
          value: `${days} Day(s)`
        }
      )
      .setTimestamp();

    await interaction.reply({
      embeds: [embed]
    });

  }
};