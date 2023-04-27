const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const db = require('../../database.js');

const proposals = new Map();

const proposalTimeout = 5 * 60 * 1000;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('marry')
        .setDescription('Запрос на брак')
        .addUserOption(option => option.setName('user').setDescription('Пользователь, которого вы хотите предложить на брак').setRequired(true)),
        
    async execute(interaction) {
        const user = interaction.options.getUser('user');

        if (user.id === interaction.user.id) {
            return await interaction.reply('Вы не можете жениться на самом себе.');
        }

        db.all(`SELECT * FROM married WHERE userId1=? OR userId1=?`, [interaction.user.id, user.id], async (error, rows) => {
            if (rows && rows.length > 0) {
                return await interaction.reply('Вы или ваш партнер уже состоите в браке с другими людьми.');
            }

            // Создаем кнопки и строку действий
            const acceptButton = new ButtonBuilder()
                .setCustomId('accept')
                .setLabel('Принять')
                .setStyle('Success');

            const declineButton = new ButtonBuilder()
                .setCustomId('decline')
                .setLabel('Отклонить')
                .setStyle('Danger');

            const actionRow = new ActionRowBuilder()
                .setComponents(acceptButton, declineButton);

            // Добавляем предложение о браке в коллекцию proposals
            proposals.set(user.id, { proposer: interaction.user.id, proposed: user.id });

            setTimeout(() => {
                proposals.delete(user.id);
            }, proposalTimeout);

            const UserBuild = new EmbedBuilder()
			.setColor(0x04d1ce)
            .setTitle(`ПРЕДЛОЖЕНИЕ РУКИ И СЕРДЦА!`)
            .setDescription(`Пользователь <@${user.id}>, вы согласны выйти за <@${interaction.user.id}>?`)

            await interaction.reply({
                embeds: [UserBuild],
                components: [actionRow],
                ephemeral: false
            });
        });
    },
    proposals,
};
