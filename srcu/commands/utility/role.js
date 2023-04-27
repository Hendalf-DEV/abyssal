const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionsBitField } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('createrolemessage')
        .setDescription('Создает сообщение с кнопками для добавления ролей.'),
        category: 'user',
    async execute(interaction) {
        if (interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {

        // Создаем кнопки и строку действий
        const roleButton1 = new ButtonBuilder()
            .setCustomId('role1')
            .setLabel('Мужчина ♂️')
            .setStyle('Secondary');
        const roleButton3 = new ButtonBuilder()
            .setCustomId('role3')
            .setLabel('Девушка ♀️')
            .setStyle('Secondary');
        const roleButton2 = new ButtonBuilder()
            .setCustomId('role2')
            .setLabel('Не хочу говорить')
            .setStyle('Secondary');
        const actionRow = new ActionRowBuilder()
            .addComponents(roleButton1, roleButton2, roleButton3);
        
            const UserBuild = new EmbedBuilder()
			.setColor(0x0c0c0d)
            .setTitle(`Каков ваш гендер?`)
            .setDescription(`Выберите ваш гендер кнопками ниже`)
            .setFooter({ text: `Abyss`, iconURL: interaction.guild.iconURL({ dynamic: true })})
        // Отправляем сообщение с кнопками
        try {
            await interaction.deferReply();
            await interaction.deleteReply();
            await interaction.channel.send({
                embeds: [UserBuild],
            components: [actionRow]
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Ошибка отправки сообщения', ephemeral: true });
        }
    } else {
        return await interaction.reply('У вас нету прав')
    }},
};
