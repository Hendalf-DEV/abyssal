"use strict";

var _require = require('@discordjs/builders'),
    SlashCommandBuilder = _require.SlashCommandBuilder,
    EmbedBuilder = _require.EmbedBuilder,
    ActionRowBuilder = _require.ActionRowBuilder,
    ButtonBuilder = _require.ButtonBuilder;

var db = require('../../database.js');

var proposals = new Map();
var proposalTimeout = 5 * 60 * 1000;
module.exports = {
  data: new SlashCommandBuilder().setName('marry').setDescription('Запрос на брак').addUserOption(function (option) {
    return option.setName('user').setDescription('Пользователь, которого вы хотите предложить на брак').setRequired(true);
  }),
  execute: function execute(interaction) {
    var user;
    return regeneratorRuntime.async(function execute$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            user = interaction.options.getUser('user');

            if (!(user.id === interaction.user.id)) {
              _context2.next = 5;
              break;
            }

            _context2.next = 4;
            return regeneratorRuntime.awrap(interaction.reply('Вы не можете жениться на самом себе.'));

          case 4:
            return _context2.abrupt("return", _context2.sent);

          case 5:
            db.all("SELECT * FROM married WHERE userId1=? OR userId1=?", [interaction.user.id, user.id], function _callee(error, rows) {
              var acceptButton, declineButton, actionRow, UserBuild;
              return regeneratorRuntime.async(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      if (!(rows && rows.length > 0)) {
                        _context.next = 4;
                        break;
                      }

                      _context.next = 3;
                      return regeneratorRuntime.awrap(interaction.reply('Вы или ваш партнер уже состоите в браке с другими людьми.'));

                    case 3:
                      return _context.abrupt("return", _context.sent);

                    case 4:
                      // Создаем кнопки и строку действий
                      acceptButton = new ButtonBuilder().setCustomId('accept').setLabel('Принять').setStyle('Success');
                      declineButton = new ButtonBuilder().setCustomId('decline').setLabel('Отклонить').setStyle('Danger');
                      actionRow = new ActionRowBuilder().setComponents(acceptButton, declineButton); // Добавляем предложение о браке в коллекцию proposals

                      proposals.set(user.id, {
                        proposer: interaction.user.id,
                        proposed: user.id
                      });
                      setTimeout(function () {
                        proposals["delete"](user.id);
                      }, proposalTimeout);
                      UserBuild = new EmbedBuilder().setColor(0x04d1ce).setTitle("\u041F\u0420\u0415\u0414\u041B\u041E\u0416\u0415\u041D\u0418\u0415 \u0420\u0423\u041A\u0418 \u0418 \u0421\u0415\u0420\u0414\u0426\u0410!").setDescription("\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C <@".concat(user.id, ">, \u0432\u044B \u0441\u043E\u0433\u043B\u0430\u0441\u043D\u044B \u0432\u044B\u0439\u0442\u0438 \u0437\u0430 <@").concat(interaction.user.id, ">?"));
                      _context.next = 12;
                      return regeneratorRuntime.awrap(interaction.reply({
                        embeds: [UserBuild],
                        components: [actionRow],
                        ephemeral: false
                      }));

                    case 12:
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
  },
  proposals: proposals
};