const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const db = require('../../database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('forcemarry')
        .setDescription('Вынужденный брак')
        .addUserOption(option => option.setName('user1').setDescription('Первый пользователь в браке').setRequired(true))
        .addUserOption(option => option.setName('user2').setDescription('Второй пользователь в браке').setRequired(true)),
        
    async execute(interaction) {
        if (interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
        const user1 = interaction.options.getUser('user1');
        const user2 = interaction.options.getUser('user2');

        if (user1.id === user2.id) {
            return await interaction.reply('Пользователи не могут жениться на самих себе.');
        }

        db.get(`SELECT * FROM married WHERE (userId1=? AND userId2=?) OR (userId1=? AND userId2=?)`, [user1.id, user2.id, user2.id, user1.id], async (error, row) => {
            if (row) {
                return await interaction.reply('Эти пользователи уже состоят в браке.');
            }

            db.run(`INSERT INTO married (userId1, userId2) VALUES (?, ?)`, [user1.id, user2.id], async (error) => {
                if (error) {
                    return await interaction.reply('Не удалось вынудить брак. Попробуйте снова позже.');
                }

                await interaction.reply(`Пользователи ${user1.username} и ${user2.username} успешно поженились.`);
            });
        });
    } else {
        return await interaction.reply('У вас нету прав')
    }},
};

module.exports.commandName = module.exports.data.name;
