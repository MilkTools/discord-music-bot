import { SlashCommandBuilder } from "discord.js"
import type { Player } from "discord-player"

export default {
  data: new SlashCommandBuilder().setName("resume").setDescription("Resume the paused song"),
  async execute(interaction: any, player: Player) {
    const queue = player.nodes.get(interaction.guildId)

    if (!queue) {
      return interaction.reply({ content: "❌ No music is playing!", ephemeral: true })
    }

    queue.node.resume()
    return interaction.reply({ content: "▶️ Resumed the music!" })
  },
}
