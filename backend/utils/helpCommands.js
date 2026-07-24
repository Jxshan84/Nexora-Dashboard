const { EmbedBuilder } = require("discord.js");

function createCategoryEmbed(client, user, category) {
  const embed = new EmbedBuilder()
    .setColor("#ff0000")
    .setAuthor({
      name: "RUDRA HELP CENTER",
      iconURL: client.user.displayAvatarURL(),
    })
    .setThumbnail(client.user.displayAvatarURL({ size: 1024 }))
    .setFooter({
      text: `Requested by ${user.username}`,
      iconURL: user.displayAvatarURL(),
    })
    .setTimestamp();

  const commands = [...client.commands.values()].filter(cmd => {
    if (!cmd.category) return false;
    return cmd.category.toLowerCase() === category.toLowerCase();
  });

  const list = commands.length
    ? commands
        .map(c => `</${c.data.name}:${c.data.id ?? "command"}> • ${c.data.description}`)
        .join("\n")
    : "> No commands found.";

  embed
    .setTitle(`${getEmoji(category)} ${capitalize(category)} Commands`)
    .setDescription(list);

  return embed;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getEmoji(category) {
  switch (category) {
    case "moderation":
      return "🛡️";
    case "economy":
      return "💰";
    case "music":
      return "🎵";
    case "recording":
      return "🎙️";
    case "configuration":
      return "⚙️";
    case "management":
      return "👑";
    default:
      return "📂";
  }
}

module.exports = {
  createCategoryEmbed,
};