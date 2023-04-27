"use strict";

var _require = require('@discordjs/builders'),
    SlashCommandBuilder = _require.SlashCommandBuilder;

var _require2 = require('./marry.js'),
    proposals = _require2.proposals;

module.exports = {
  data: new SlashCommandBuilder().setName('decline').setDescription('Отклонить предложение о браке'),
  execute: function execute(interaction) {
    var proposal;
    return regeneratorRuntime.async(function execute$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            proposal = proposals.get(interaction.user.id);

            if (proposal) {
              _context.next = 5;
              break;
            }

            _context.next = 4;
            return regeneratorRuntime.awrap(interaction.reply('У вас нет предложений о браке.'));

          case 4:
            return _context.abrupt("return", _context.sent);

          case 5:
            // Удаляем предложение о браке из коллекции proposals
            proposals["delete"](interaction.user.id);
            _context.next = 8;
            return regeneratorRuntime.awrap(interaction.reply("\u0412\u044B \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043E\u0442\u043A\u043B\u043E\u043D\u0438\u043B\u0438 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u043E \u0431\u0440\u0430\u043A\u0435 \u043E\u0442 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F <@".concat(proposal.proposer, ">.")));

          case 8:
          case "end":
            return _context.stop();
        }
      }
    });
  }
};