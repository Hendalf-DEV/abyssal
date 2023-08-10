const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('@discordjs/builders');
const db = require('../../database.js');

const invitations = new Map();


async function userClan(userId) {
    return new Promise((resolve, reject) => {
        db.get('SELECT user_id FROM clan_members WHERE user_id = ?', [userId], (error, row) => {
          if (error) {
            reject(error);
          } else {
            resolve(row ? row : null);
          }
        });
    });
  }

  async function checker(userId) {
    if (await userClan(userId) == userId) {
        return false
    } else {
        return true
    }
}

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
        db.run('UPDATE users SET balance = ? WHERE userId = ?', [newBalance, userId], (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

async function updateClanTreasury(clanId, newBalance) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE clans SET treasury = ? WHERE id = ?', [newBalance, clanId], (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

async function userHasClan(userId) {
    return new Promise((resolve, reject) => {
        db.get('SELECT leaderId FROM clans WHERE leaderId = ?', [userId], (error, row) => {
            if (error) {
                reject(error);
            } else {
                resolve(row);
            }
        });
    });
}

async function userChecker(userId) {
    const row = await userHasClan(userId);
    if (row) {
        return false;
    } else {
        return true;
    }
}

async function getUserClan(userId) {
    return new Promise((resolve, reject) => {
        db.get(`
            SELECT c.id as clan_id, c.clanName, c.leaderId, c.treasury
            FROM clan_members cm
            JOIN clans c ON cm.clan_id = c.id
            WHERE cm.user_id = ?`,
            [userId],
            (err, row) => {
                if (err) {
                    console.error(err.message);
                    reject('Произошла ошибка при получении информации о клане пользователя.');
                }

                if (row) {
                    resolve({
                        clan_id: row.clan_id,
                        clanName: row.clanName,
                        leaderId: row.leaderId,
                        treasury: row.treasury
                    });
                } else {
                    resolve(null);
                }
            }
        );
    });
}

async function hasPermission(userId, permission) {
    return new Promise((resolve, reject) => {
        db.get(`
            SELECT cr.permissions_bitmask
            FROM clan_members cm
            JOIN clan_ranks cr ON cm.rank = cr.rank_name
            WHERE cm.user_id = ?`,
            [userId],
            (err, row) => {
                if (err) {
                    console.error(err.message);
                    reject('Произошла ошибка при получении разрешений пользователя.');
                }

                if (row) {
                    const permissionsBitmask = row.permissions_bitmask;
                    let permissionBit;

                    switch (permission) {
                        case 'canInvite':
                            permissionBit = 1 << 0;
                            break;
                        case 'canEdit':
                            permissionBit = 1 << 1;
                            break;
                        case 'bypass':
                            permissionBit = 1 << 3;
                            break;
                        default:
                            reject('Неизвестное разрешение.');
                            return;
                    }

                    resolve((permissionsBitmask & permissionBit) !== 0);
                } else {
                    resolve(false);
                }
            }
        );
    });
}


function permissionsToBitmask(canInvite, canEdit, bypass) {
    let bitmask = 0;

    if (canInvite) bitmask |= 1 << 0;
    if (canEdit) bitmask |= 1 << 1;
    if (bypass) bitmask |= 1 << 3;

    return bitmask;
}




module.exports = {
    data: new SlashCommandBuilder()
        .setName('clan')
        .setDescription('Команды для работы с кланами')
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Создать новый клан')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('Название клана')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('Информация о клане пользователя')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('Пользователь для получения информации о клане')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Добавить пользователя в клан')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('Пользователь для добавления в клан')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('treasure')
                .setDescription('Управление казной клана')
                .addStringOption(option =>
                    option.setName('action')
                        .setDescription('Выберите действие: take (забрать) или insert (внести)')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('amount')
                        .setDescription('Количество денег для забирания или внесения')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('rank_create')
                .setDescription('Создать новый ранг')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('Название ранга')
                        .setRequired(true))
                .addBooleanOption(option =>
                    option.setName('can_invite')
                        .setDescription('Разрешить приглашать пользователей')
                        .setRequired(true))
                .addBooleanOption(option =>
                    option.setName('can_edit')
                        .setDescription('Разрешение на изменение настроек клана')
                        .setRequired(true))
                .addBooleanOption(option =>
                    option.setName('can_bypass')
                        .setDescription('Обход разршений')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('rank_delete')
                .setDescription('Удалить ранг')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('Название ранга')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('rank_list')
                .setDescription('Просмотр списка рангов'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('rank_set')
                .setDescription('Назначить ранг пользователю')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('Пользователь для назначения ранга')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('rank_name')
                        .setDescription('Название ранга')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('rank')
                .setDescription('Изменить разрешения ранга')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('Название ранга')
                        .setRequired(true))
                .addBooleanOption(option =>
                    option.setName('can_invite')
                        .setDescription('Разрешить приглашать пользователей')
                        .setRequired(true))
                .addBooleanOption(option =>
                    option.setName('can_edit')
                        .setDescription('Разрешение на изменение настроек клана')
                        .setRequired(true))
                .addBooleanOption(option =>
                    option.setName('can_bypass')
                        .setDescription('Обход разршений')
                        .setRequired(true))),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'create') {
            const clanName = interaction.options.getString('name');
            const userId = interaction.user.id;
            console.log(await userChecker(userId))
            if (await userChecker(userId) == false) {
                return interaction.reply(`У вас уже имеется клан.`);
            }            
            const balance = await getUserBalance(userId)
            const requiredAmnt = 1000
            if ( balance < requiredAmnt ) {
                return interaction.reply(`У вас недостаточно средст для основания клана (Требуется ${requiredAmnt - balance} душ)`)
            } else {
                const claim = balance - 1000
                await updateUserBalance(userId, claim)

                db.get(`SELECT * FROM clans WHERE clanName = ?`, [clanName], (err, row) => {
                    if (err) {
                        console.error(err.message);
                        return interaction.reply('Произошла ошибка при создании клана. Пожалуйста, попробуйте еще раз.');
                    }

                    if (row) {
                        return interaction.reply(`Клан с названием "${clanName}" уже существует.`);
                    }
                    
                    db.run(`INSERT INTO clans (clanName, leaderId, treasury) VALUES (?, ?, 0)`, [clanName, userId], function (err) {
                        if (err) {
                            console.error(err.message);
                            return interaction.reply('Произошла ошибка при создании клана. Пожалуйста, попробуйте еще раз.');
                        }

                        const clanId = this.lastID;
                        const leaderBitmask = permissionsToBitmask(true, true, true, true);
                        db.run(`INSERT INTO clan_ranks (clan_id, rank_name, permissions_bitmask, rank_order) VALUES (?, ?, ?, ?)`, [clanId, 'Лидер', leaderBitmask, 1], function (err) {
                            if (err) {
                                console.error(err.message);
                                return interaction.reply('Произошла ошибка при создании ранга "Лидер". Пожалуйста, попробуйте еще раз.');
                            }
                        
                            db.run(`INSERT INTO clan_members (clan_id, user_id, rank) VALUES (?, ?, 'Лидер')`, [clanId, userId], function (err) {
                                if (err) {
                                    console.error(err.message);
                                    return interaction.reply('Произошла ошибка при добавлении лидера клана в таблицу clan_members. Пожалуйста, попробуйте еще раз.');
                                }
                        
                                interaction.reply(`Клан "${clanName}" успешно создан!`);
                            });
                        });
                    });
                });
            }
        } else if (subcommand === 'info') {
            const user = interaction.options.getUser('user');
            const userId = user.id;
        
            db.get(`
                SELECT cm.rank, c.clanName, c.leaderId, c.treasury
                FROM clan_members cm
                JOIN clans c ON cm.clan_id = c.id
                WHERE cm.user_id = ?`,
                [userId],
                (err, row) => {
                    if (err) {
                        console.error(err.message);
                        return interaction.reply('Произошла ошибка при получении информации о клане пользователя. Пожалуйста, попробуйте еще раз.');
                    }
        
                    if (!row) {
                        return interaction.reply(`Пользователь ${user.username} не состоит в клане.`);
                    }
        
                    interaction.reply(`Информация о пользователе и его клане:\nИмя: ${user.username}\nРанг: ${row.rank}\n\nКлан:\nНазвание: ${row.clanName}\nЛидер: <@${row.leaderId}>\nКазна клана: ${row.treasury}`);
                });
            } else if (subcommand === 'add') {
                const userToInvite = interaction.options.getUser('user');
                const inviterId = interaction.user.id;
            
                db.get(`SELECT cm.clan_id FROM clan_members cm WHERE cm.user_id = ?`, [inviterId], async (err, row) => {
                    if (err) {
                        console.error(err.message);
                        return interaction.reply('Произошла ошибка при проверке вашего клана. Пожалуйста, попробуйте еще раз.');
                    }
            
                    if (!row) {
                        return interaction.reply('Вы не состоите в клане, чтобы приглашать других пользователей.');
                    }
                    
                    const isIt = await checker(userToInvite.id)
                    console.log(isIt)
                    if (isIt == true) {
                        await interaction.reply(`${userToInvite.username} уже в другом клане.`)
                        return;
                    }

            
                    const clanId = row.clan_id;

                    const rowButtons = new ActionRowBuilder()
                        .setComponents(
                            new ButtonBuilder()
                                .setCustomId('clanAccept')
                                .setLabel('Принять')
                                .setStyle('Success'),
                            new ButtonBuilder()
                                .setCustomId('clanDecline')
                                .setLabel('Отказаться')
                                .setStyle('Danger')
                        );
            
                    await userToInvite.send({
                        content: `<@${userToInvite.id}>, <@${inviterId}> приглашает вас в свой клан. Вы хотите принять приглашение?`,
                        components: [rowButtons]
                    });
            
                    invitations.set(userToInvite.id, { inviter: inviterId, clan_id: clanId });
                    interaction.reply('Приглашение отправлено.');
                });
            } else if (subcommand === 'rank_create') {
                const rankName = interaction.options.getString('name');
                const canInvite = interaction.options.getBoolean('can_invite');
                const canEdit = interaction.options.getBoolean('can_edit');
                const bypass = interaction.options.getBoolean('can_bypass');
                const permissionsBitmask = permissionsToBitmask(canInvite, canEdit, bypass);
                const userId = interaction.user.id;

                
                db.get(`
                    SELECT c.id as clanId
                    FROM clans c
                    JOIN clan_members cm ON c.id = cm.clan_id
                    WHERE cm.user_id = ? AND cm.rank = 'Лидер'
                `, [userId], (err, row) => {
                    if (err) {
                        console.error(err.message);
                        return interaction.reply('Произошла ошибка при создании ранга. Пожалуйста, попробуйте еще раз.');
                    }
            
                    if (!row) {
                        return interaction.reply('Вы должны быть лидером клана, чтобы создать новый ранг.');
                    }
            
                    const clanId = row.clanId;
            
                    db.get(`SELECT MAX(rank_order) AS max_rank_order FROM clan_ranks WHERE clan_id = ?`, [clanId], (err, row) => {
                        if (err) {
                            console.error(err.message);
                            return interaction.reply('Произошла ошибка при создании ранга. Пожалуйста, попробуйте еще раз.');
                        }
            
                        const maxRankOrder = row.max_rank_order || 0;
                        const newRankOrder = maxRankOrder + 1;
            
                        db.get(`SELECT * FROM clan_ranks WHERE clan_id = ? AND rank_name = ?`, [clanId, rankName], (err, row) => {
                            if (err) {
                                console.error(err.message);
                                return interaction.reply('Произошла ошибка при создании ранга. Пожалуйста, попробуйте еще раз.');
                            }
            
                            if (row) {
                                return interaction.reply(`Ранг с названием "${rankName}" уже существует.`);
                            }
            
                            db.run(`INSERT INTO clan_ranks (clan_id, rank_name, permissions_bitmask, rank_order) VALUES (?, ?, ?, ?)`, [clanId, rankName, permissionsBitmask, newRankOrder], function (err) {
                                if (err) {
                                    console.error(err.message);
                                    return interaction.reply('Произошла ошибка при создании ранга. Пожалуйста, попробуйте еще раз.');
                                }
            
                                interaction.reply(`Ранг "${rankName}" успешно создан!`);
                            });
                        });
                    });
                });
            } else if (subcommand === 'treasure') {
                const action = interaction.options.getString('action');
                const amount = interaction.options.getInteger('amount');
                const userId = interaction.user.id;
            
                const userClan = await getUserClan(userId);
                const hasEditPermission = await hasPermission(userId, 'canEdit');
                if (!hasEditPermission) {
                    return interaction.reply('У вас нет прав.');
                }
            
                if (action === 'take') {
                    if (userClan.treasury < amount) {
                        return interaction.reply('В казне клана недостаточно средств.');
                    }
            
                    await updateClanTreasury(userClan.clan_id, userClan.treasury - amount);
                    await updateUserBalance(userId, await getUserBalance(userId) + amount);
            
                    interaction.reply(`Вы успешно забрали ${amount} денег из казны клана.`);
                } else if (action === 'insert') {

                    const userBalance = await getUserBalance(userId);
                    if (userBalance < amount) {
                        return interaction.reply('У вас недостаточно средств для внесения в казну клана.');
                    }
            
                    await updateUserBalance(userId, userBalance - amount);
                    await updateClanTreasury(userClan.clan_id, userClan.treasury + amount);
            
                    interaction.reply(`Вы успешно внесли ${amount} денег в казну клана.`);
                } else {
                    interaction.reply('Неверное действие. Выберите "take" (забрать) или "insert" (внести).');
                }
            } else if (subcommand === 'rank_delete') {
                const rankName = interaction.options.getString('name');
                const userId = interaction.user.id;
            
                db.get(`
                    SELECT c.id as clanId
                    FROM clans c
                    JOIN clan_members cm ON c.id = cm.clan_id
                    WHERE cm.user_id = ? AND cm.rank = 'Лидер'
                `, [userId], (err, row) => {
                    if (err) {
                        console.error(err.message);
                        return interaction.reply('Произошла ошибка при удалении ранга. Пожалуйста, попробуйте еще раз.');
                    }
            
                    if (!row) {
                        return interaction.reply('Вы должны быть лидером клана, чтобы удалить ранг.');
                    }
            
                    const clanId = row.clanId;
            
                    db.get(`SELECT * FROM clan_ranks WHERE clan_id = ? AND rank_name = ?`, [clanId, rankName], (err, row) => {
                        if (err) {
                            console.error(err.message);
                            return interaction.reply('Произошла ошибка при удалении ранга. Пожалуйста, попробуйте еще раз.');
                        }
            
                        if (!row) {
                            return interaction.reply(`Ранг с названием "${rankName}" не существует.`);
                        }
            
                        db.run(`DELETE FROM clan_ranks WHERE clan_id = ? AND rank_name = ?`, [clanId, rankName], function (err) {
                            if (err) {
                                console.error(err.message);
                                return interaction.reply('Произошла ошибка при удалении ранга. Пожалуйста, попробуйте еще раз.');
                            }
            
                            interaction.reply(`Ранг "${rankName}" успешно удален!`);
                        });
                    });
                });
            } else if (subcommand === 'rank_list') {
                const userId = interaction.user.id;

                db.get(`SELECT clan_id FROM clan_members WHERE user_id = ?`, [userId], (err, row) => {
                    if (err) {
                        console.error(err.message);
                        return interaction.reply('Произошла ошибка при получении информации о клане пользователя. Пожалуйста, попробуйте еще раз.');
                    }
            
                    if (!row) {
                        return interaction.reply('Вы не состоите в клане.');
                    }
            
                    const clanId = row.clan_id;
            
                    db.all(`SELECT * FROM clan_ranks WHERE clan_id = ? ORDER BY id ASC`, [clanId], (err, rows) => {
                        if (err) {
                            console.error(err.message);
                            return interaction.reply('Произошла ошибка при получении списка рангов клана. Пожалуйста, попробуйте еще раз.');
                        }
            
                        if (rows.length === 0) {
                            return interaction.reply('В вашем клане нет рангов.');
                        }
            
                        const rankListEmbed = new EmbedBuilder()
                            .setTitle('Список рангов клана')
                            .setColor(0x0099ff);
            
                        rows.forEach(row => {
                            rankListEmbed.addFields([
                                { name: `${row.rank_name}`, value: `Приглашения: ${row.can_invite ? '✅' : '❌'}` }
                            ]);
                        });
            
                        interaction.reply({ embeds: [rankListEmbed] });
                    });
                });
            } else if (subcommand === 'rank_set') {
                await interaction.deferReply();
          
                const user = interaction.options.getUser('user');
                const rankName = interaction.options.getString('rank_name');
                const userId = interaction.user.id;
          
                db.get(`
                  SELECT c.id as clanId
                  FROM clans c
                  JOIN clan_members cm ON c.id = cm.clan_id
                  WHERE cm.user_id = ? AND cm.rank = 'Лидер'
                `, [userId], async (err, row) => {
                  if (err) {
                    console.error(err.message);
                    return interaction.editReply('Произошла ошибка при назначении ранга. Пожалуйста, попробуйте еще раз.');
                  }
          
                  if (!row) {
                    return interaction.editReply('Вы должны быть лидером клана, чтобы назначать ранги.');
                  }
          
                  const clanId = row.clanId;
          
                  db.get(`
                    SELECT id
                    FROM clan_ranks
                    WHERE clan_id = ? AND rank_name = ?
                  `, [clanId, rankName], async (err, row) => {
                    if (err) {
                      console.error(err.message);
                      return interaction.editReply('Произошла ошибка при назначении ранга. Пожалуйста, попробуйте еще раз.');
                    }
          
                    if (!row) {
                      return interaction.editReply(`Ранг с названием "${rankName}" не найден в вашем клане.`);
                    }
          
                    const rankId = row.id;
          
                    db.run(`
                      UPDATE clan_members
                      SET rank = ?, rank_id = ?
                      WHERE user_id = ? AND clan_id = ?
                    `, [rankName, rankId, user.id, clanId], async function (err) {
                      if (err) {
                        console.error(err.message);
                        return interaction.editReply('Произошла ошибка при назначении ранга. Пожалуйста, попробуйте еще раз.');
                      }
          
                      interaction.editReply(`Ранг "${rankName}" успешно назначен пользователю <@${user.id}>!`);
                    });
                  });
                });
            } else if (subcommand === 'rank') {
                const rankName = interaction.options.getString('name');
                const canInvite = interaction.options.getBoolean('can_invite');
                const canEdit = interaction.options.getBoolean('can_edit');
                const bypass = interaction.options.getBoolean('can_bypass');
                const permissionsBitmask = permissionsToBitmask(canInvite, canEdit, bypass);
                const userId = interaction.user.id;
            
                db.get(`
                    SELECT c.id as clanId
                    FROM clans c
                    JOIN clan_members cm ON c.id = cm.clan_id
                    WHERE cm.user_id = ? AND cm.rank = 'Лидер'
                `, [userId], (err, row) => {
                    if (err) {
                        console.error(err.message);
                        return interaction.reply('Произошла ошибка при создании ранга. Пожалуйста, попробуйте еще раз.');
                    }
            
                    if (!row) {
                        return interaction.reply('Вы должны быть лидером клана, чтобы создать новый ранг.');
                    }
            
                    const clanId = row.clanId;
            
                    db.get(`SELECT * FROM clan_ranks WHERE clan_id = ? AND rank_name = ?`, [clanId, rankName], (err) => {
                        if (err) {
                            console.error(err.message);
                            return interaction.reply('Произошла ошибка при создании ранга. Пожалуйста, попробуйте еще раз.');
                        }

                        db.run(`UPDATE clan_ranks SET permissions_bitmask = ? WHERE clan_id = ? AND rank_name = ?`, [permissionsBitmask, clanId, rankName], function (err) {
                            if (err) {
                                console.error(err.message);
                                return interaction.reply('Произошла ошибка при создании ранга. Пожалуйста, попробуйте еще раз.');
                            }

                            interaction.reply(`Разрешения для ранга ${rankName} успешно изменены!`);
                        });
                    })
                })
        }
    },
    invitations,
};
