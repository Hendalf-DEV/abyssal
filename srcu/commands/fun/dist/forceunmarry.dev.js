"use strict";

var _require = require('discord.js'),
    SlashCommandBuilder = _require.SlashCommandBuilder,
    PermissionsBitField = _require.PermissionsBitField;

var db = require('../../database.js');

module.exports = {
  data: new SlashCommandBuilder().setName('forceunmarry').setDescription('Вынужденный брак').addUserOption(function (option) {
    return option.setName('user').setDescription('Первый пользователь в браке').setRequired(true);
  }),
  execute: function execute(interaction) {
    return regeneratorRuntime.async(function execute$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
              _context3.next = 4;
              break;
            }

            db.get("SELECT * FROM married WHERE userId1=? OR userId2=?", [interaction.options.getUser('user').id, interaction.options.getUser('user').id], function _callee2(error, row) {
              return regeneratorRuntime.async(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      if (row) {
                        _context2.next = 4;
                        break;
                      }

                      _context2.next = 3;
                      return regeneratorRuntime.awrap(interaction.reply('Пользователь не состоит в браке.'));

                    case 3:
                      return _context2.abrupt("return", _context2.sent);

                    case 4:
                      db.run("DELETE FROM married WHERE userId1=? OR userId2=?", [interaction.options.getUser('user').id, interaction.options.getUser('user').id], function _callee(error) {
                        return regeneratorRuntime.async(function _callee$(_context) {
                          while (1) {
                            switch (_context.prev = _context.next) {
                              case 0:
                                if (!error) {
                                  _context.next = 4;
                                  break;
                                }

                                _context.next = 3;
                                return regeneratorRuntime.awrap(interaction.reply('Не удалось развести. Попробуйте снова позже.'));

                              case 3:
                                return _context.abrupt("return", _context.sent);

                              case 4:
                                _context.next = 6;
                                return regeneratorRuntime.awrap(interaction.reply('Вы успешно развели парочку.'));

                              case 6:
                              case "end":
                                return _context.stop();
                            }
                          }
                        });
                      });

                    case 5:
                    case "end":
                      return _context2.stop();
                  }
                }
              });
            });
            _context3.next = 7;
            break;

          case 4:
            _context3.next = 6;
            return regeneratorRuntime.awrap(interaction.reply('У вас нету прав'));

          case 6:
            return _context3.abrupt("return", _context3.sent);

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    });
  }
};