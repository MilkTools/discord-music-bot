import { SlashCommandBuilder, EmbedBuilder } from "discord.js"
import type { Player } from "discord-player"

export default {
  data: new SlashCommandBuilder().setName("queue").setDescription("Show the music queue"),
  async execute(interaction: any, player: Player) {
    const queue = player.nodes.get(interaction.guildId)

    if (!queue || !queue.currentTrack) {
      return interaction.reply({ content: "❌ No music is playing!", ephemeral: true })
    }

    const tracks = queue.tracks.toArray()
    const embed = new EmbedBuilder()
      .setTitle("🎵 Music Queue")
      .setColor("#8b5cf6")
      .setDescription(
        `**Now Playing:**\n${queue.currentTrack.title}\n\n` +
          (tracks.length > 0
            ? `**Up Next:**\n${tracks
                .slice(0, 10)
                .map((track, i) => `${i + 1}. ${track.title}`)
                .join("\n")}`
            : "No songs in queue"),
      )

    return interaction.reply({ embeds: [embed] })
  },
}
