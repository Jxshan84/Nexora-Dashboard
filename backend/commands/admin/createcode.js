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

    .setDefaultMemberPermissions(
      PermissionFlagsBits.ManageGuild
    )

    .addStringOption(option =>
      option
        .setName("code")
        .setDescription("Redeem code")
        .setRequired(true)
    )

    .addStringOption(option =>
      option
        .setName("rewardtype")
        .setDescription("Reward type")
        .setRequired(true)

        .addChoices(

          {
            name: "Coins",
            value: "coins"
          },

          {
            name: "Gems",
            value: "gems"
          },

          {
            name: "Premium Gems",
            value: "premiumgems"
          },

          {
            name: "XP",
            value: "xp"
          },

          {
            name: "Item",
            value: "item"
          },

          {
            name: "Role",
            value: "role"
          }
        )
    )

    .addIntegerOption(option =>
      option
        .setName("amount")
        .setDescription("Reward amount")
        .setRequired(true)
        .setMinValue(1)
    )

    .addIntegerOption(option =>
      option
        .setName("uses")
        .setDescription("Maximum uses")
        .setRequired(true)
        .setMinValue(1)
    )

    .addStringOption(option =>
      option
        .setName("expiry")
        .setDescription("1h, 12h, 7d, 30d or never")
        .setRequired(true)
    )

    .addStringOption(option =>
      option
        .setName("item")
        .setDescription("Item name")
        .setRequired(false)
    )

    .addRoleOption(option =>
      option
        .setName("role")
        .setDescription("Role reward")
        .setRequired(false)
    )

    .addIntegerOption(option =>
      option
        .setName("maxredeemperuser")
        .setDescription("Redeems per user")
        .setRequired(false)
        .setMinValue(1)
    ),

  async execute(interaction) {

    if (
      !interaction.member.permissions.has(
        PermissionFlagsBits.ManageGuild
      )
    ) {
      return interaction.reply({
        content:
          "❌ You need Manage Server permission.",
        ephemeral: true
      });
    }

    const guildId = interaction.guild.id;

    const code = interaction.options
      .getString("code")
      .toUpperCase();

    const rewardType =
      interaction.options.getString(
        "rewardtype"
      );

    const amount =
      interaction.options.getInteger(
        "amount"
      );

    const uses =
      interaction.options.getInteger(
        "uses"
      );

    const expiry =
      interaction.options
        .getString("expiry")
        .toLowerCase();

    const itemName =
      interaction.options.getString(
        "item"
      );

    const role =
      interaction.options.getRole(
        "role"
      );

    const maxRedeemPerUser =
      interaction.options.getInteger(
        "maxredeemperuser"
      ) || 1;

    if (
      rewardType === "item" &&
      !itemName
    ) {
      return interaction.reply({
        content:
          "❌ Item name required.",
        ephemeral: true
      });
    }

    if (
      rewardType === "role" &&
      !role
    ) {
      return interaction.reply({
        content:
          "❌ Role required.",
        ephemeral: true
      });
    }

    const existingCode =
      await RedeemCode.findOne({
        guildId,
        code
      });

    if (existingCode) {
      return interaction.reply({
        content:
          "❌ This code already exists.",
        ephemeral: true
      });
    }

    let expiresAt = null;

    if (expiry !== "never") {

      const match =
        expiry.match(
          /^(\d+)([hd])$/
        );

      if (!match) {
        return interaction.reply({
          content:
            "❌ Expiry must be like: 1h, 12h, 7d, 30d or never.",
          ephemeral: true
        });
      }

      const value = Number(
        match[1]
      );

      const unit = match[2];

      expiresAt = new Date();

      if (unit === "h") {
        expiresAt.setHours(
          expiresAt.getHours() +
            value
        );
      }

      if (unit === "d") {
        expiresAt.setDate(
          expiresAt.getDate() +
            value
        );
      }
    }

    await RedeemCode.create({

      guildId,

      code,

      rewardType,

      amount,

      itemName:
        itemName || null,

      roleId:
        role?.id || null,

      uses,

      used: 0,

      maxRedeemPerUser,

      redeemedBy: [],

      expiresAt,

      createdBy:
        interaction.user.id

    });

    const rewardText =
      rewardType === "role"
        ? role.toString()
        : rewardType === "item"
        ? itemName
        : `${amount}`;

    const embed =
      new EmbedBuilder()

        .setColor("#57F287")

        .setTitle(
          "🎁 Redeem Code Created"
        )

        .addFields(

          {
            name: "🔑 Code",
            value: `\`${code}\``,
            inline: true
          },

          {
            name: "🎁 Reward",
            value: `${rewardType}\n${rewardText}`,
            inline: true
          },

          {
            name: "📦 Uses",
            value: `${uses}`,
            inline: true
          },

          {
            name: "⏳ Expiry",
            value: expiry,
            inline: true
          },

          {
            name: "👤 Max/User",
            value: `${maxRedeemPerUser}`,
            inline: true
          }

        )

        .setFooter({
          text: `Created by ${interaction.user.username}`
        })

        .setTimestamp();

    await interaction.reply({
      embeds: [embed]
    });
  }
};