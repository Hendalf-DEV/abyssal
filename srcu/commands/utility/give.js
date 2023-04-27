const { SlashCommandBuilder,  PermissionsBitField} = require('discord.js');
const db = require('../../database.js');

async function addUserXp(userId, xp) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE ranking set xp = ? WHERE userId = ?', [xp, userId], (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addxp')
        .setDescription('Выдает xp')

        .addUserOption(option => option.setName('user')
        .setDescription('Пользователь')
        .setRequired(true))

        .addStringOption(option => option.setName('xp')
        .setDescription('XP')
        .setRequired(true)),
        
    async execute(interaction) {
        if (interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
        const { getUserRank } = require('../fun/rank.js')
        const userRank = await getUserRank(interaction.options.getUser('user').id);
        const userXP = parseInt(await userRank.xp)
        const setXP = parseInt(interaction.options.getString('xp'))
        let xps = Math.floor(userXP + setXP)
        await addUserXp(interaction.options.getUser('user').id, xps)
        await interaction.reply({ content: `<@${interaction.user.id}> выдал <@${interaction.options.getUser('user').id}>, ${interaction.options.getString('xp')}xp` });
    } else {
        await interaction.reply({ content: `У вас нету прав`})
    }},
};
