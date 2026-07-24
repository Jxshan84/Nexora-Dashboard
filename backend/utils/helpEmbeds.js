const { EmbedBuilder } = require("discord.js");

function homeEmbed(client, user) {
  return new EmbedBuilder()
    .setColor("#ff0000")
    .setAuthor({
      name: "RUDRA HELP CENTER",
      iconURL: client.user.displayAvatarURL(),
    })
    .setTitle("🏠 RUDRA Premium Help")
    .setDescription(
`Welcome to **RUDRA Premium**.

Select a category below to view commands.

━━━━━━━━━━━━━━━━━━

⚡ **Ping:** \`${client.ws.ping}ms\`
🌍 **Servers:** \`${client.guilds.cache.size}\`
👥 **Users:** \`${client.guilds.cache.reduce((a,g)=>a+g.memberCount,0)}\`
🤖 **Commands:** \`${client.commands.size}\`

━━━━━━━━━━━━━━━━━━

🛡️ Moderation
💰 Economy
🎵 Music
🎙️ Recording
⚙️ Configuration
👑 Management`
    )
    .setThumbnail(client.user.displayAvatarURL({ size: 1024 }))
    .setImage(
  "https://raw.githubusercontent.com/Jxshan84/Rudra-Dashboard/main/backend/assets/rudra-help-banner.png"
)
    .setFooter({
      text: `Requested by ${user.username}`,
      iconURL: user.displayAvatarURL(),
    })
    .setTimestamp();
}

module.exports = {
  homeEmbed,
};