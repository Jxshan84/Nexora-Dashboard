const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member from the server")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("User to kick")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("reason")
        .setDescription("Reason")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.KickMembers
    ),

  async execute(interaction) {

    await interaction.deferReply();

    const target =
      interaction.options.getUser("user");

    const reason =
      interaction.options.getString("reason") ||
      "No reason provided";

    const member =
      await interaction.guild.members
        .fetch(target.id)
        .catch(() => null);

    if (!member) {
      return interaction.editReply({
        content: "❌ User not found."
      });
    }

    if (!member.kickable) {
      return interaction.editReply({
        content:
          "❌ I cannot kick this member."
      });
    }

    await member.kick(reason);

    const embed = new EmbedBuilder()
      .setColor("Orange")
      .setTitle("👢 Member Kicked")
      .addFields(
        {
          name: "User",
          value: target.tag,
          inline: true
        },
        {
          name: "Moderator",
          value: interaction.user.tag,
          inline: true
        },
        {
          name: "Reason",
          value: reason
        }
      )
      .setTimestamp();

    await interaction.editReply({
      embeds: [embed]
    });
  
  },

  async prefixExecute({
    message,
    args,
    client
  }) {

    const fakeInteraction = {
      guild: message.guild,
      member: message.member,
      user: message.author,
      channel: message.channel,

      options: {
        getUser: () =>
          message.mentions.users.first(),

        getString: () =>
          args.slice(1).join(" ")
      },

      reply: async data =>
        message.reply(data),

      deferReply: async () => {},

      editReply: async data =>
        message.reply(data),

      followUp: async data =>
        message.reply(data)
    };

    return this.execute(
      fakeInteraction,
      client
    );
  }
};