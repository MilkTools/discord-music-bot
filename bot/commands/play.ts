import { SlashCommandBuilder, type GuildMember } from "discord.js"
import type { Player } from "discord-player"

export default {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song")
    .addStringOption((option) => option.setName("query").setDescription("Song name or URL").setRequired(true)),
  async execute(interaction: any, player: Player) {
    const member = interaction.member as GuildMember

    if (!member.voice.channel) {
      return interaction.reply({ content: "❌ You need to be in a voice channel!", ephemeral: true })
    }

    await interaction.deferReply()

    const query = interaction.options.getString("query", true)

    try {
      const { track } = await player.play(member.voice.channel, query, {
        nodeOptions: {
          metadata: interaction,
        },
      })

      return interaction.followUp({ content: `🎵 Now playing: **${track.title}**` })
    } catch (error) {
      console.error(error)
      return interaction.followUp({ content: "❌ Could not play that song!" })
    }
  },
}
