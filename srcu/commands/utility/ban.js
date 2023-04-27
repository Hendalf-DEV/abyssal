const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Выдаёт бан пользователю')
        .addUserOption(option =>
            option.setName('user')
            .setDescription('Укажите пользователя которого Вы хотите забанить')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
            .setDescription('Введите причину бана (Не обязательно)')),
            
            async execute(interaction) {
        if (interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            const reason = interaction.options.getString('reason') ?? 'Не указана';
            const loh = interaction.options.getUser('user')
            const MuteBuild = new EmbedBuilder()
            .setColor('#cc0e00')
            .setTitle(`Выдан бан ${interaction.options.getUser('user').tag}`)
            .setDescription(`Причина бана: ${reason} `)
            .setFooter({ text: `Администратор ${interaction.user.tag}`, iconURL: interaction.guild.iconURL({ dynamic: true })})
        await interaction.reply({ embeds: [MuteBuild] })
        interaction.guild.members.ban(loh, { reason: interaction.options.getString('reason') ?? 'Не указана' });
    } else {
        return await interaction.reply('У вас нету прав')
    }}
};