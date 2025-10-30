import { SlashCommandBuilder } from "discord.js"
import type { Player } from "discord-player"

export default {
  data: new SlashCommandBuilder().setName("pause").setDescription("Pause the current song"),
  async execute(interaction: any, player: Player) {
    const queue = player.nodes.get(interaction.guildId)

    if (!queue || !queue.isPlaying()) {
      return interaction.reply({ content: "❌ No music is playing!", ephemeral: true })
    }

    queue.node.pause()
    return interaction.reply({ content: "⏸️ Paused the music!" })
  },
}
