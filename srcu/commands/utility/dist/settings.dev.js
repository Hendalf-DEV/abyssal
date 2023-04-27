"use strict";

var _require = require('discord.js'),
    ActionRowBuilder = _require.ActionRowBuilder,
    ButtonBuilder = _require.ButtonBuilder,
    SlashCommandBuilder = _require.SlashCommandBuilder;

var db = require('../../database');

function getBought(userId, productId) {
  return regeneratorRuntime.async(function getBought$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", new Promise(function (resolve, reject) {
            db.get('SELECT productId FROM user_products WHERE userId = ? AND productId = ?', [userId, productId], function (error, row) {
              if (error) {
                reject(error);
              } else {
                resolve(row ? row.productId : 'default_background');
              }
            });
          }));

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
}

function hasBougt(userId, product) {
  return regeneratorRuntime.async(function hasBougt$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(getBought(userId, product));

        case 2:
          _context2.t0 = _context2.sent;
          _context2.t1 = product;

          if (!(_context2.t0 == _context2.t1)) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return", false);

        case 8:
          return _context2.abrupt("return", true);

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  });
}

var google = 'bg_google';
var yadi = 'bg_yandex';
module.exports = {
  data: new SlashCommandBuilder().setName('settings').setDescription('Ваш профиль'),
  execute: function execute(interaction) {
    var buttonRow;
    return regeneratorRuntime.async(function execute$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.t0 = new ActionRowBuilder();
            _context3.t1 = new ButtonBuilder().setCustomId('default_background').setLabel('Дефолтный фон').setStyle('Primary');
            _context3.t2 = new ButtonBuilder().setCustomId('other_background').setLabel('Другой фон').setStyle('Secondary');
            _context3.next = 5;
            return regeneratorRuntime.awrap(hasBougt(interaction.user.id, google));

          case 5:
            _context3.t3 = _context3.sent;
            _context3.t4 = _context3.t2.setDisabled.call(_context3.t2, _context3.t3);
            _context3.t5 = new ButtonBuilder().setCustomId('yadi_background').setLabel('Другой фон').setStyle('Secondary');
            _context3.next = 10;
            return regeneratorRuntime.awrap(hasBougt(interaction.user.id, yadi));

          case 10:
            _context3.t6 = _context3.sent;
            _context3.t7 = _context3.t5.setDisabled.call(_context3.t5, _context3.t6);
            buttonRow = _context3.t0.setComponents.call(_context3.t0, _context3.t1, _context3.t4, _context3.t7);
            _context3.next = 15;
            return regeneratorRuntime.awrap(interaction.reply({
              content: 'Выберите фон профиля:',
              components: [buttonRow],
              ephemeral: true
            }));

          case 15:
            return _context3.abrupt("return");

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    });
  }
};