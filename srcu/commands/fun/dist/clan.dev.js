"use strict";

var _require = require('@discordjs/builders'),
    SlashCommandBuilder = _require.SlashCommandBuilder;

var _require2 = require('discord.js'),
    ActionRowBuilder = _require2.ActionRowBuilder,
    ButtonBuilder = _require2.ButtonBuilder,
    EmbedBuilder = _require2.EmbedBuilder;

var db = require('../../database');

var _require3 = require('../../events/interactionCreate'),
    clanInvitations = _require3.clanInvitations;

module.exports = {
  data: new SlashCommandBuilder().setName('clan').setDescription('Команды клана').addSubcommand(function (subcommand) {
    return subcommand.setName('create').setDescription('Создать клан').addStringOption(function (option) {
      return option.setName('name').setDescription('Название клана').setRequired(true);
    });
  }).addSubcommand(function (subcommand) {
    return subcommand.setName('settings').setDescription('Настройки клана');
  }).addSubcommand(function (subcommand) {
    return subcommand.setName('invite').setDescription('Пригласить пользователя').addUserOption(function (option) {
      return option.setName('user').setDescription('Пользователь для приглашения').setRequired(true);
    });
  }),
  execute: function execute(interaction) {
    var subcommand, name, leaderId, settingsEmbed, row, userToInvite, intusr, clanId, inviteEmbed, _row;

    return regeneratorRuntime.async(function execute$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            subcommand = interaction.options.getSubcommand();
            _context.t0 = subcommand;
            _context.next = _context.t0 === 'create' ? 4 : _context.t0 === 'settings' ? 8 : _context.t0 === 'invite' ? 13 : 26;
            break;

          case 4:
            name = interaction.options.getString('name');
            leaderId = interaction.user.id;
            db.run('INSERT INTO clans (name, leaderId, treasury) VALUES (?, ?, 0)', [name, leaderId], function (error) {
              if (error) {
                console.error(error);
                return interaction.reply({
                  content: 'Произошла ошибка при создании клана.',
                  ephemeral: true
                });
              }

              var clanId = this.lastID;
              db.run('INSERT INTO clan_members (userId, clanId, rank) VALUES (?, ?, "Лидер")', [leaderId, clanId], function (error) {
                if (error) {
                  console.error(error);
                  return interaction.reply({
                    content: 'Произошла ошибка при добавлении лидера клана.',
                    ephemeral: true
                  });
                }

                interaction.reply("\u041A\u043B\u0430\u043D \"".concat(name, "\" \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0441\u043E\u0437\u0434\u0430\u043D!"));
              });
            });
            return _context.abrupt("break", 26);

          case 8:
            // Настройки клана
            settingsEmbed = new EmbedBuilder().setColor('#0099ff').setTitle('Настройки клана').setDescription('Выберите параметр для изменения:').setTimestamp();
            row = new ActionRowBuilder().setComponents(new ButtonBuilder().setCustomId('clan_change_name').setLabel('Изменить название').setStyle('Primary'), new ButtonBuilder().setCustomId('clan_template').setLabel('Шаблон').setStyle('Secondary'));
            _context.next = 12;
            return regeneratorRuntime.awrap(interaction.reply({
              embeds: [settingsEmbed],
              components: [row]
            }));

          case 12:
            return _context.abrupt("break", 26);

          case 13:
            // Приглашение пользователя
            userToInvite = interaction.options.getUser('user');
            intusr = interaction.user.id;
            clanId = getClandID(intusr);

            if (!userToInvite.bot) {
              _context.next = 18;
              break;
            }

            return _context.abrupt("return", interaction.reply({
              content: 'Вы не можете пригласить бота в клан.',
              ephemeral: true
            }));

          case 18:
            clanInvitations.set(userToInvite.id, clanId);
            inviteEmbed = new EmbedBuilder().setColor('#0099ff').setTitle('Приглашение в клан').setDescription("".concat(interaction.user.username, " \u043F\u0440\u0438\u0433\u043B\u0430\u0448\u0430\u0435\u0442 \u0432\u0430\u0441 \u043F\u0440\u0438\u0441\u043E\u0435\u0434\u0438\u043D\u0438\u0442\u044C\u0441\u044F \u043A \u043A\u043B\u0430\u043D\u0443!")).setTimestamp();
            _row = new ActionRowBuilder().setComponents(new ButtonBuilder().setCustomId('clan_invite_accept').setLabel('Принять').setStyle('Success'), new ButtonBuilder().setCustomId('clan_invite_decline').setLabel('Отклонить').setStyle('Danger'));
            _context.next = 23;
            return regeneratorRuntime.awrap(userToInvite.send({
              embeds: [inviteEmbed],
              components: [_row]
            }));

          case 23:
            _context.next = 25;
            return regeneratorRuntime.awrap(interaction.reply({
              content: "\u041F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0435 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043E \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044E ".concat(userToInvite.username, "."),
              ephemeral: true
            }));

          case 25:
            return _context.abrupt("break", 26);

          case 26:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  clanId: getClandID
};

function getClandID(userId) {
  return regeneratorRuntime.async(function getClandID$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return", new Promise(function (resolve, reject) {
            db.get('SELECT clanId FROM clan_members WHERE userId = ?', [userId], function (error, row) {
              if (error) {
                reject(error);
              } else {
                resolve(row ? row.clanId : null);
              }
            });
          }));

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
}