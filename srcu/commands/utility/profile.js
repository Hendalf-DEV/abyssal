const Canvas = require('canvas');
const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const db = require('../../database');

function formatMilliseconds(ms) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

async function getUserBalance(userId) {
  return new Promise((resolve, reject) => {
      db.get('SELECT balance FROM users WHERE userId = ?', [userId], (error, row) => {
          if (error) {
              reject(error);
          } else {
              resolve(row ? row.balance : 0);
          }
      });
  });
}

async function getBGURL(userId) {
  return new Promise((resolve, reject) => {
      db.get('SELECT backgroundURL FROM backgrounds WHERE userId = ?', [userId], (error, row) => {
        if (error) {
          reject(error);
        } else {
          resolve(row ? row.backgroundURL : 'https://i.imgur.com/H5yzOvq.png');
        }
      });
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('Ваш профиль')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('Укажите пользователя (Опцианально)')
        .setRequired(false)
    ),
    
    
  async execute(interaction) {
    if (interaction.options.getUser('user') !== null) {
    await interaction.deferReply();
    const width = 1080;
    const height = 620;
    const canvas = Canvas.createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const bg = await Canvas.loadImage(await getBGURL(interaction.options.getUser('user').id));
    // Create linear gradient for the background
    
    // Draw the background with a glow effect
    const glowSize = 10;
    const glowColor = '#ffffff';
    
    ctx.beginPath();
    
    const rectWidth = 1050;
    const rectHeight = 590;
    const rectX = 10;
    const rectY = 10;
    const cornerRadius = 20;
    
    // Draw the larger rounded rectangle with the glow effect
    ctx.beginPath();
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = glowSize;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.moveTo(rectX + cornerRadius, rectY);
    ctx.lineTo(rectX + rectWidth - cornerRadius, rectY);
    ctx.arcTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + cornerRadius, cornerRadius);
    ctx.lineTo(rectX + rectWidth, rectY + rectHeight - cornerRadius);
    ctx.arcTo(rectX + rectWidth, rectY + rectHeight, rectX + rectWidth - cornerRadius, rectY + rectHeight, cornerRadius);
    ctx.lineTo(rectX + cornerRadius, rectY + rectHeight);
    ctx.arcTo(rectX, rectY + rectHeight, rectX, rectY + rectHeight - cornerRadius, cornerRadius);
    ctx.lineTo(rectX, rectY + cornerRadius);
    ctx.arcTo(rectX, rectY, rectX + cornerRadius, rectY, cornerRadius);
    ctx.closePath();
    ctx.fill();
    
    ctx.clip();

// Draw the image within the larger rounded rectangle
    ctx.drawImage(bg, rectX, rectY, rectWidth, rectHeight);

    // Load profile picture
    const member = interaction.options.getMember('user');
    const usr = interaction.options.getUser('user');
    const avatar = await Canvas.loadImage(member.displayAvatarURL().replace('.webp', '.jpg'));
    // Draw rounded profile picture with a glow effect
    const profilePictureSize = 225;
    const profilePictureRadius = profilePictureSize / 2;
    const profilePictureX = width / 2 - profilePictureRadius;
    const profilePictureY = height / 2 - profilePictureRadius;
    
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, profilePictureRadius + glowSize, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = glowSize;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fill();
    
    ctx.save();
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, profilePictureRadius, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, profilePictureX, profilePictureY, profilePictureSize, profilePictureSize);
    ctx.restore();
    const name = interaction.options.getMember('user').nickname ? interaction.options.getMember('user').nickname : interaction.options.getUser('user').username
    // Draw user tag
    ctx.font = '52px Museo Cyrl 500';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 185)';
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 8;
    ctx.fillText(`${name}#${interaction.options.getUser('user').discriminator}`, width / 2, 105);
    
    const userBalance = await getUserBalance(usr.id)
    const wallet = await Canvas.loadImage('https://i.imgur.com/NX8TaK8.png');
    ctx.drawImage(wallet, 672, 185, 65, 65);
    ctx.font = '42px Museo Cyrl 500';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText('Душ', 752, 200);
    ctx.fillText(userBalance, 752, 250);

    const userTime = await new Promise(resolve => {
      db.get(`SELECT totalTime FROM voiceTime WHERE userId = ?`, usr.id, (err, row) => {
        if (err) {
          console.error(err);
          resolve(null);
        } else {
          resolve(row);
        }
      });
    });
    
    const timeSpentInVoice = userTime ? userTime.totalTime : 0;
    
    const formattedTimeSpentInVoice = formatMilliseconds(timeSpentInVoice);



    const online = await Canvas.loadImage('https://i.imgur.com/XvHNDuP.png');
    ctx.drawImage(online, 702, 300, 65, 65);
    ctx.font = '42px Museo Cyrl 500';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Онлайн ГЧ', 782, 320);
    ctx.fillText(formattedTimeSpentInVoice, 782, 370);
    

    const buffer = canvas.toBuffer();
    const attachment = new AttachmentBuilder(buffer, { name: 'image.jpg' });
    await interaction.editReply({ files: [attachment]});
    } else {
      
    await interaction.deferReply();
      const width = 1080;
      const height = 620;
      const canvas = Canvas.createCanvas(width, height);
      const ctx = canvas.getContext('2d');
      const bg = await Canvas.loadImage(await getBGURL(interaction.user.id));
      // Create linear gradient for the background
      
      // Draw the background with a glow effect
      const glowSize = 10;
      const glowColor = '#ffffff';
      
      ctx.beginPath();
      
      const rectWidth = 1050;
      const rectHeight = 590;
      const rectX = 10;
      const rectY = 10;
      const cornerRadius = 20;
      
      // Draw the larger rounded rectangle with the glow effect
      ctx.beginPath();
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = glowSize;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.moveTo(rectX + cornerRadius, rectY);
      ctx.lineTo(rectX + rectWidth - cornerRadius, rectY);
      ctx.arcTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + cornerRadius, cornerRadius);
      ctx.lineTo(rectX + rectWidth, rectY + rectHeight - cornerRadius);
      ctx.arcTo(rectX + rectWidth, rectY + rectHeight, rectX + rectWidth - cornerRadius, rectY + rectHeight, cornerRadius);
      ctx.lineTo(rectX + cornerRadius, rectY + rectHeight);
      ctx.arcTo(rectX, rectY + rectHeight, rectX, rectY + rectHeight - cornerRadius, cornerRadius);
      ctx.lineTo(rectX, rectY + cornerRadius);
      ctx.arcTo(rectX, rectY, rectX + cornerRadius, rectY, cornerRadius);
      ctx.closePath();
      ctx.fill();
      
      ctx.clip();

// Draw the image within the larger rounded rectangle
      ctx.drawImage(bg, rectX, rectY, rectWidth, rectHeight);
  
      // Load profile picture
      const user = interaction.user.id;
      const member = interaction.member;
      const avatar = await Canvas.loadImage(member.displayAvatarURL().replace('.webp', '.jpg'));
      // Draw rounded profile picture with a glow effect
      const profilePictureSize = 225;
      const profilePictureRadius = profilePictureSize / 2;
      const profilePictureX = width / 2 - profilePictureRadius;
      const profilePictureY = height / 2 - profilePictureRadius;
      
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, profilePictureRadius + glowSize, 0, 2 * Math.PI, false);
      ctx.closePath();
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = glowSize;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.fill();
      
      ctx.save();
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, profilePictureRadius, 0, 2 * Math.PI, false);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar, profilePictureX, profilePictureY, profilePictureSize, profilePictureSize);
      ctx.restore();
      const name = interaction.member.nickname ? interaction.member.nickname : interaction.user.username
      // Draw user tag
      ctx.font = '52px Museo Cyrl 500';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 185)';
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.shadowBlur = 8;
      ctx.fillText(`${name}#${interaction.user.discriminator}`, width / 2, 105);
      
      const userBalance = await getUserBalance(user)
      const wallet = await Canvas.loadImage('https://i.imgur.com/NX8TaK8.png');
      ctx.drawImage(wallet, 672, 185, 65, 65);
      ctx.font = '42px Museo Cyrl 500';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText('Душ', 752, 200);
      ctx.fillText(userBalance, 752, 250);
  
      const userTime = await new Promise(resolve => {
        db.get(`SELECT totalTime FROM voiceTime WHERE userId = ?`, user, (err, row) => {
          if (err) {
            console.error(err);
            resolve(null);
          } else {
            resolve(row);
          }
        });
      });
      
      const timeSpentInVoice = userTime ? userTime.totalTime : 0;
      
      const formattedTimeSpentInVoice = formatMilliseconds(timeSpentInVoice);

      const online = await Canvas.loadImage('https://i.imgur.com/XvHNDuP.png');
      ctx.drawImage(online, 702, 300, 65, 65);
      ctx.font = '42px Museo Cyrl 500';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Онлайн ГЧ', 782, 320);
      ctx.fillText(formattedTimeSpentInVoice, 782, 370);
      
  
      const buffer = canvas.toBuffer();
      const attachment = new AttachmentBuilder(buffer, { name: 'image.jpg' });
      await interaction.editReply({ files: [attachment] });
    }},
};