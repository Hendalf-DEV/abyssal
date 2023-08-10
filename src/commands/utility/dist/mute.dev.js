"use strict";

var _require = require('discord.js'),
    SlashCommandBuilder = _require.SlashCommandBuilder,
    EmbedBuilder = _require.EmbedBuilder,
    PermissionsBitField = _require.PermissionsBitField;

module.exports = {
  data: new SlashCommandBuilder().setName('mute').setDescription('Выдает мут на определённое время').addUserOption(function (option) {
    return option.setName('user').setDescription('Укажите пользователя которому Вы хотите выдать мут').setRequired(true);
  }).addNumberOption(function (option) {
    return option.setName('time').setDescription('Время на которое Вы хотите выдать мут (В минутах)').setRequired(true);
  }),
  execute: function execute(interaction) {
    var MuteBuild, loh;
    return regeneratorRuntime.async(function execute$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
              _context.next = 8;
              break;
            }

            MuteBuild = new EmbedBuilder().setColor('#cc0e00').setTitle("\u0412\u044B\u0434\u0430\u043D \u043C\u0443\u0442 ".concat(interaction.options.getUser('user').tag)).setDescription("\u0414\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u043C\u0443\u0442\u0430: ".concat(interaction.options.getNumber('time'), " \u043C\u0438\u043D\u0443\u0442")).setFooter({
              text: "\u0410\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440 ".concat(interaction.user.tag),
              iconURL: interaction.guild.iconURL({
                dynamic: true
              })
            });
            _context.next = 4;
            return regeneratorRuntime.awrap(interaction.reply({
              embeds: [MuteBuild]
            }));

          case 4:
            loh = interaction.options.getMember('user');
            loh.timeout(interaction.options.getNumber('time') * 60000);
            _context.next = 11;
            break;

          case 8:
            _context.next = 10;
            return regeneratorRuntime.awrap(interaction.reply('У вас нету прав'));

          case 10:
            return _context.abrupt("return", _context.sent);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    });
  }
};