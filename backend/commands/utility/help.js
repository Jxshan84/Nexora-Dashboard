const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Open Rudra Premium Help Center"),

  async execute(interaction) {
    const client = interaction.client;

    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setAuthor({
        name: "RUDRA • HELP CENTER",
        iconURL: client.user.displayAvatarURL(),
      })
      .setTitle("🏠 Home")
      .setDescription(
`> Welcome to **RUDRA Premium**

Select a category from the menu below.

### 📊 Bot Statistics
> ⚡ Ping • \`${client.ws.ping}ms\`
> 🌍 Servers • \`${client.guilds.cache.size}\`
> 👥 Users • \`${client.guilds.cache.reduce((a,g)=>a+g.memberCount,0)}\`
> 🤖 Commands • \`${client.commands.size}\`

━━━━━━━━━━━━━━━━━━

### 📂 Categories
🛡️ Moderation
💰 Economy
🎵 Music
🎙️ Recording
⚙️ Configuration
👑 Management

━━━━━━━━━━━━━━━━━━

### 💎 Premium Features
• Beautiful UI
• Fast Response
• Live Statistics
• Dashboard Support
• Dropdown Navigation`
      )
      .setThumbnail(client.user.displayAvatarURL({ size: 1024 }))
      .setImage("https://i.imgur.com/Z4Q8Q7L.png")
      .setFooter({
        text: `Requested by ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();

    const menu = new StringSelectMenuBuilder()
      .setCustomId("help_menu")
      .setPlaceholder("📂 Select a Category")
      .addOptions([
        {
          label: "Home",
          description: "Return to Home",
          emoji: "🏠",
          value: "home",
        },
        {
          label: "Moderation",
          description: "View moderation commands",
          emoji: "🛡️",
          value: "moderation",
        },
        {
          label: "Economy",
          description: "Economy system",
          emoji: "💰",
          value: "economy",
        },
        {
          label: "Music",
          description: "Music commands",
          emoji: "🎵",
          value: "music",
        },
        {
          label: "Recording",
          description: "Voice recording",
          emoji: "🎙️",
          value: "recording",
        },
        {
          label: "Configuration",
          description: "Bot settings",
          emoji: "⚙️",
          value: "configuration",
        },
        {
          label: "Management",
          description: "Owner commands",
          emoji: "👑",
          value: "management",
        },
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Dashboard")
        .setEmoji("🌐")
        .setStyle(ButtonStyle.Link)
        .setURL("https://YOUR-DASHBOARD"),

      new ButtonBuilder()
        .setLabel("Support")
        .setEmoji("💬")
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.gg/YOURSERVER"),

      new ButtonBuilder()
        .setCustomId("refresh_help")
        .setLabel("Refresh")
        .setEmoji("🔄")
        .setStyle(ButtonStyle.Secondary)
    );

    const msg = await interaction.reply({
      embeds: [embed],
      components: [row, buttons],
      fetchReply: true,
    });
    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 300000,
    });

    collector.on("collect", async (i) => {
      if (i.user.id !== interaction.user.id)
        return i.reply({
          content: "❌ This menu isn't for you.",
          ephemeral: true,
        });

      let page;

      switch (i.values[0]) {
        case "home":
          page = embed;
          break;

        case "moderation":
          page = new EmbedBuilder()
            .setColor("#ff0000")
            .setAuthor({
              name: "🛡️ Moderation",
              iconURL: client.user.displayAvatarURL(),
            })
            .setDescription(
`> Powerful moderation tools

⚒️ **Commands**
• /ban
• /kick
• /timeout
• /untimeout
• /warn
• /warnings
• /clearwarnings
• /purge
• /lock
• /unlock
• /slowmode

━━━━━━━━━━━━━━━━━━

Manage members with ease.`
            )
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp();
          break;

        case "economy":
          page = new EmbedBuilder()
            .setColor("#FFD700")
            .setAuthor({
              name: "💰 Economy",
              iconURL: client.user.displayAvatarURL(),
            })
            .setDescription(
`> Economy System

💵 **Commands**
• /balance
• /daily
• /weekly
• /work
• /beg
• /deposit
• /withdraw
• /pay
• /shop
• /buy
• /inventory

━━━━━━━━━━━━━━━━━━

Earn, spend and grow your wealth.`
            )
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp();
          break;

        case "music":
          page = new EmbedBuilder()
            .setColor("#5865F2")
            .setAuthor({
              name: "🎵 Music",
              iconURL: client.user.displayAvatarURL(),
            })
            .setDescription(
`> Music Commands

🎶 /play
⏸ /pause
▶ /resume
⏭ /skip
📜 /queue
🔊 /volume
⏹ /stop
🎼 /nowplaying`
            )
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp();
          break;

        case "recording":
          page = new EmbedBuilder()
            .setColor("#2ECC71")
            .setAuthor({
              name: "🎙 Recording",
              iconURL: client.user.displayAvatarURL(),
            })
            .setDescription(
`🎙 /record start
⏹ /record stop
📄 /record status

Rudra own Voice Recording`
            )
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp();
          break;
        case "configuration":
          page = new EmbedBuilder()
            .setColor("#0099ff")
            .setAuthor({
              name: "⚙️ Configuration",
              iconURL: client.user.displayAvatarURL(),
            })
            .setDescription(
`> Configure your server

⚙️ **Commands**

• /setup
• /config
• /setprefix
• /autorole
• /welcome
• /goodbye
• /logs
• /reactionrole
• /verify
• /ticket
• /suggestion

━━━━━━━━━━━━━━━━━━

Customize every part of your server.`
            )
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp();
          break;

        case "management":
          page = new EmbedBuilder()
            .setColor("#ff2d55")
            .setAuthor({
              name: "👑 Management",
              iconURL: client.user.displayAvatarURL(),
            })
            .setDescription(
`> Owner & Admin Commands

👑 **Commands**

• /reload
• /eval
• /sync
• /blacklist
• /whitelist
• /shutdown
• /restart
• /maintenance

━━━━━━━━━━━━━━━━━━

Restricted to Bot Owners.`
            )
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp();
          break;
      }

      await i.update({
        embeds: [page],
        components: [row, buttons],
      });
    });

    const buttonCollector = msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 300000,
    });

    buttonCollector.on("collect", async (i) => {
      if (i.user.id !== interaction.user.id)
        return i.reply({
          content: "❌ This menu isn't for you.",
          ephemeral: true,
        });

      if (i.customId === "refresh_help") {
        embed.setDescription(
`> Welcome to **RUDRA Premium**

### 📊 Live Statistics

⚡ Ping • \`${client.ws.ping}ms\`
🌍 Servers • \`${client.guilds.cache.size}\`
👥 Users • \`${client.guilds.cache.reduce((a,g)=>a+g.memberCount,0)}\`
🤖 Commands • \`${client.commands.size}\`

🔄 Refreshed Successfully!`
        );

        await i.update({
          embeds: [embed],
          components: [row, buttons],
        });
      }
    });

    collector.on("end", async () => {
      try {
        await msg.edit({
          components: [],
        });
      } catch {}
    });
  },
};