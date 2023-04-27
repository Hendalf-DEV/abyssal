
const { ActionRowBuilder, ButtonBuilder,SlashCommandBuilder } = require('discord.js');
const db = require('../../database');

async function getBought(userId, productId) {
    return new Promise((resolve, reject) => {
        db.get('SELECT productId FROM user_products WHERE userId = ? AND productId = ?', [userId, productId], (error, row) => {
          if (error) {
            reject(error);
          } else {
            resolve(row ? row.productId : 'default_background');
          }
        });
    });
  }

async function hasBougt(userId, product) {
    if (await getBought(userId, product) == product) {
        return false
    } else {
        return true
    }
}

async function getBG(userId, background) {
    return new Promise((resolve, reject) => {
        db.get('SELECT background FROM backgrounds WHERE userId = ? AND background = ?', [userId, background], (error, row) => {
          if (error) {
            reject(error);
          } else {
            resolve(row ? row.background : '');
          }
        });
    });
  }


const bg_purpur = 'bg_purpur';
const bg_void = 'bg_void';
const bg_spurpur = 'Лесной фон';
const bg_svoid = 'Пустота';
const bg_abyssal = 'Abyssal';


async function isBG(userId, background) {
    if (await getBG(userId, background) == background) {
        return 'Primary'
    } else {
        return 'Secondary'
    }
}


module.exports = {
  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Ваш профиль'),
    
    
  async execute(interaction) {
    const user = interaction.user
    console.log(await hasBougt(user.id, bg_purpur))
      const buttonRow = new ActionRowBuilder()
          .setComponents(
                new ButtonBuilder()
                    .setCustomId('default_background')
                    .setLabel('Дефолтный фон')
                    .setStyle(`${await isBG(user.id, bg_abyssal)}`),
                new ButtonBuilder()
                    .setCustomId('bg_purpur')
                    .setLabel('Лесной фон')
                    .setStyle(`${await isBG(user.id, bg_spurpur)}`)
                    .setDisabled(await hasBougt(user.id, bg_purpur)),
                new ButtonBuilder()
                    .setCustomId('bg_void')
                    .setLabel('Пустотный фон')
                    .setStyle(`${await isBG(user.id, bg_svoid)}`)
                    .setDisabled(await hasBougt(user.id, bg_void))
          );
      
      await interaction.reply({ content: 'Выберите фон профиля:', components: [buttonRow], ephemeral: true });
      return;
}};