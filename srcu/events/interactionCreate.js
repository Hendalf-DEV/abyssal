const { Events } = require('discord.js');
const { proposals } = require('../commands/fun/marry');
const db = require('../database.js');


module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        const allowedChannels = ['1095711543049605291'];
        const allowedUsers = ['647491820644990987', '895636251221323776'];
        if (!allowedUsers.includes(interaction.user.id) && !allowedChannels.includes(interaction.channel.id)) {
            return;
        }
        
        // Обработка команд
        if (interaction.isCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
        
            // If the command is not allowed, return
            if (!command) {
                return;
            }
        
            try {
                await command.execute(interaction);
            } catch (error) {
                if (error) console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
        

        async function setBackground(interaction, background, backgroundURL) {
            return new Promise((resolve, reject) => {
                db.run('INSERT OR REPLACE INTO backgrounds (userId, background, backgroundURL) VALUES (?, ?, ?)', [interaction.user.id, background, backgroundURL], error => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            });
        }

        if (!interaction.isButton()) return;

        const { customId } = interaction;

        // Обработка кнопок для добавления ролей
        const role1 = `1095710247886266398`;
        const role3 = `1096205854522486846`;
        const role2 = `1098724531964751943`;

        switch (customId) {
            case 'role1':
                if (interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(role2)) {
                    await interaction.guild.members.cache.get(interaction.user.id).roles.remove(role2);
                } else if (interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(role3)) {
                    await interaction.guild.members.cache.get(interaction.user.id).roles.remove(role3);
                }
                if (!interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(role1)) {
                    await interaction.guild.members.cache.get(interaction.user.id).roles.add(role1);
                    await interaction.reply({ content: 'Вы получили роль мужчина!', ephemeral: true });
                } else {
                    await interaction.reply({ content: `У вас уже имеется данная роль!`, ephemeral: true})
                }
                break;
            case 'role2':
                if (interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(role3)) {
                    await interaction.guild.members.cache.get(interaction.user.id).roles.remove(role3);
                } else if (interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(role1)) {
                    await interaction.guild.members.cache.get(interaction.user.id).roles.remove(role1);
                }
                if (!interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(role2)) {
                    await interaction.guild.members.cache.get(interaction.user.id).roles.add(role2);
                    await interaction.reply({ content: 'Вы получили роль ⚪!', ephemeral: true });
                } else {
                    await interaction.reply({ content: `У вас уже имеется данная роль!`, ephemeral: true})
                }
                break;
            case 'role3':
                if (interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(role2)) {
                    await interaction.guild.members.cache.get(interaction.user.id).roles.remove(role2);
                } else if (interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(role1)) {
                    await interaction.guild.members.cache.get(interaction.user.id).roles.remove(role1);
                }
                if (!interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(role3)) {
                    await interaction.guild.members.cache.get(interaction.user.id).roles.add(role3);
                    await interaction.reply({ content: 'Вы получили роль девушка!', ephemeral: true });
                } else {
                    await interaction.reply({ content: `У вас уже имеется данная роль!`, ephemeral: true})
                }
                break;
        }

        // Обработка кнопок для предложения брака
        if (customId === 'accept' || customId === 'decline') {
            const proposal = proposals.get(interaction.user.id);

            if (!proposal) {
                return await interaction.reply({ content: 'Вам не приходило предложения руки и сердца.', ephemeral: true });
            }

            if (customId === 'accept') {
                db.run(`INSERT INTO married (userId1, userId2) VALUES (?, ?)`, [proposal.proposer, proposal.proposed], async (error) => {
                    if (error) {
                        console.error(error);
                        return await interaction.reply({ content: 'Произошла ошибка при добавлении брака в базу данных.', ephemeral: true });
                    }

                    proposals.delete(interaction.user.id);
                    await interaction.reply({ content: `Поздравляем! <@${interaction.user.id}> и <@${proposal.proposer}> теперь состоят в браке!`, ephemeral: false });
                });
            } else if (customId === 'decline') {
                proposals.delete(interaction.user.id);
                await interaction.reply({ content: `<@${interaction.user.id}> отклонил(а) предложение <@${proposal.proposer}>.`, ephemeral: false });
            }
        }

        

        const backgrounds = [
            {
                customId: 'default_background',
                background: 'Abyssal',
                url: 'https://i.imgur.com/H5yzOvq.png',
            },
            {
                customId: 'bg_purpur',
                background: 'Лесной фон',
                url: 'https://i.imgur.com/1uBAEV5.jpeg',
            },
            {
                customId: 'bg_void',
                background: 'Пустота',
                url: 'https://i.imgur.com/tmw1pO8.jpg',
            }
        ];
        
        const background = backgrounds.find(bg => bg.customId === customId);
        
        if (background) {
            try {
                await setBackground(interaction, background.background, background.url);
                await interaction.reply({ content: `Фон профиля изменен на: ${background.background}`, ephemeral: true });
        
                // Устанавливаем таймаут на 2 минуты (120000 миллисекунд)
        
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Произошла ошибка при сохранении настроек фона.', ephemeral: true });
            }
            return;
        }
        
    },
};
