const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const db = require('../../database.js');

function getRandomXP() {
  const weights = [
    { value: 5, weight: 0.3 },
    { value: 10, weight: 0.25 },
    { value: 15, weight: 0.2 },
    { value: 20, weight: 0.15 },
    { value: 25, weight: 0.1 },
  ];

  const totalWeight = weights.reduce((acc, curr) => acc + curr.weight, 0);
  let random = Math.random() * totalWeight;
  let weightSum = 0;

  for (const { value, weight } of weights) {
    weightSum += weight;
    if (random <= weightSum) {
      return Math.round(value);
    }
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Получить ежедневный бонус'),
    
  async execute(interaction) {
    async function daily(userId, stingNow) {
        return new Promise((resolve, reject) => {
          db.get(`SELECT * FROM dailies WHERE userId = ?`, [userId], async (error, row) => {
            if (error) {
              reject(error);
              return;
            }
            if (!row) {
              db.run(`INSERT INTO dailies (userId, lastClaim) VALUES (?, ?)`, [userId, stingNow], (error) => {
                if (error) {
                  reject(error);
                  return;
                }
                resolve(null);
              });
            } else {
              resolve(new Date(row.lastClaim));
            }
          });
        });
      }
    const userId = interaction.user.id;
    const now = new Date();

    const lastClaim = await await daily(userId, now.toISOString());
    const timeDifference = now - lastClaim;

    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (!lastClaim || timeDifference >= twentyFourHours) {
      const bonus = getRandomXP()

      
        db.run(`UPDATE users SET balance = balance + ? WHERE userId = ?`, [bonus, userId], (error) => {
        if (error) {
          console.error(error);
          return;
        }
      });

        db.run(`UPDATE dailies SET lastClaim = ? WHERE userId = ?`, [now.toISOString(), userId], (error) => {
        if (error) {
          console.error(error);
          return;
        }
      });

      const dalies = new EmbedBuilder()
        .setColor(0x1c1d1f)
        .setTitle(`Ежедневный Бонус`)
        .setDescription(`Вы получили еженедневные души в размере ${bonus}`)
        .setFooter({ text: `Abyss Souls`, iconURL: interaction.guild.iconURL({ dynamic: true }) });

      await interaction.reply({
        embeds: [dalies],
        ephemeral: false,
      });
    } else {
      const timeRemaining = twentyFourHours - timeDifference;

      await interaction.reply({
        content: `Вы уже получили свой ежедневные души. Пожалуйста, подождите ${Math.ceil(timeRemaining / 3600000)} час(а).`,
        ephemeral: true,
      });
    }
  },
};

module.exports.commandName = module.exports.data.name;
