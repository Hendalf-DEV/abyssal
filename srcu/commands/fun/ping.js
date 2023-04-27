const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const Canvas = require('canvas');

const client = require('../../index');

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

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Показывает задержу бота'),
    async execute(interaction) {
        await interaction.deferReply();
        const width = 555;
        const height = 205;
        const canvas = Canvas.createCanvas(600, 215);
        const ping = await Canvas.loadImage('https://i.imgur.com/G7x3qBW.png');
        const ctx = canvas.getContext('2d');
        
        // Draw card background
        ctx.fillStyle = '#101010';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 5;
        roundRect(ctx, 5, 5, width, height, 15);
        ctx.fill();
        ctx.shadowBlur = 0;

        const pingSize = 122;
        const pingX = 45;
        const pingY = 45;
        ctx.save(); // Save the context state
        ctx.drawImage(ping, pingX, pingY, pingSize, pingSize);
        ctx.restore(); // Restore the context to its original state

        ctx.font = '34px Museo Cyrl 500';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.shadowColor = 'rgba(0, 0, 0, 185)';
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 8;
        ctx.fillText(`Задержка: ${Date.now() - interaction.createdTimestamp}ms`, width / 2.8, height / 2.4);

        ctx.font = '34px Museo Cyrl 500';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.shadowColor = 'rgba(0, 0, 0, 185)';
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 8;
        ctx.fillText(`Задержка API: ${Math.round(client.ws.ping)}ms`, width / 2.8, height / 1.4);

        const buffer = canvas.toBuffer();
        const attachment = new AttachmentBuilder(buffer, { name: 'image.jpg' });
        await interaction.followUp({ files: [attachment] });
    },
};
