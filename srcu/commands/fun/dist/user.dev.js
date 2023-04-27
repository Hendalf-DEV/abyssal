"use strict";

var _require = require('discord.js'),
    SlashCommandBuilder = _require.SlashCommandBuilder,
    EmbedBuilder = _require.EmbedBuilder;

module.exports = {
  data: new SlashCommandBuilder().setName('user').setDescription('Получить информацию про пользователя или себя').addUserOption(function (option) {
    return option.setName('user').setDescription('Укажите пользователя которому Вы хотите выдать мут');
  }),
  execute: function execute(interaction) {
    var user, avatar, statusTranslations, UserBuild, member, _avatar, _statusTranslations, roles, _UserBuild;

    return regeneratorRuntime.async(function execute$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(interaction.options.getUser('user') !== null)) {
              _context.next = 9;
              break;
            }

            user = interaction.options.getMember('user');
            avatar = interaction.options.getUser('user').avatarURL({
              dynamic: true
            });
            statusTranslations = {
              online: ':green_circle: Онлайн',
              idle: ':orange_circle: Нет на месте',
              dnd: ':no_entry: Не беспокоить',
              offline: ':red_circle: Оффлайн'
            };
            UserBuild = new EmbedBuilder().setColor(0x0099FF).setTitle("\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u043E\u0431 ".concat(interaction.options.getMember('user').displayName)).addFields({
              name: 'Имя',
              value: "".concat(interaction.options.getUser('user').tag)
            }, {
              name: 'Статус',
              value: statusTranslations[user.presence.status]
            }).setThumbnail(avatar).setFooter({
              text: "\u0417\u0430\u043F\u0440\u043E\u0441\u0438\u043B ".concat(interaction.user.tag),
              iconURL: interaction.guild.iconURL({
                dynamic: true
              })
            });
            _context.next = 7;
            return regeneratorRuntime.awrap(interaction.reply({
              embeds: [UserBuild]
            }));

          case 7:
            _context.next = 16;
            break;

          case 9:
            member = interaction.member;
            _avatar = interaction.user.avatarURL({
              dynamic: true
            });
            _statusTranslations = {
              online: ':green_circle: Онлайн',
              idle: ':orange_circle: Нет на месте',
              dnd: ':no_entry: Не беспокоить',
              offline: ':red_circle: Оффлайн'
            };
            roles = member.roles.cache.map(function (role) {
              return role.toString();
            }).join(', ');
            _UserBuild = new EmbedBuilder().setColor(0x0099FF).setTitle("\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u043E\u0431 ".concat(interaction.member.displayName)).addFields({
              name: 'Имя',
              value: "".concat(interaction.user.tag)
            }, {
              name: 'Статус',
              value: _statusTranslations[member.presence.status]
            }, {
              name: 'Роли',
              value: "".concat(roles)
            }).setThumbnail(_avatar).setFooter({
              text: "\u0417\u0430\u043F\u0440\u043E\u0441\u0438\u043B ".concat(interaction.user.tag),
              iconURL: interaction.guild.iconURL({
                dynamic: true
              })
            });
            _context.next = 16;
            return regeneratorRuntime.awrap(interaction.reply({
              embeds: [_UserBuild]
            }));

          case 16:
          case "end":
            return _context.stop();
        }
      }
    });
  }
};