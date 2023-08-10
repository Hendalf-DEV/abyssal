const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('../../database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmarry')
        .setDescription('Развод'),
        
    async execute(interaction) {
        db.get(`SELECT * FROM married WHERE userId1=? OR userId2=?`, [interaction.user.id, interaction.user.id], async (error, row) => {
            if (!row) {
                return await interaction.reply('Вы не состоите в браке.');
            }

            db.run(`DELETE FROM married WHERE userId1=? OR userId2=?`, [interaction.user.id, interaction.user.id], async (error) => {
                if (error) {
                    return await interaction.reply('Не удалось развестись. Попробуйте снова позже.');
                }

                await interaction.reply('Вы успешно развелись.');
            });
        });
    },
};
