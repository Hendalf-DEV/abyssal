const { SlashCommandBuilder } = require('@discordjs/builders');
const { proposals } = require('./marry.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('decline')
        .setDescription('Отклонить предложение о браке'),
        
    async execute(interaction) {
        const proposal = proposals.get(interaction.user.id);

        if (!proposal) {
            return await interaction.reply('У вас нет предложений о браке.');
        }

        proposals.delete(interaction.user.id);

        await interaction.reply(`Вы успешно отклонили предложение о браке от пользователя <@${proposal.proposer}>.`);
    },
};

module.exports.commandName = module.exports.data.name;
