"use strict";

var _require = require('discord.js'),
    SlashCommandBuilder = _require.SlashCommandBuilder,
    PermissionsBitField = _require.PermissionsBitField;

var db = require('../../database.js');

module.exports = {
  data: new SlashCommandBuilder().setName('forcemarry').setDescription('Вынужденный брак').addUserOption(function (option) {
    return option.setName('user1').setDescription('Первый пользователь в браке').setRequired(true);
  }).addUserOption(function (option) {
    return option.setName('user2').setDescription('Второй пользователь в браке').setRequired(true);
  }),
  execute: function execute(interaction) {
    var user1, user2;
    return regeneratorRuntime.async(function execute$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
              _context3.next = 10;
              break;
            }

            user1 = interaction.options.getUser('user1');
            user2 = interaction.options.getUser('user2');

            if (!(user1.id === user2.id)) {
              _context3.next = 7;
              break;
            }

            _context3.next = 6;
            return regeneratorRuntime.awrap(interaction.reply('Пользователи не могут жениться на самих себе.'));

          case 6:
            return _context3.abrupt("return", _context3.sent);

          case 7:
            db.get("SELECT * FROM married WHERE (userId1=? AND userId2=?) OR (userId1=? AND userId2=?)", [user1.id, user2.id, user2.id, user1.id], function _callee2(error, row) {
              return regeneratorRuntime.async(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      if (!row) {
                        _context2.next = 4;
                        break;
                      }

                      _context2.next = 3;
                      return regeneratorRuntime.awrap(interaction.reply('Эти пользователи уже состоят в браке.'));

                    case 3:
                      return _context2.abrupt("return", _context2.sent);

                    case 4:
                      db.run("INSERT INTO married (userId1, userId2) VALUES (?, ?)", [user1.id, user2.id], function _callee(error) {
                        return regeneratorRuntime.async(function _callee$(_context) {
                          while (1) {
                            switch (_context.prev = _context.next) {
                              case 0:
                                if (!error) {
                                  _context.next = 4;
                                  break;
                                }

                                _context.next = 3;
                                return regeneratorRuntime.awrap(interaction.reply('Не удалось вынудить брак. Попробуйте снова позже.'));

                              case 3:
                                return _context.abrupt("return", _context.sent);

                              case 4:
                                _context.next = 6;
                                return regeneratorRuntime.awrap(interaction.reply("\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438 ".concat(user1.username, " \u0438 ").concat(user2.username, " \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043F\u043E\u0436\u0435\u043D\u0438\u043B\u0438\u0441\u044C.")));

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
            _context3.next = 13;
            break;

          case 10:
            _context3.next = 12;
            return regeneratorRuntime.awrap(interaction.reply('У вас нету прав'));

          case 12:
            return _context3.abrupt("return", _context3.sent);

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    });
  }
};