const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('../../database.js');
const { proposals } = require('./marry.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('accept')
        .setDescription('Принять предложение о браке'),
        category: 'user',
    async execute(interaction) {
        const proposal = proposals.get(interaction.user.id);

        if (!proposal) {
            return await interaction.reply('У вас нет предложений о браке.');
        }

        db.run(`INSERT INTO married (userId1, userId2) VALUES (?, ?)`, [proposal.proposer, proposal.proposed], async (error) => {
            if (error) {
                return await interaction.reply('Не удалось принять предложение о браке. Попробуйте снова позже.');
            }

            // Удаляем предложение о браке из коллекции proposals
            proposals.delete(interaction.user.id);

            await interaction.reply(`Вы успешно приняли предложение о браке от пользователя <@${proposal.proposer}>.`);
        });
    },
};

module.exports.commandName = module.exports.data.name;

