const { Client, Collection, Events, GatewayIntentBits, REST, Routes, ActivityType } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

require('dotenv').config();
const TOKEN = process.env['TOKEN'];
const GUILD = process.env['GUILD'];
const db = require('./database');

const privateCreate = require("./events/privateCreate");


const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildVoiceStates]});
module.exports = client;
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

    if (!oldChannelId && newChannelId && !newState.mute) {
        const userJoinTime = Date.now();
        newState.member.user.voiceJoinTime = userJoinTime;

        newState.member.user.updateInterval = updateDatabase(userId);
    } else if (oldChannelId && !newChannelId) {
        clearInterval(newState.member.user.updateInterval);

        const userLeaveTime = Date.now();
        const userJoinTime = oldState.member.user.voiceJoinTime || userLeaveTime;
        const timeSpentInVoice = userLeaveTime - userJoinTime;

        db.run(`INSERT OR IGNORE INTO voiceTime (userId, totalTime) VALUES (?, 0)`, userId);
        db.run(`UPDATE voiceTime SET totalTime = totalTime + ? WHERE userId = ?`, [timeSpentInVoice, userId]);
    } else if (!oldState.member.user.voiceJoinTime && newState.member.voice.channel && !newState.mute) {
        const userJoinTime = Date.now();
        newState.member.user.voiceJoinTime = userJoinTime;

        newState.member.user.updateInterval = updateDatabase(userId);
    } else if (oldState.mute && !newState.mute) {
        const userJoinTime = Date.now();
        newState.member.user.voiceJoinTime = userJoinTime;

        newState.member.user.updateInterval = updateDatabase(userId);
    } else if (!oldState.mute && newState.mute) {
        clearInterval(newState.member.user.updateInterval);
    }
}


function addMemberIfNotExists(tableName, userId) {
    const query = `SELECT * FROM ${tableName} WHERE userId = ?`;
    db.get(query, [userId], (err, row) => {
      if (err) {
        console.error(err.message);
      }
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

const tables = ['voiceTime'];

function addRanking(userId) {
  const query = `SELECT * FROM ranking WHERE userId = ?`;
  db.get(query, [userId], (err, row) => {
      if (err) {
          console.error(err.message);
      }
      if (row && (row.xp === null || row.level === null)) {
          const updateQuery = `UPDATE ranking SET xp = 0, level = 1 WHERE userId = ?`;
          db.run(updateQuery, [userId], (err) => {
              if (err) {
                  console.error(err.message);
              }
              console.log(`Set user xp and level for ${userId} to default values in ranking`);
          });
      } else if (!row) {
          const insertQuery = `INSERT INTO ranking (userId, xp, level) VALUES (?, 0, 1)`;
          db.run(insertQuery, [userId], (err) => {
              if (err) {
                  console.error(err.message);
              }
              console.log(`Added user ${userId} to ranking with default values`);
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

      if (row && row.balance === null) {
          const updateQuery = `UPDATE users SET balance = 0 WHERE userId = ?`;
          db.run(updateQuery, [userId], (err) => {
              if (err) {
                  console.error(err.message);
              }
              console.log(`Set user balance for ${userId} to default values in users`);
          });
      } else if (!row) {
          const insertQuery = `INSERT INTO users (userId, balance) VALUES (?, 0)`;
          db.run(insertQuery, [userId], (err) => {
              if (err) {
                  console.error(err.message);
              }
              console.log(`Added user ${userId} to users with default values`);
          });
      }
  });
}

client.once(Events.GuildMemberAdd, () => {
    client.guilds.cache.each(async (guild) => {
        const members = await guild.members.fetch();
    
        members.each((member) => {
          addRanking(member.user.id)
          addBalance(member.user.id)

          tables.forEach((tableName) => {
            addMemberIfNotExists(tableName, member.user.id);
          });
        });
    })
})


client.once(Events.ClientReady, () => {
    console.log('Бот запущен');
    let totalUsers = 0;
    client.guilds.cache.forEach((guild) => {
        totalUsers += guild.members.cache.filter((member) => !member.user.bot).size;
    });

    client.guilds.cache.each(async (guild) => {
        const members = await guild.members.fetch();
    
        members.each((member) => {
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

client.login(TOKEN);
