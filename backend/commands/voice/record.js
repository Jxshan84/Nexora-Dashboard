const {
  SlashCommandBuilder,
  EmbedBuilder
} = require("discord.js");

const {
  joinVoiceChannel,
  getVoiceConnection
} = require("@discordjs/voice");

const activeRecordings = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("record")
    .setDescription("Voice recording system")

    .addSubcommand(sub =>
      sub
        .setName("start")
        .setDescription("Start recording")
    )

    .addSubcommand(sub =>
      sub
        .setName("stop")
        .setDescription("Stop recording")
    )

    .addSubcommand(sub =>
      sub
        .setName("status")
        .setDescription("Check recording status")
    ),

  async execute(interaction) {

    const sub =
      interaction.options.getSubcommand();

    const guildId =
      interaction.guild.id;

    /* =======================
       START
    ======================= */

    if (sub === "start") {

      const channel =
        interaction.member.voice.channel;

      if (!channel) {

        return interaction.reply({
          content:
            "❌ Pehle voice channel join karo.",
          ephemeral: true
        });

      }

      if (
        activeRecordings.has(guildId)
      ) {

        return interaction.reply({
          content:
            "❌ Recording already chal rahi hai.",
          ephemeral: true
        });

      }

      joinVoiceChannel({

        channelId:
          channel.id,

        guildId:
          guildId,

        adapterCreator:
          interaction.guild
            .voiceAdapterCreator,

        selfDeaf: false

      });

      activeRecordings.set(
        guildId,
        {

          channelId:
            channel.id,

          startedBy:
            interaction.user.id,

          startedAt:
            Date.now()

        }
      );

      const embed =
        new EmbedBuilder()

          .setColor("Red")

          .setTitle(
            "🎙️ Recording Started"
          )

          .setDescription(

            `Recording started in ${channel}.`

          )

          .addFields(

            {

              name:
                "Started By",

              value:
                `${interaction.user}`,

              inline: true

            },

            {

              name:
                "Channel",

              value:
                channel.name,

              inline: true

            }

          )

          .setTimestamp();

      return interaction.reply({

        embeds: [embed]

      });

    }

    /* =======================
       STATUS
    ======================= */

    if (sub === "status") {

      const data =
        activeRecordings.get(
          guildId
        );

      if (!data) {

        return interaction.reply({

          content:
            "⚪ No recording active.",

          ephemeral: true

        });

      }

      const minutes =
        Math.floor(

          (Date.now() -
            data.startedAt) /

          60000

        );

      return interaction.reply({

        content:

          `🎙️ Recording Active\n\n` +

          `📍 Channel: <#${data.channelId}>\n` +

          `⏱️ Duration: ${minutes} min`,

        ephemeral: true

      });

    }

    /* =======================
       STOP
    ======================= */

    if (sub === "stop") {

      const connection =
        getVoiceConnection(
          guildId
        );

      if (
        !connection ||
        !activeRecordings.has(
          guildId
        )
      ) {

        return interaction.reply({

          content:
            "❌ No recording active.",

          ephemeral: true

        });

      }

      connection.destroy();

      activeRecordings.delete(
        guildId
      );

      return interaction.reply({

        content:
          "⏹️ Recording stopped."

      });

    }

  }
};