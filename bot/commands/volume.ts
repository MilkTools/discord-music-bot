import { SlashCommandBuilder } from "discord.js"
import type { Player } from "discord-player"

export default {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Set the volume")
    .addIntegerOption((option) =>
      option.setName("level").setDescription("Volume level (0-100)").setRequired(true).setMinValue(0).setMaxValue(100),
    ),
  async execute(interaction: any, player: Player) {
    const queue = player.nodes.get(interaction.guildId)

    if (!queue) {
      return interaction.reply({ content: "❌ No music is playing!", ephemeral: true })
    }

    const volume = interaction.options.getInteger("level", true)
    queue.node.setVolume(volume)

    return interaction.reply({ content: `🔊 Volume set to ${volume}%` })
  },
}
