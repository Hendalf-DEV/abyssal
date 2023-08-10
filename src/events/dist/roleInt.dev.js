"use strict";

var _require = require('discord.js'),
    Events = _require.Events;

module.exports = {
  name: Events.InteractionCreate,
  execute: function execute(interaction) {
    var buttonId, user, role1, role2;
    return regeneratorRuntime.async(function execute$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (interaction.isButton()) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return");

          case 2:
            // Получаем нажатую кнопку и пользователя
            buttonId = interaction.customId;
            user = interaction.user; // Получаем роли

            role1 = interaction.guild.roles.cache.find(function (role) {
              return role.name === 'Role1';
            });
            role2 = interaction.guild.roles.cache.find(function (role) {
              return role.name === 'Role2';
            }); // Обрабатываем нажатие кнопки

            _context.t0 = buttonId;
            _context.next = _context.t0 === 'role1' ? 9 : _context.t0 === 'role2' ? 14 : 19;
            break;

          case 9:
            _context.next = 11;
            return regeneratorRuntime.awrap(interaction.guild.members.cache.get(user.id).roles.add(role1));

          case 11:
            _context.next = 13;
            return regeneratorRuntime.awrap(interaction.reply({
              content: 'Вы получили роль Role 1!',
              ephemeral: true
            }));

          case 13:
            return _context.abrupt("break", 19);

          case 14:
            _context.next = 16;
            return regeneratorRuntime.awrap(interaction.guild.members.cache.get(user.id).roles.add(role2));

          case 16:
            _context.next = 18;
            return regeneratorRuntime.awrap(interaction.reply({
              content: 'Вы получили роль Role 2!',
              ephemeral: true
            }));

          case 18:
            return _context.abrupt("break", 19);

          case 19:
          case "end":
            return _context.stop();
        }
      }
    });
  }
};