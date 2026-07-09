const ReactionRole = require("../models/ReactionRole");

module.exports = (client) => {

  client.on("messageReactionAdd", async (reaction, user) => {
    if (user.bot) return;

    try {
      if (reaction.partial) await reaction.fetch();
      if (reaction.message.partial) await reaction.message.fetch();

      const guild = reaction.message.guild;
      if (!guild) return;

      const emoji = reaction.emoji.toString();

      const data = await ReactionRole.findOne({
        guildId: guild.id,
        messageId: reaction.message.id,
        "roles.emoji": emoji
      });

      if (!data) return;

      const roleData = data.roles.find(r => r.emoji === emoji);
      if (!roleData) return;

      const member = await guild.members.fetch(user.id);
      const role = guild.roles.cache.get(roleData.roleId);

      if (!role) return;

      if (data.type === "unique") {
        for (const r of data.roles) {
          if (r.roleId !== roleData.roleId) {
            await member.roles.remove(r.roleId).catch(() => {});
          }
        }
      }

      if (data.type === "reversed") {
        await member.roles.remove(role.id).catch(() => {});
      } else {
        await member.roles.add(role.id).catch(() => {});
      }

    } catch (err) {
      console.error("Reaction Add Error:", err);
    }
  });

  client.on("messageReactionRemove", async (reaction, user) => {
    if (user.bot) return;

    try {
      if (reaction.partial) await reaction.fetch();
      if (reaction.message.partial) await reaction.message.fetch();

      const guild = reaction.message.guild;
      if (!guild) return;

      const emoji = reaction.emoji.toString();

      const data = await ReactionRole.findOne({
        guildId: guild.id,
        messageId: reaction.message.id,
        "roles.emoji": emoji
      });

      if (!data) return;

      const roleData = data.roles.find(r => r.emoji === emoji);
      if (!roleData) return;

      const member = await guild.members.fetch(user.id);
      const role = guild.roles.cache.get(roleData.roleId);

      if (!role) return;

      if (data.type === "verify") return;

      if (data.type === "reversed") {
        await member.roles.add(role.id).catch(() => {});
      } else {
        await member.roles.remove(role.id).catch(() => {});
      }

    } catch (err) {
      console.error("Reaction Remove Error:", err);
    }
  });

};