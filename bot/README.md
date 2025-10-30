# Discord Music Bot

This is the standalone Discord music bot that works with your dashboard at `https://music-vdbot.vercel.app`.

## Quick Deploy to Railway (Recommended)

1. **Go to [Railway.app](https://railway.app)** and sign up (free tier available)
2. Click **"New Project"** → **"Empty Project"**
3. Click **"Deploy"** → Upload the bot folder
4. Go to **"Variables"** tab and add:
   \`\`\`
   DISCORD_TOKEN=your_bot_token_here
   KV_REST_API_URL=your_upstash_redis_url
   KV_REST_API_TOKEN=your_upstash_redis_token
   \`\`\`
5. Railway will auto-deploy. Check logs to see "✅ Bot is online"

## Getting Environment Variables

### DISCORD_TOKEN
- Go to [Discord Developer Portal](https://discord.com/developers/applications/1432184518130925770)
- Click "Bot" → Copy token (or reset to get new one)

### KV_REST_API_URL & KV_REST_API_TOKEN
- In v0 dashboard, click **"Vars"** in left sidebar
- Copy `UPSTASH_KV_KV_REST_API_URL` and `UPSTASH_KV_KV_REST_API_TOKEN`

## Local Development

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Create `.env` file:**
   \`\`\`
   DISCORD_TOKEN=your_bot_token_here
   KV_REST_API_URL=your_upstash_redis_url
   KV_REST_API_TOKEN=your_upstash_redis_token
   \`\`\`

3. **Run the bot:**
   \`\`\`bash
   npm run dev
   \`\`\`

## Commands

- `/play <song>` - Play a song from YouTube
- `/pause` - Pause the music
- `/resume` - Resume the music
- `/skip` - Skip current song
- `/stop` - Stop and clear queue
- `/queue` - Show the queue
- `/volume <0-100>` - Set volume
- `/shuffle` - Shuffle the queue
- `/status` - Show bot status

## Features

- Real-time stats tracking (commands used, songs played)
- Syncs with dashboard at `https://music-vdbot.vercel.app`
- YouTube music playback
- Queue management
- Volume control
