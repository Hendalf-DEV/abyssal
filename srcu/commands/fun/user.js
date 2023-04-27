const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Получить информацию про пользователя или себя')
		.addUserOption(option =>
            option.setName('user')
            .setDescription('Укажите пользователя которому Вы хотите выдать мут')),
	async execute(interaction) {
		if (interaction.options.getUser('user') !== null) {
			const user = interaction.options.getMember('user')
			const avatar = interaction.options.getUser('user').avatarURL({ dynamic: true })
			const statusTranslations = {
				online: ':green_circle: Онлайн',
				idle: ':orange_circle: Нет на месте',
				dnd: ':no_entry: Не беспокоить',
				offline: ':red_circle: Оффлайн',
			};
		const UserBuild = new EmbedBuilder()
			.setColor(0x0099FF)
            .setTitle(`Информация об ${interaction.options.getMember('user').displayName}`)
            .addFields(
				{ name: 'Имя', value: `${interaction.options.getUser('user').tag}` },
				{ name: 'Статус', value: statusTranslations[user.presence.status] },
			)
			.setThumbnail(avatar)
            .setFooter({ text: `Запросил ${interaction.user.tag}`, iconURL: interaction.guild.iconURL({ dynamic: true })})
			await interaction.reply({ embeds: [UserBuild] })
		} else {
			const member = interaction.member;
			const avatar = interaction.user.avatarURL({ dynamic: true })
			const statusTranslations = {
				online: ':green_circle: Онлайн',
				idle: ':orange_circle: Нет на месте',
				dnd: ':no_entry: Не беспокоить',
				offline: ':red_circle: Оффлайн',
			};
			const roles = member.roles.cache.map(role => role.toString()).join(', ');
			const UserBuild = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`Информация об ${interaction.member.displayName}`)
            .addFields(
				{ name: 'Имя', value: `${interaction.user.tag}` },
				{ name: 'Статус', value: statusTranslations[member.presence.status] },
				{ name: 'Роли', value: `${roles}` },
			)
			.setThumbnail(avatar)
            .setFooter({ text: `Запросил ${interaction.user.tag}`, iconURL: interaction.guild.iconURL({ dynamic: true })})
			await interaction.reply({ embeds: [UserBuild] })
		}
	}
};