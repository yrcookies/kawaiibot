const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config(); // Load environment variables
const fetch = require('node-fetch'); // Static import

// Define your user IDs and mapping
const NOTIFY_USER_IDS = [
    '280902992', '61882199', '92937586', '58182299',
    '122721838', '339302807', '2713924', '1175792084',
    '1039360090', '15035549', '2489912359'
];

const USERNAME_MAPPING = {
    '280902992': 'Ayunox',
    '61882199': 'Literpaw',
    '92937586': 'VipNix',
    '58182299': 'Fosnyx',
    '122721838': 'craftita87',
    '339302807': 'Cruelpaw',
    '2713924': 'Kuroxas',
    '1175792084': 'Sunderfal',
    '1039360090': 'Moonderfal',
    '15035549': 'Cloverpaw',
    '2489912359': 'X_rlxs'
};

// Replace these with your actual values from environment variables
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;
const DISCORD_USER_ID = process.env.DISCORD_USER_ID;
const BOT_TOKEN = process.env.BOT_TOKEN;

const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences
] });

client.once('ready', () => {
    console.log('Bot is online!');
    notifyOnlineUsers();
    setInterval(notifyOnlineUsers, 60000); // Check every minute
});

async function notifyOnlineUsers() {
    console.log('Checking for online users...');

    const url = 'https://kawaiibot.onrender.com/proxy/roblox';
    const body = JSON.stringify({ userIds: NOTIFY_USER_IDS });

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body
        });
        const data = await response.json();
        console.log('Fetched presence data:', data);

        if (!data.userPresences) {
            console.log('No user presences data available.');
            return;
        }

        for (const presence of data.userPresences) {
            const userId = presence.userId;
            const username = USERNAME_MAPPING[userId];
            const gameId = presence.gameId;

            console.log(`User ${username} (${userId}):`, presence);

            if (presence.userPresenceType === 2 && gameId) {
                const gameLink = `https://www.roblox.com/games/${gameId}`;
                const statusText = `Username: ${username}\nGame: [Link to game](${gameLink})`;

                // Create and send embed for online status or game status
                const embed = new EmbedBuilder()
                    .setColor('#8a2be2') // Purple color
                    .setTitle(`${username} status update`)
                    .setDescription(statusText)
                    .setTimestamp()
                    .setFooter({ text: 'Kawaii Bot' });

                const channel = client.channels.cache.get(DISCORD_CHANNEL_ID);

                if (channel) {
                    console.log(`Sending notification for ${username} to channel ${DISCORD_CHANNEL_ID}`);
                    channel.send({ content: `<@${DISCORD_USER_ID}>`, embeds: [embed] });
                } else {
                    console.error('Channel not found.');
                }
            } else {
                if (presence.userPresenceType === 2) {
                    console.log(`Game ID is null for ${username} but user is in-game.`);
                } else {
                    console.log(`No game link available for ${username} or not in a game.`);
                }
            }
        }
    } catch (error) {
        console.error('Error fetching user presence data:', error);
    }
}

client.login(BOT_TOKEN);
