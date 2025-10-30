import { SlashCommandBuilder } from "discord.js"
import type { Player } from "discord-player"

export default {
  data: new SlashCommandBuilder().setName("shuffle").setDescription("Shuffle the queue"),
  async execute(interaction: any, player: Player) {
    const queue = player.nodes.get(interaction.guildId)

    if (!queue || queue.tracks.size === 0) {
      return interaction.reply({ content: "❌ No songs in queue to shuffle!", ephemeral: true })
    }

    queue.tracks.shuffle()
    return interaction.reply({ content: "🔀 Shuffled the queue!" })
  },
}
