const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const db = require('../../database.js');
const Canvas = require('canvas');

async function getUserRank(userId) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM ranking WHERE userId = ?', [userId], (err, row) => {
            if (err) reject(err);
            resolve(row);
        });
    });
}

function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.arc(x + radius, y + radius, radius, Math.PI, 1.5 * Math.PI);
    ctx.lineTo(x + width - radius, y);
    ctx.arc(x + width - radius, y + radius, radius, 1.5 * Math.PI, 2 * Math.PI);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arc(x + width - radius, y + height - radius, radius, 0, 0.5 * Math.PI);
    ctx.lineTo(x + radius, y + height);
    ctx.arc(x + radius, y + height - radius, radius, 0.5 * Math.PI, Math.PI);
    ctx.closePath();
}

function circleClip(ctx, x, y, radius) {
    ctx.beginPath();
    ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI);
    ctx.clip();
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Показывает ваш ранг'),
        
    async execute(interaction) {
        const userRank = await getUserRank(interaction.user.id);

        await interaction.deferReply();
        const currentLevel = userRank.level;
        const { calculateRequiredXP } = require('../../events/xpEvent.js');
        const requiredXP = calculateRequiredXP(currentLevel);
        const width = 655;
        const height = 225;
        const canvas = Canvas.createCanvas(665, 235);
        const ctx = canvas.getContext('2d');
        

        ctx.fillStyle = '#101010';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 5;
        roundRect(ctx, 5, 5, width, height, 15);
        ctx.fill();
        ctx.shadowBlur = 0;

        const avatarSize = 160;
        const avatarX = 40;
        const avatarY = 40;
        const member = interaction.member;
        const avatarImage = await Canvas.loadImage(await member.displayAvatarURL().replace('.webp', '.jpg'));
        ctx.save();
        circleClip(ctx, avatarX, avatarY, avatarSize / 2);
        ctx.drawImage(avatarImage, avatarX, avatarY, avatarSize, avatarSize);
        ctx.restore();


        ctx.fillStyle = '#FFFFFF';
        roundRect(ctx, 240, 160, 380, 36, 15);
        ctx.fill();

        const progressWidth = (userRank.xp / requiredXP) * 375;

        ctx.fillStyle = '#171717';
        roundRect(ctx, 242, 162, progressWidth, 32, 15);
        ctx.fill();

        ctx.font = '36px Museo Cyrl 500';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.shadowColor = 'rgba(0, 0, 0, 185)';
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 8;
        ctx.fillText(`${interaction.user.tag}`, width / 2.7, height / 3.2);

        ctx.font = '30px Museo Cyrl 500';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.shadowColor = 'rgba(0, 0, 0, 185)';
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 8;
        ctx.fillText(`Rank: ${userRank.level}`, width / 2.7, height / 2.1);

        ctx.font = '30px Museo Cyrl 500';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.shadowColor = 'rgba(0, 0, 0, 185)';
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 8;
        ctx.fillText(`XP: ${userRank.xp}/${requiredXP}`, width / 2.7, height / 1.55);

        const buffer = canvas.toBuffer();
        const attachment = new AttachmentBuilder(buffer, { name: 'image.jpg' });
        await interaction.followUp({ files: [attachment] });
    },
};

module.exports.getUserRank = getUserRank;
