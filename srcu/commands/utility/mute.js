const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Выдает мут на определённое время')
        .addUserOption(option =>
            option.setName('user')
            .setDescription('Укажите пользователя которому Вы хотите выдать мут')
            .setRequired(true))
        .addNumberOption(option =>
            option.setName('time')
            .setDescription('Время на которое Вы хотите выдать мут (В минутах)')
            .setRequired(true)),
            
            async execute(interaction) {
        if (interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {

            const MuteBuild = new EmbedBuilder()
            .setColor('#cc0e00')
            .setTitle(`Выдан мут ${interaction.options.getUser('user').tag}`)
            .setDescription(`Длительность мута: ${interaction.options.getNumber('time')} минут`)
            .setFooter({ text: `Администратор ${interaction.user.tag}`, iconURL: interaction.guild.iconURL({ dynamic: true })})
        await interaction.reply({ embeds: [MuteBuild] })
        const loh = interaction.options.getMember('user')
        loh.timeout(interaction.options.getNumber('time')*60000)
        } else {
            return await interaction.reply('У вас нету прав')
        }}
};