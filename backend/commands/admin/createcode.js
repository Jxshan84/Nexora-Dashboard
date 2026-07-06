const {
  SlashCommandBuilder,
  EmbedBuilder
} = require("discord.js");

const RedeemCode = require("../../models/RedeemCode");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("createcode")
    .setDescription("Create a redeem code")

    .addStringOption(option =>
      option
        .setName("code")
        .setDescription("Redeem code")
        .setRequired(true)
    )

    .addStringOption(option =>
      option
        .setName("rewardtype")
        .setDescription("Reward Type")
        .setRequired(true)
        .addChoices(
          { name: "Coins", value: "coins" },
          { name: "Gems", value: "gems" },
          { name: "Premium Gems", value: "premiumgems" },
          { name: "XP", value: "xp" },
          { name: "Item", value: "item" },
          { name: "Role", value: "role" }
        )
    )

    .addIntegerOption(option =>
      option
        .setName("amount")
        .setDescription("Reward Amount")
        .setRequired(false)
    )

    .addStringOption(option =>
      option
        .setName("item")
        .setDescription("Item Name")
        .setRequired(false)
    )

    .addRoleOption(option =>
      option
        .setName("role")
        .setDescription("Discord Role")
        .setRequired(false)
    )

    .addIntegerOption(option =>
      option
        .setName("uses")
        .setDescription("Maximum Uses")
        .setRequired(true)
    )

    .addStringOption(option =>
      option
        .setName("expiry")
        .setDescription("Example: 1h, 12h, 7d, 30d, never")
        .setRequired(true)
    )

    .addIntegerOption(option =>
      option
        .setName("maxredeemperuser")
        .setDescription("How many times one user can redeem")
        .setRequired(false)
    ),
  async execute(interaction) {

    if (interaction.user.id !== process.env.OWNER_ID) {
      return interaction.reply({
        content: "❌ Only the bot owner can create redeem codes.",
        ephemeral: true
      });
    }

    const code = interaction.options.getString("code").toUpperCase();
    const rewardType = interaction.options.getString("rewardtype");
    const amount = interaction.options.getInteger("amount") || 0;
    const itemName = interaction.options.getString("item");
    const role = interaction.options.getRole("role");
    const uses = interaction.options.getInteger("uses");
    const expiry = interaction.options.getString("expiry").toLowerCase();
    const maxRedeemPerUser =
      interaction.options.getInteger("maxredeemperuser") || 1;

    const exists = await RedeemCode.findOne({ code });

    if (exists) {
      return interaction.reply({
        content: "❌ This redeem code already exists.",
        ephemeral: true
      });
    }

    let expiresAt = null;

    if (expiry !== "never") {
      const match = expiry.match(/^(\d+)([hd])$/);

      if (!match) {
        return interaction.reply({
          content: "❌ Expiry must be like 1h, 12h, 7d or never.",
          ephemeral: true
        });
      }

      const value = Number(match[1]);
      const unit = match[2];

      expiresAt = new Date();

      if (unit === "h") {
        expiresAt.setHours(expiresAt.getHours() + value);
      } else {
        expiresAt.setDate(expiresAt.getDate() + value);
      }
    }

    await RedeemCode.create({
      code,
      rewardType,
      amount,
      itemName,
      roleId: role ? role.id : null,
      uses,
      used: 0,
      expiresAt,
      maxRedeemPerUser,
      createdBy: interaction.user.id
    });

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("🎁 Redeem Code Created")
      .addFields(
        { name: "Code", value: code, inline: true },
        { name: "Reward Type", value: rewardType, inline: true },
        { name: "Amount", value: `${amount}`, inline: true },
        { name: "Uses", value: `${uses}`, inline: true },
        { name: "Expiry", value: expiry, inline: true },
        {
          name: "Max Redeem / User",
          value: `${maxRedeemPerUser}`,
          inline: true
        }
      )
      .setTimestamp();

    await interaction.reply({
      embeds: [embed]
    });

  }

};