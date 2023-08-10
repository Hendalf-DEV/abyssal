"use strict";

var _require = require('@discordjs/builders'),
    SlashCommandBuilder = _require.SlashCommandBuilder;

var db = require('../../database.js');

module.exports = {
  data: new SlashCommandBuilder().setName('unmarry').setDescription('Развод'),
  execute: function execute(interaction) {
    return regeneratorRuntime.async(function execute$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            db.get("SELECT * FROM married WHERE userId1=? OR userId2=?", [interaction.user.id, interaction.user.id], function _callee2(error, row) {
              return regeneratorRuntime.async(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      if (row) {
                        _context2.next = 4;
                        break;
                      }

                      _context2.next = 3;
                      return regeneratorRuntime.awrap(interaction.reply('Вы не состоите в браке.'));

                    case 3:
                      return _context2.abrupt("return", _context2.sent);

                    case 4:
                      db.run("DELETE FROM married WHERE userId1=? OR userId2=?", [interaction.user.id, interaction.user.id], function _callee(error) {
                        return regeneratorRuntime.async(function _callee$(_context) {
                          while (1) {
                            switch (_context.prev = _context.next) {
                              case 0:
                                if (!error) {
                                  _context.next = 4;
                                  break;
                                }

                                _context.next = 3;
                                return regeneratorRuntime.awrap(interaction.reply('Не удалось развестись. Попробуйте снова позже.'));

                              case 3:
                                return _context.abrupt("return", _context.sent);

                              case 4:
                                _context.next = 6;
                                return regeneratorRuntime.awrap(interaction.reply('Вы успешно развелись.'));

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

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    });
  }
};