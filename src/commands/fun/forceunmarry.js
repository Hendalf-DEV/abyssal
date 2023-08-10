const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const db = require('../../database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('forceunmarry')
        .setDescription('Вынужденный брак')
        .addUserOption(option => option.setName('user').setDescription('Первый пользователь в браке').setRequired(true)),
        
    async execute(interaction) {
        if (interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            db.get(`SELECT * FROM married WHERE userId1=? OR userId2=?`, [interaction.options.getUser('user').id, interaction.options.getUser('user').id], async (error, row) => {
                if (!row) {
                    return await interaction.reply('Пользователь не состоит в браке.');
                }

                db.run(`DELETE FROM married WHERE userId1=? OR userId2=?`, [interaction.options.getUser('user').id, interaction.options.getUser('user').id], async (error) => {
                    if (error) {
                        return await interaction.reply('Не удалось развести. Попробуйте снова позже.');
                    }
    
                    await interaction.reply('Вы успешно развели парочку.');
                });
            });
    } else {
        return await interaction.reply('У вас нету прав')
    }},
};
