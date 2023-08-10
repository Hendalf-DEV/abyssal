const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database');

async function getUserBalance(userId) {
    return new Promise((resolve, reject) => {
        db.get('SELECT balance FROM users WHERE userId = ?', [userId], (error, row) => {
            if (error) {
                reject(error);
            } else {
                resolve(row ? row.balance : 0);
            }
        });
    });
}

async function updateUserBalance(userId, newBalance) {
    return new Promise((resolve, reject) => {
        db.run('INSERT OR REPLACE INTO users (userId, balance) VALUES (?, ?)', [userId, newBalance], (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

async function hasUserBoughtProduct(userId, productId) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM user_products WHERE userId = ? AND productId = ?', [userId, productId], (error, row) => {
            if (error) {
                reject(error);
            } else {
                resolve(!!row);
            }
        });
    });
}

async function addUserProduct(userId, productId) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO user_products (userId, productId) VALUES (?, ?)', [userId, productId], (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}



const currencyName = 'Abyss';
const categories = [
    {
        name: 'roles',
        label: 'Роли',
        fields: [
            { name: 'Роль 1', price: 100, id: '1096542496097583274' },
            { name: 'Роль 2', price: 1000, id: '1096542496097583275' }
        ],
        buttons: [
            { customId: 'buyRole-1096542496097583274', label: 'Купить Роль 1', style: 'Primary' },
            { customId: 'buyRole-1096542496097583275', label: 'Купить Роль 2', style: 'Primary' }
        ]
    },
    {
        name: 'backgrounds',
        label: 'Фоны',
        fields: [
            { name: 'Лесной фон', price: 500, id: 'bg_purpur' },
            { name: 'Пустотный фон', price: 500, id: 'bg_void' }
        ],
        buttons: [
            { customId: 'buyBackground-bg_purpur', label: 'Купить лесной фон', style: 'Primary' },
            { customId: 'buyBackground-bg_void', label: 'Купить пустотный фон', style: 'Primary' }
        ]
    }
    
];

const createBackButton = () => {
    return new ButtonBuilder()
        .setCustomId('backToCategories')
        .setLabel('Назад')
        .setStyle('Secondary');
};

const getCategoryButtons = () => {
    return categories.map(category => {
        return new ButtonBuilder()
            .setCustomId(`category-${category.name}`)
            .setLabel(category.label)
            .setStyle('Secondary');
    });
};

const getCategoryFields = (categoryName) => {
    const category = categories.find(c => c.name === categoryName);
    if (!category) return [];

    return category.fields.map(field => {
        return { name: field.name, value: `Стоимость: ${field.price} койнов` };
    });
};

const getCategoryButtonsByName = (categoryName) => {
    const category = categories.find(c => c.name === categoryName);
    if (!category) return [];

    return [
        ...category.buttons.map(button => {
            return new ButtonBuilder()
                .setCustomId(button.customId)
                .setLabel(button.label)
                .setStyle(button.style);
        }),
        createBackButton(),
    ];
};

const updateEmbedAndButtons = async (interaction, categoryName) => {
    const Shop = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`Магазин`)
        .addFields(getCategoryFields(categoryName))
        .setFooter({ text: `Запросил ${interaction.user.tag}`, iconURL: interaction.guild.iconURL({ dynamic: true }) });

    const row = new ActionRowBuilder()
        .addComponents(getCategoryButtonsByName(categoryName));

    await interaction.update({
        embeds: [Shop],
        components: [row],
        ephemeral: false,
    });
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Открывает магазин ролей'),
        
    async execute(interaction) {

            const Shop = new EmbedBuilder()
			.setColor(0x0099FF)
            .setTitle(`Магазин`)
            .setFooter({ text: `Запросил ${interaction.user.tag}`, iconURL: interaction.guild.iconURL({ dynamic: true })})

            const categoryRow = new ActionRowBuilder()
            .setComponents(getCategoryButtons());
        
            await interaction.reply({
                embeds: [Shop],
                components: [categoryRow],
                ephemeral: false,
            });

        const collector = interaction.channel.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async i => {
            if (!i.isButton()) return;
            if (i.customId.startsWith('category')) {
                const categoryName = i.customId.split('-')[1];
                await updateEmbedAndButtons(i, categoryName);
                return;
            }
            if (i.customId === 'backToCategories') {
                const Shop = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle(`Магазин`)
                    .setFooter({ text: `Запросил ${interaction.user.tag}`, iconURL: interaction.guild.iconURL({ dynamic: true }) });
            
                const categoryRow = new ActionRowBuilder()
                    .setComponents(getCategoryButtons());
            
                await i.update({
                    embeds: [Shop],
                    components: [categoryRow],
                    ephemeral: false,
                });
                return;
            }
        
            if (i.customId.startsWith('buyBackground')) {
                const backgroundId = i.customId.split('-')[1];
                const background = categories
                    .flatMap(category => category.fields)
                    .find(field => field.id === backgroundId);
            
                if (!background) {
                    await i.reply({ content: 'Произошла ошибка, попробуйте еще раз.', ephemeral: true });
                    return;
                }
            
                const userId = i.user.id;
                const userBalance = await getUserBalance(userId);
            
                if (userBalance < background.price) {
                    await i.reply({ content: `У вас недостаточно ${currencyName} для покупки этого фона. Ваш баланс: ${userBalance} ${currencyName}.`, ephemeral: true });
                    return;
                }
            
                const alreadyBought = await hasUserBoughtProduct(userId, background.id);
            
                if (alreadyBought) {
                    await i.reply({ content: `Вы уже приобрели "${background.name}". Вы не можете купить его снова.`, ephemeral: true });
                    return;
                }
            
                await updateUserBalance(userId, userBalance - background.price);
                await addUserProduct(userId, background.id);
                await i.reply({ content: `Вы успешно приобрели фон "${background.name}" за ${background.price} ${currencyName}! Ваш новый баланс: ${userBalance - background.price} ${currencyName}.`, ephemeral: true });
                return;
            }
        
            if (!i.customId.startsWith('buyRole')) return;
        
            const roleId = i.customId.split('-')[1];
            const role = categories
                .flatMap(category => category.fields)
                .find(field => field.id === roleId);
        
            if (!role) {
                await i.reply({ content: 'Произошла ошибка, попробуйте еще раз.', ephemeral: true });
                return;
            }
            
            const userId = i.user.id;
            const userBalance = await getUserBalance(userId);

            if (userBalance < role.price) {
                await i.reply({ content: `У вас недостаточно ${currencyName} для покупки этой роли. Ваш баланс: ${userBalance} ${currencyName}.`, ephemeral: true });
                return;
            }

            const alreadyBought = await hasUserBoughtProduct(userId, role.id);

            if (alreadyBought) {
                await i.reply({ content: `Вы уже приобрели "${role.name}". Вы не можете купить его снова.`, ephemeral: true });
                return;
            }

            await updateUserBalance(userId, userBalance - role.price);
            await i.member.roles.add(role.id);
            await addUserProduct(userId, role.id);
            await i.reply({ content: `Вы успешно приобрели роль "${role.name}" за ${role.price} ${currencyName}! Ваш новый баланс: ${userBalance - role.price} ${currencyName}.`, ephemeral: true });
        });

        collector.on('end', () => {
            console.log('Collector stopped.');
        });
    },
};
