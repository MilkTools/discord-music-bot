import { Client, GatewayIntentBits, Collection, REST, Routes } from "discord.js"
import { Player } from "discord-player"
import { YoutubeiExtractor } from "discord-player-youtubei"

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages],
})

// Initialize music player
const player = new Player(client)
await player.extractors.register(YoutubeiExtractor, {})

// Store commands
client.commands = new Collection()

// Import commands
import playCommand from "./commands/play.js"
import pauseCommand from "./commands/pause.js"
import resumeCommand from "./commands/resume.js"
import skipCommand from "./commands/skip.js"
import stopCommand from "./commands/stop.js"
import queueCommand from "./commands/queue.js"
import volumeCommand from "./commands/volume.js"
import shuffleCommand from "./commands/shuffle.js"
import statusCommand from "./commands/status.js"

const commands = [
  playCommand,
  pauseCommand,
  resumeCommand,
  skipCommand,
  stopCommand,
  queueCommand,
  volumeCommand,
  shuffleCommand,
  statusCommand,
]

// Register commands
commands.forEach((command) => {
  client.commands.set(command.data.name, command)
})

// Deploy slash commands
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!)

client.once("ready", async () => {
  console.log(`✅ Bot is online as ${client.user?.tag}`)

  // Register commands globally
  try {
    console.log("🔄 Registering slash commands...")
    await rest.put(Routes.applicationCommands(client.user!.id), { body: commands.map((cmd) => cmd.data.toJSON()) })
    console.log("✅ Slash commands registered!")
  } catch (error) {
    console.error("❌ Error registering commands:", error)
  }
})

async function isCommandEnabled(guildId: string, commandName: string): Promise<boolean> {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return true // Default to enabled if Redis not configured
  }

  try {
    const response = await fetch(`${process.env.KV_REST_API_URL}/get/guild:${guildId}:command:${commandName}:enabled`, {
      headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
    })
    const data = await response.json()
    return data.result !== false // Default to enabled if not set
  } catch (error) {
    console.error("Error checking command state:", error)
    return true // Default to enabled on error
  }
}

// Handle interactions
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  const command = client.commands.get(interaction.commandName)
  if (!command) return

  const enabled = await isCommandEnabled(interaction.guildId!, interaction.commandName)
  if (!enabled) {
    await interaction.reply({
      content: "⚠️ This command has been disabled by a server administrator.",
      ephemeral: true,
    })
    return
  }

  try {
    // Track command usage in Redis
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const statsKey = `guild:${interaction.guildId}:stats`
      const commandsKey = `guild:${interaction.guildId}:commands:${new Date().toISOString().split("T")[0]}`

      // Increment command count
      await fetch(`${process.env.KV_REST_API_URL}/incr/${commandsKey}`, {
        headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
      })

      // Set expiry for daily stats (7 days)
      await fetch(`${process.env.KV_REST_API_URL}/expire/${commandsKey}/604800`, {
        headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
      })
    }

    await command.execute(interaction, player)
  } catch (error) {
    console.error("Error executing command:", error)
    const reply = { content: "There was an error executing this command!", ephemeral: true }

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply)
    } else {
      await interaction.reply(reply)
    }
  }
})

// Track songs played
player.events.on("playerStart", async (queue, track) => {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const songsKey = `guild:${queue.guild.id}:songs:${new Date().toISOString().split("T")[0]}`

    // Increment songs played count
    await fetch(`${process.env.KV_REST_API_URL}/incr/${songsKey}`, {
      headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
    })

    // Set expiry (7 days)
    await fetch(`${process.env.KV_REST_API_URL}/expire/${songsKey}/604800`, {
      headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
    })
  }
})

client.login(process.env.DISCORD_TOKEN)
