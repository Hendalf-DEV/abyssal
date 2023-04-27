const { SlashCommandBuilder } = require('discord.js');
const coms = require('../../index.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Выводит список команд'),
        category: 'user',
    async execute(interaction) {
        console.log(coms)
        await interaction.reply({ content: `Временная команда`})
    },
};
