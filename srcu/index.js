const { Client, Collection, Events, GatewayIntentBits, REST, Routes, ActivityType } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

require('dotenv').config();
const TOKEN = process.env['TOKEN'];
const GUILD = process.env['GUILD'];
const GPT = process.env['GPT_API_KEY'];
const db = require('./database');

const privateCreate = require("./events/privateCreate");


const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildVoiceStates]});

const commands = [];

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {

    const commandsPath = path.join(foldersPath, folder)
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      if ('data' in command && 'execute' in command) {
        commands.push({
          ...command.data.toJSON(),
        });
      } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
      }
    
      client.commands.set(command.data.name, command);
    }
    
}

module.exports = client;

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

async function handleVoiceStateUpdate(oldState, newState) {
    const userId = newState.member.user.id;
    const oldChannelId = oldState.channelId;
    const newChannelId = newState.channelId;

    if (privateCreate.name === "VOICE_STATE_UPDATE") {
        privateCreate.execute(oldState, newState);
    }

    if (!oldChannelId && newChannelId) {
        // User joined voice channel
        const userJoinTime = Date.now();
        newState.member.user.voiceJoinTime = userJoinTime;

        // Start updating database at regular intervals
        newState.member.user.updateInterval = updateDatabase(userId);
    } else if (oldChannelId && !newChannelId) {
        // User left voice channel
        clearInterval(newState.member.user.updateInterval);

        const userLeaveTime = Date.now();
        const userJoinTime = oldState.member.user.voiceJoinTime || userLeaveTime;
        const timeSpentInVoice = userLeaveTime - userJoinTime;

        db.run(`INSERT OR IGNORE INTO voiceTime (userId, totalTime) VALUES (?, 0)`, userId);
        db.run(`UPDATE voiceTime SET totalTime = totalTime + ? WHERE userId = ?`, [timeSpentInVoice, userId]);
    } else if (!oldState.member.user.voiceJoinTime && newState.member.voice.channel) {
        // The bot starts, and the user is already in a voice channel
        const userJoinTime = Date.now();
        newState.member.user.voiceJoinTime = userJoinTime;

        // Start updating database at regular intervals
        newState.member.user.updateInterval = updateDatabase(userId);
    }
}

function addMemberIfNotExists(tableName, userId) {
    const query = `SELECT * FROM ${tableName} WHERE userId = ?`;
    db.get(query, [userId], (err, row) => {
      if (err) {
        console.error(err.message);
      }
  
      // If the user is not found in the table, add them
      if (!row) {
        const insertQuery = `INSERT INTO ${tableName} (userId) VALUES (?)`;
        db.run(insertQuery, [userId], (err) => {
          if (err) {
            console.error(err.message);
          }
          console.log(`Added user ${userId} to ${tableName}`);
        });
      }
    });
  }

const tables = ['ranking', 'voiceTime', 'users'];

function addRanking(userId) {
    const query = `SELECT * FROM ranking WHERE userId = ?`;
    db.get(query, [userId], (err, row) => {
      if (err) {
        console.error(err.message);
      }
  
      // If the users xp and level are null, add them
      if (row.xp === null || row.level === null) {
        const updateQuery = `UPDATE ranking SET xp = 0, level = 1 WHERE userId = ?`;
        db.run(updateQuery, [userId], (err) => {
            if (err) {
              console.error(err.message);
            }
            console.log(`Set user xp and level for ${userId} to default values in ranking`);
          });
      }
    });
  }

  function addBalance(userId) {
    const query = `SELECT * FROM users WHERE userId = ?`;
    db.get(query, [userId], (err, row) => {
      if (err) {
        console.error(err.message);
      }
  
      // If the users xp and level are null, add them
      if (row.balance === null) {
        const updateQuery = `UPDATE users SET balance = 0 WHERE userId = ?`;
        db.run(updateQuery, [userId], (err) => {
            if (err) {
              console.error(err.message);
            }
            console.log(`Set user balance for ${userId} to default values in users`);
          });
      }
    });
  }

client.once(Events.ClientReady, () => {
    console.log('Бот запущен');
    let totalUsers = 0;
    client.guilds.cache.forEach((guild) => {
        totalUsers += guild.members.cache.filter((member) => !member.user.bot).size;
    });

    client.guilds.cache.each(async (guild) => {
        // Fetch all guild members
        const members = await guild.members.fetch();
    
        // Iterate through each member
        members.each((member) => {
          // Check if the user exists in each database table and add them if not
          addRanking(member.user.id)
          addBalance(member.user.id)

          tables.forEach((tableName) => {
            addMemberIfNotExists(tableName, member.user.id);
          });
        });
    });
    
    
    client.user.setActivity(`за ${totalUsers} участниками`, { type: ActivityType.Watching });
    client.user.setPresence({status: `idle`})
    const CLIENT_ID = client.user.id;
    const rest = new REST({
        version: '9'
    }).setToken(TOKEN);
    (async () => {
        try {
            if (GUILD) {
                await rest.put(
                    Routes.applicationGuildCommands(CLIENT_ID, GUILD), {
                        body: commands
                    },
                );
                console.log('Все команды были обновлены');
            }
        } catch (error) {
            if (error) console.error(error);
        }
    })();    
});

  
function updateDatabase(userId) {
    let lastUpdateTime = Date.now();
    
    // Update database every 10 seconds
    const updateInterval = setInterval(() => {
        const currentTime = Date.now();
        const timeSinceLastUpdate = currentTime - lastUpdateTime;
        lastUpdateTime = currentTime;
        
        db.run(`INSERT OR IGNORE INTO voiceTime (userId, totalTime) VALUES (?, 0)`, userId);
        db.run(`UPDATE voiceTime SET totalTime = totalTime + ? WHERE userId = ?`, [timeSinceLastUpdate, userId]);
    }, 1500);
    
    return updateInterval;
}

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    await handleVoiceStateUpdate(oldState, newState);
});



client.on("messageCreate", async (message) => {
    const { ChatGPT } = await import('discord-chat-gpt');
    const chatGpt = new ChatGPT({
        apiKey: GPT, // get from https://beta.openai.com/account/api-keys
    });
    if (!message.guild || message.author.bot) return;
    let ChatBotChannelId = "1099437710332149910";
    let channel = message.guild.channels.cache.get(ChatBotChannelId);
    if (!channel) return;
    if (message.channel.id === channel.id) {
        let chatreply = await chatGpt.chat(message.content, 'user').catch((e) => {
            console.log(e);
        });
        if (chatreply.length > 2000) {
            chatreply = chatreply.substring(0, 2000);
        }
        message.reply({
            content: `${chatreply}`,
        });
    }
});
  


client.login(TOKEN);
