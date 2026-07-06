module.exports = {
  data: {
    name: "addgems",
    toJSON() {
      return {
        name: "gems.js",
        description: "Coming soon"
      };
    }
  },
  async execute(interaction) {
    await interaction.reply({
      content: "💎 Add Gems command coming soon.",
      ephemeral: true
    });
  }
};