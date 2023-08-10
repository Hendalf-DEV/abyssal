"use strict";

var _require = require('discord.js'),
    Events = _require.Events;

var _require2 = require('../commands/fun/marry'),
    proposals = _require2.proposals;

var db = require('../database.js');

module.exports = {
  name: Events.InteractionCreate,
  execute: function execute(interaction) {
    var command, setBackground, customId, role1, role3, role2, proposal, background, backgroundURL;
    return regeneratorRuntime.async(function execute$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            setBackground = function _ref(interaction, background, backgroundURL) {
              return regeneratorRuntime.async(function setBackground$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      return _context.abrupt("return", new Promise(function (resolve, reject) {
                        db.run('INSERT OR REPLACE INTO backgrounds (userId, background, backgroundURL) VALUES (?, ?, ?)', [interaction.user.id, background, backgroundURL], function (error) {
                          if (error) {
                            reject(error);
                          } else {
                            resolve();
                          }
                        });
                      }));

                    case 1:
                    case "end":
                      return _context.stop();
                  }
                }
              });
            };

            if (!interaction.isCommand()) {
              _context4.next = 15;
              break;
            }

            command = interaction.client.commands.get(interaction.commandName);

            if (command) {
              _context4.next = 5;
              break;
            }

            return _context4.abrupt("return");

          case 5:
            _context4.prev = 5;
            _context4.next = 8;
            return regeneratorRuntime.awrap(command.execute(interaction));

          case 8:
            _context4.next = 15;
            break;

          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4["catch"](5);
            if (_context4.t0) console.error(_context4.t0);
            _context4.next = 15;
            return regeneratorRuntime.awrap(interaction.reply({
              content: 'There was an error while executing this command!',
              ephemeral: true
            }));

          case 15:
            if (interaction.isButton()) {
              _context4.next = 17;
              break;
            }

            return _context4.abrupt("return");

          case 17:
            customId = interaction.customId; // Обработка кнопок для добавления ролей

            role1 = "1095710247886266398";
            role3 = "1096205854522486846";
            role2 = "1098724531964751943";
            _context4.t1 = customId;
            _context4.next = _context4.t1 === 'role1' ? 24 : _context4.t1 === 'role2' ? 42 : _context4.t1 === 'role3' ? 60 : 78;
            break;

          case 24:
            if (!interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(role2)) {
              _context4.next = 29;
              break;
            }

            _context4.next = 27;
            return regeneratorRuntime.awrap(interaction.guild.members.cache.get(interaction.user.id).roles.remove(role2));

          case 27:
            _context4.next = 32;
            break;

          case 29:
            if (!interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(role3)) {
              _context4.next = 32;
              break;
            }

            _context4.next = 32;
            return regeneratorRuntime.awrap(interaction.guild.members.cache.get(interaction.user.id).roles.remove(role3));

          case 32:
            if (interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(role1)) {
              _context4.next = 39;
              break;
            }

            _context4.next = 35;
            return regeneratorRuntime.awrap(interaction.guild.members.cache.get(interaction.user.id).roles.add(role1));

          case 35:
            _context4.next = 37;
            return regeneratorRuntime.awrap(interaction.reply({
              content: 'Вы получили роль мужчина!',
              ephemeral: true
            }));

          case 37:
            _context4.next = 41;
            break;

          case 39:
            _context4.next = 41;
            return regeneratorRuntime.awrap(interaction.reply({
              content: "\u0423 \u0432\u0430\u0441 \u0443\u0436\u0435 \u0438\u043C\u0435\u0435\u0442\u0441\u044F \u0434\u0430\u043D\u043D\u0430\u044F \u0440\u043E\u043B\u044C!",
              ephemeral: true
            }));

          case 41:
            return _context4.abrupt("break", 78);

          case 42:
            if (!interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(role3)) {
              _context4.next = 47;
              break;
            }

            _context4.next = 45;
            return regeneratorRuntime.awrap(interaction.guild.members.cache.get(interaction.user.id).roles.remove(role3));

          case 45:
            _context4.next = 50;
            break;

          case 47:
            if (!interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(role1)) {
              _context4.next = 50;
              break;
            }

            _context4.next = 50;
            return regeneratorRuntime.awrap(interaction.guild.members.cache.get(interaction.user.id).roles.remove(role1));

          case 50:
            if (interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(role2)) {
              _context4.next = 57;
              break;
            }

            _context4.next = 53;
            return regeneratorRuntime.awrap(interaction.guild.members.cache.get(interaction.user.id).roles.add(role2));

          case 53:
            _context4.next = 55;
            return regeneratorRuntime.awrap(interaction.reply({
              content: 'Вы получили роль ⚪!',
              ephemeral: true
            }));

          case 55:
            _context4.next = 59;
            break;

          case 57:
            _context4.next = 59;
            return regeneratorRuntime.awrap(interaction.reply({
              content: "\u0423 \u0432\u0430\u0441 \u0443\u0436\u0435 \u0438\u043C\u0435\u0435\u0442\u0441\u044F \u0434\u0430\u043D\u043D\u0430\u044F \u0440\u043E\u043B\u044C!",
              ephemeral: true
            }));

          case 59:
            return _context4.abrupt("break", 78);

          case 60:
            if (!interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(role2)) {
              _context4.next = 65;
              break;
            }

            _context4.next = 63;
            return regeneratorRuntime.awrap(interaction.guild.members.cache.get(interaction.user.id).roles.remove(role2));

          case 63:
            _context4.next = 68;
            break;

          case 65:
            if (!interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(role1)) {
              _context4.next = 68;
              break;
            }

            _context4.next = 68;
            return regeneratorRuntime.awrap(interaction.guild.members.cache.get(interaction.user.id).roles.remove(role1));

          case 68:
            if (interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(role3)) {
              _context4.next = 75;
              break;
            }

            _context4.next = 71;
            return regeneratorRuntime.awrap(interaction.guild.members.cache.get(interaction.user.id).roles.add(role3));

          case 71:
            _context4.next = 73;
            return regeneratorRuntime.awrap(interaction.reply({
              content: 'Вы получили роль девушка!',
              ephemeral: true
            }));

          case 73:
            _context4.next = 77;
            break;

          case 75:
            _context4.next = 77;
            return regeneratorRuntime.awrap(interaction.reply({
              content: "\u0423 \u0432\u0430\u0441 \u0443\u0436\u0435 \u0438\u043C\u0435\u0435\u0442\u0441\u044F \u0434\u0430\u043D\u043D\u0430\u044F \u0440\u043E\u043B\u044C!",
              ephemeral: true
            }));

          case 77:
            return _context4.abrupt("break", 78);

          case 78:
            if (!(customId === 'accept' || customId === 'decline')) {
              _context4.next = 92;
              break;
            }

            proposal = proposals.get(interaction.user.id);

            if (proposal) {
              _context4.next = 84;
              break;
            }

            _context4.next = 83;
            return regeneratorRuntime.awrap(interaction.reply({
              content: 'Вам не приходило предложения руки и сердца.',
              ephemeral: true
            }));

          case 83:
            return _context4.abrupt("return", _context4.sent);

          case 84:
            if (!(customId === 'accept')) {
              _context4.next = 88;
              break;
            }

            db.run("INSERT INTO married (userId1, userId2) VALUES (?, ?)", [proposal.proposer, proposal.proposed], function _callee(error) {
              return regeneratorRuntime.async(function _callee$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      if (!error) {
                        _context2.next = 5;
                        break;
                      }

                      console.error(error);
                      _context2.next = 4;
                      return regeneratorRuntime.awrap(interaction.reply({
                        content: 'Произошла ошибка при добавлении брака в базу данных.',
                        ephemeral: true
                      }));

                    case 4:
                      return _context2.abrupt("return", _context2.sent);

                    case 5:
                      proposals["delete"](interaction.user.id);
                      _context2.next = 8;
                      return regeneratorRuntime.awrap(interaction.reply({
                        content: "\u041F\u043E\u0437\u0434\u0440\u0430\u0432\u043B\u044F\u0435\u043C! <@".concat(interaction.user.id, "> \u0438 <@").concat(proposal.proposer, "> \u0442\u0435\u043F\u0435\u0440\u044C \u0441\u043E\u0441\u0442\u043E\u044F\u0442 \u0432 \u0431\u0440\u0430\u043A\u0435!"),
                        ephemeral: false
                      }));

                    case 8:
                    case "end":
                      return _context2.stop();
                  }
                }
              });
            });
            _context4.next = 92;
            break;

          case 88:
            if (!(customId === 'decline')) {
              _context4.next = 92;
              break;
            }

            proposals["delete"](interaction.user.id);
            _context4.next = 92;
            return regeneratorRuntime.awrap(interaction.reply({
              content: "<@".concat(interaction.user.id, "> \u043E\u0442\u043A\u043B\u043E\u043D\u0438\u043B(\u0430) \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435 <@").concat(proposal.proposer, ">."),
              ephemeral: false
            }));

          case 92:
            if (!(customId === 'default_background' || customId === 'other_background')) {
              _context4.next = 109;
              break;
            }

            background = customId === 'default_background' ? 'default' : 'other';
            backgroundURL = customId === 'default_background' ? 'https://i.imgur.com/H5yzOvq.png' : 'https://i.imgur.com/1uBAEV5.jpeg';
            _context4.prev = 95;
            _context4.next = 98;
            return regeneratorRuntime.awrap(setBackground(interaction, background, backgroundURL));

          case 98:
            _context4.next = 100;
            return regeneratorRuntime.awrap(interaction.reply({
              content: "\u0424\u043E\u043D \u043F\u0440\u043E\u0444\u0438\u043B\u044F \u0438\u0437\u043C\u0435\u043D\u0435\u043D \u043D\u0430: ".concat(background),
              ephemeral: true
            }));

          case 100:
            // Устанавливаем таймаут на 2 минуты (120000 миллисекунд)
            setTimeout(function _callee2() {
              var disabledButtons;
              return regeneratorRuntime.async(function _callee2$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      // Отключаем кнопки после истечения времени
                      disabledButtons = interaction.message.components.map(function (row) {
                        var newRow = row;
                        newRow.components = row.components.map(function (button) {
                          var newButton = button;
                          newButton.setDisabled(true);
                          return newButton;
                        });
                        return newRow;
                      }); // Обновляем сообщение с новыми, отключенными кнопками

                      _context3.next = 3;
                      return regeneratorRuntime.awrap(interaction.message.edit({
                        components: disabledButtons
                      }));

                    case 3:
                    case "end":
                      return _context3.stop();
                  }
                }
              });
            }, 120000); // 2 минуты

            _context4.next = 108;
            break;

          case 103:
            _context4.prev = 103;
            _context4.t2 = _context4["catch"](95);
            console.error(_context4.t2);
            _context4.next = 108;
            return regeneratorRuntime.awrap(interaction.reply({
              content: 'Произошла ошибка при сохранении настроек фона.',
              ephemeral: true
            }));

          case 108:
            return _context4.abrupt("return");

          case 109:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[5, 10], [95, 103]]);
  }
};