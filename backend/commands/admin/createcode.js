const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits
} = require("discord.js");

const RedeemCode = require("../../models/RedeemCode");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("createcode")
    .setDescription("Create a server redeem code")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(o => o.setName("code").setDescription("Redeem code").setRequired(true))
    .addStringOption(o =>
      o.setName("rewardtype").setDescription("Reward type").setRequired(true)
        .addChoices(
          { name: "Coins", value: "coins" },
          { name: "Gems", value: "gems" },
          { name: "Premium Gems", value: "premiumgems" },
          { name: "XP", value: "xp" },
          { name: "Item", value: "item" },
          { name: "Role", value: "role" }
        )
    )
    .addIntegerOption(o => o.setName("uses").setDescription("Maximum uses").setRequired(true))
    .addStringOption(o => o.setName("expiry").setDescription("1h, 12h, 7d, 30d, never").setRequired(true))
    .addIntegerOption(o => o.setName("amount").setDescription("Reward amount").setRequired(false))
    .addStringOption(o => o.setName("item").setDescription("Item name").setRequired(false))
    .addRoleOption(o => o.setName("role").setDescription("Role reward").setRequired(false))
    .addIntegerOption(o => o.setName("maxredeemperuser").setDescription("Redeems per user").setRequired(false)),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return interaction.reply({
        content: "❌ You need Manage Server permission.",
        ephemeral: true
      });
    }

    const guildId = interaction.guild.id;
    const code = interaction.options.getString("code").toUpperCase();
    const rewardType = interaction.options.getString("rewardtype");
    const uses = interaction.options.getInteger("uses");
    const expiry = interaction.options.getString("expiry").toLowerCase();
    const amount = interaction.options.getInteger("amount") || 0;
    const itemName = interaction.options.getString("item");
    const role = interaction.options.getRole("role");
    const maxRedeemPerUser = interaction.options.getInteger("maxredeemperuser") || 1;

    if (uses <= 0) return interaction.reply({ content: "❌ Uses must be greater than 0.", ephemeral: true });

    if (["coins", "gems", "premiumgems", "xp"].includes(rewardType) && amount <= 0) {
      return interaction.reply({ content: "❌ Amount required for this reward type.", ephemeral: true });
    }

    if (rewardType === "item" && !itemName) {
      return interaction.reply({ content: "❌ Item name required.", ephemeral: true });
    }

    if (rewardType === "role" && !role) {
      return interaction.reply({ content: "❌ Role required.", ephemeral: true });
    }

    const exists = await RedeemCode.findOne({ guildId, code });
    if (exists) return interaction.reply({ content: "❌ This code already exists in this server.", ephemeral: true });

    let expiresAt = null;
    if (expiry !== "never") {
      const match = expiry.match(/^(\d+)([hd])$/);
      if (!match) {
        return interaction.reply({ content: "❌ Expiry must be 1h, 12h, 7d, 30d or never.", ephemeral: true });
      }

      expiresAt = new Date();
      const value = Number(match[1]);
      match[2] === "h"
        ? expiresAt.setHours(expiresAt.getHours() + value)
        : expiresAt.setDate(expiresAt.getDate() + value);
    }

    await RedeemCode.create({
      guildId,
      code,
      rewardType,
      amount,
      itemName: itemName || null,
      roleId: role ? role.id : null,
      uses,
      used: 0,
      maxRedeemPerUser,
      redeemedBy: [],
      expiresAt,
      createdBy: interaction.user.id
    });

    const rewardText = rewardType === "role" ? `${role}` : rewardType === "item" ? itemName : `${amount}`;

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("🎁 Server Redeem Code Created")
      .addFields(
        { name: "Code", value: code, inline: true },
        { name: "Reward", value: `${rewardType}: ${rewardText}`, inline: true },
        { name: "Uses", value: `${uses}`, inline: true },
        { name: "Expiry", value: expiry, inline: true },
        { name: "Max/User", value: `${maxRedeemPerUser}`, inline: true }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};