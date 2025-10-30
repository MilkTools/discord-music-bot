import { SlashCommandBuilder, EmbedBuilder } from "discord.js"
import type { Player } from "discord-player"

export default {
  data: new SlashCommandBuilder().setName("status").setDescription("Show bot status"),
  async execute(interaction: any, player: Player) {
    const queue = player.nodes.get(interaction.guildId)

    const embed = new EmbedBuilder()
      .setTitle("🤖 Bot Status")
      .setColor("#8b5cf6")
      .addFields(
        { name: "Status", value: "🟢 Online", inline: true },
        { name: "Servers", value: `${interaction.client.guilds.cache.size}`, inline: true },
        { name: "Playing", value: queue ? "🎵 Yes" : "⏸️ No", inline: true },
      )

    return interaction.reply({ embeds: [embed] })
  },
}
