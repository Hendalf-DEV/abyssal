"use strict";

var _require = require('@discordjs/builders'),
    SlashCommandBuilder = _require.SlashCommandBuilder;

var db = require('../../database.js');

var _require2 = require('./marry.js'),
    proposals = _require2.proposals;

module.exports = {
  data: new SlashCommandBuilder().setName('accept').setDescription('Принять предложение о браке'),
  execute: function execute(interaction) {
    var proposal;
    return regeneratorRuntime.async(function execute$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            proposal = proposals.get(interaction.user.id);

            if (proposal) {
              _context2.next = 5;
              break;
            }

            _context2.next = 4;
            return regeneratorRuntime.awrap(interaction.reply('У вас нет предложений о браке.'));

          case 4:
            return _context2.abrupt("return", _context2.sent);

          case 5:
            db.run("INSERT INTO married (userId1, userId2) VALUES (?, ?)", [proposal.proposer, proposal.proposed], function _callee(error) {
              return regeneratorRuntime.async(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      if (!error) {
                        _context.next = 4;
                        break;
                      }

                      _context.next = 3;
                      return regeneratorRuntime.awrap(interaction.reply('Не удалось принять предложение о браке. Попробуйте снова позже.'));

                    case 3:
                      return _context.abrupt("return", _context.sent);

                    case 4:
                      // Удаляем предложение о браке из коллекции proposals
                      proposals["delete"](interaction.user.id);
                      _context.next = 7;
                      return regeneratorRuntime.awrap(interaction.reply("\u0412\u044B \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043F\u0440\u0438\u043D\u044F\u043B\u0438 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u043E \u0431\u0440\u0430\u043A\u0435 \u043E\u0442 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F <@".concat(proposal.proposer, ">.")));

                    case 7:
                    case "end":
                      return _context.stop();
                  }
                }
              });
            });

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    });
  }
};