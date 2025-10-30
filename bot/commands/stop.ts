import { SlashCommandBuilder } from "discord.js"
import type { Player } from "discord-player"

export default {
  data: new SlashCommandBuilder().setName("stop").setDescription("Stop the music and clear the queue"),
  async execute(interaction: any, player: Player) {
    const queue = player.nodes.get(interaction.guildId)

    if (!queue) {
      return interaction.reply({ content: "❌ No music is playing!", ephemeral: true })
    }

    queue.delete()
    return interaction.reply({ content: "⏹️ Stopped the music!" })
  },
}
