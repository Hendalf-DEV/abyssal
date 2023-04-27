"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var _require = require('@discordjs/builders'),
    SlashCommandBuilder = _require.SlashCommandBuilder;

var _require2 = require('discord.js'),
    ActionRowBuilder = _require2.ActionRowBuilder,
    ButtonBuilder = _require2.ButtonBuilder,
    EmbedBuilder = _require2.EmbedBuilder;

var db = require('../../database');

function getUserBalance(userId) {
  return regeneratorRuntime.async(function getUserBalance$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", new Promise(function (resolve, reject) {
            db.get('SELECT balance FROM users WHERE userId = ?', [userId], function (error, row) {
              if (error) {
                reject(error);
              } else {
                resolve(row ? row.balance : 0);
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

function updateUserBalance(userId, newBalance) {
  return regeneratorRuntime.async(function updateUserBalance$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return", new Promise(function (resolve, reject) {
            db.run('INSERT OR REPLACE INTO users (userId, balance) VALUES (?, ?)', [userId, newBalance], function (error) {
              if (error) {
                reject(error);
              } else {
                resolve();
              }
            });
          }));

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function hasUserBoughtProduct(userId, productId) {
  return regeneratorRuntime.async(function hasUserBoughtProduct$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          return _context3.abrupt("return", new Promise(function (resolve, reject) {
            db.get('SELECT * FROM user_products WHERE userId = ? AND productId = ?', [userId, productId], function (error, row) {
              if (error) {
                reject(error);
              } else {
                resolve(!!row);
              }
            });
          }));

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function addUserProduct(userId, productId) {
  return regeneratorRuntime.async(function addUserProduct$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          return _context4.abrupt("return", new Promise(function (resolve, reject) {
            db.run('INSERT INTO user_products (userId, productId) VALUES (?, ?)', [userId, productId], function (error) {
              if (error) {
                reject(error);
              } else {
                resolve();
              }
            });
          }));

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
}

var currencyName = 'Abyss';
var categories = [{
  name: 'roles',
  label: 'Роли',
  fields: [{
    name: 'Роль 1',
    price: 100,
    id: '1096542496097583274'
  }, {
    name: 'Роль 2',
    price: 1000,
    id: '1096542496097583275'
  }],
  buttons: [{
    customId: 'buyRole-1096542496097583274',
    label: 'Купить Роль 1',
    style: 'Primary'
  }, {
    customId: 'buyRole-1096542496097583275',
    label: 'Купить Роль 2',
    style: 'Primary'
  }]
}, {
  name: 'backgrounds',
  label: 'Фоны',
  fields: [{
    name: 'Google',
    price: 500,
    id: 'bg_google'
  }, {
    name: 'Яндекс',
    price: 500,
    id: 'bg_yandex'
  }],
  buttons: [{
    customId: 'buyBackground-bg_google',
    label: 'Купить Google',
    style: 'Primary'
  }, {
    customId: 'buyBackground-bg_yandex',
    label: 'Купить Яндекс',
    style: 'Primary'
  }]
} // Добавьте другие категории здесь
];

var createBackButton = function createBackButton() {
  return new ButtonBuilder().setCustomId('backToCategories').setLabel('Назад').setStyle('Secondary');
};

var getCategoryButtons = function getCategoryButtons() {
  return categories.map(function (category) {
    return new ButtonBuilder().setCustomId("category-".concat(category.name)).setLabel(category.label).setStyle('Secondary');
  });
};

var getCategoryFields = function getCategoryFields(categoryName) {
  var category = categories.find(function (c) {
    return c.name === categoryName;
  });
  if (!category) return [];
  return category.fields.map(function (field) {
    return {
      name: field.name,
      value: "\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C: ".concat(field.price, " \u043A\u043E\u0439\u043D\u043E\u0432")
    };
  });
};

var getCategoryButtonsByName = function getCategoryButtonsByName(categoryName) {
  var category = categories.find(function (c) {
    return c.name === categoryName;
  });
  if (!category) return [];
  return [].concat(_toConsumableArray(category.buttons.map(function (button) {
    return new ButtonBuilder().setCustomId(button.customId).setLabel(button.label).setStyle(button.style);
  })), [createBackButton()]);
};

var updateEmbedAndButtons = function updateEmbedAndButtons(interaction, categoryName) {
  var Shop, row;
  return regeneratorRuntime.async(function updateEmbedAndButtons$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          Shop = new EmbedBuilder().setColor(0x0099FF).setTitle("\u041C\u0430\u0433\u0430\u0437\u0438\u043D").addFields(getCategoryFields(categoryName)).setFooter({
            text: "\u0417\u0430\u043F\u0440\u043E\u0441\u0438\u043B ".concat(interaction.user.tag),
            iconURL: interaction.guild.iconURL({
              dynamic: true
            })
          });
          row = new ActionRowBuilder().addComponents(getCategoryButtonsByName(categoryName));
          _context5.next = 4;
          return regeneratorRuntime.awrap(interaction.update({
            embeds: [Shop],
            components: [row],
            ephemeral: false
          }));

        case 4:
        case "end":
          return _context5.stop();
      }
    }
  });
};

module.exports = {
  data: new SlashCommandBuilder().setName('shop').setDescription('Открывает магазин ролей'),
  execute: function execute(interaction) {
    var Shop, categoryRow, collector;
    return regeneratorRuntime.async(function execute$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            Shop = new EmbedBuilder().setColor(0x0099FF).setTitle("\u041C\u0430\u0433\u0430\u0437\u0438\u043D").setFooter({
              text: "\u0417\u0430\u043F\u0440\u043E\u0441\u0438\u043B ".concat(interaction.user.tag),
              iconURL: interaction.guild.iconURL({
                dynamic: true
              })
            });
            categoryRow = new ActionRowBuilder().setComponents(getCategoryButtons());
            _context7.next = 4;
            return regeneratorRuntime.awrap(interaction.reply({
              embeds: [Shop],
              components: [categoryRow],
              ephemeral: false
            }));

          case 4:
            collector = interaction.channel.createMessageComponentCollector({
              time: 60000
            });
            collector.on('collect', function _callee(i) {
              var categoryName, _Shop, _categoryRow, backgroundId, background, _userId, _userBalance, _alreadyBought, roleId, role, userId, userBalance, alreadyBought;

              return regeneratorRuntime.async(function _callee$(_context6) {
                while (1) {
                  switch (_context6.prev = _context6.next) {
                    case 0:
                      if (i.isButton()) {
                        _context6.next = 2;
                        break;
                      }

                      return _context6.abrupt("return");

                    case 2:
                      if (!i.customId.startsWith('category')) {
                        _context6.next = 7;
                        break;
                      }

                      categoryName = i.customId.split('-')[1];
                      _context6.next = 6;
                      return regeneratorRuntime.awrap(updateEmbedAndButtons(i, categoryName));

                    case 6:
                      return _context6.abrupt("return");

                    case 7:
                      if (!(i.customId === 'backToCategories')) {
                        _context6.next = 13;
                        break;
                      }

                      _Shop = new EmbedBuilder().setColor(0x0099FF).setTitle("\u041C\u0430\u0433\u0430\u0437\u0438\u043D").setFooter({
                        text: "\u0417\u0430\u043F\u0440\u043E\u0441\u0438\u043B ".concat(interaction.user.tag),
                        iconURL: interaction.guild.iconURL({
                          dynamic: true
                        })
                      });
                      _categoryRow = new ActionRowBuilder().setComponents(getCategoryButtons());
                      _context6.next = 12;
                      return regeneratorRuntime.awrap(i.update({
                        embeds: [_Shop],
                        components: [_categoryRow],
                        ephemeral: false
                      }));

                    case 12:
                      return _context6.abrupt("return");

                    case 13:
                      if (!i.customId.startsWith('buyBackground')) {
                        _context6.next = 42;
                        break;
                      }

                      backgroundId = i.customId.split('-')[1];
                      background = categories.flatMap(function (category) {
                        return category.fields;
                      }).find(function (field) {
                        return field.id === backgroundId;
                      });

                      if (background) {
                        _context6.next = 20;
                        break;
                      }

                      _context6.next = 19;
                      return regeneratorRuntime.awrap(i.reply({
                        content: 'Произошла ошибка, попробуйте еще раз.',
                        ephemeral: true
                      }));

                    case 19:
                      return _context6.abrupt("return");

                    case 20:
                      _userId = i.user.id;
                      _context6.next = 23;
                      return regeneratorRuntime.awrap(getUserBalance(_userId));

                    case 23:
                      _userBalance = _context6.sent;

                      if (!(_userBalance < background.price)) {
                        _context6.next = 28;
                        break;
                      }

                      _context6.next = 27;
                      return regeneratorRuntime.awrap(i.reply({
                        content: "\u0423 \u0432\u0430\u0441 \u043D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E ".concat(currencyName, " \u0434\u043B\u044F \u043F\u043E\u043A\u0443\u043F\u043A\u0438 \u044D\u0442\u043E\u0433\u043E \u0444\u043E\u043D\u0430. \u0412\u0430\u0448 \u0431\u0430\u043B\u0430\u043D\u0441: ").concat(_userBalance, " ").concat(currencyName, "."),
                        ephemeral: true
                      }));

                    case 27:
                      return _context6.abrupt("return");

                    case 28:
                      _context6.next = 30;
                      return regeneratorRuntime.awrap(hasUserBoughtProduct(_userId, background.id));

                    case 30:
                      _alreadyBought = _context6.sent;

                      if (!_alreadyBought) {
                        _context6.next = 35;
                        break;
                      }

                      _context6.next = 34;
                      return regeneratorRuntime.awrap(i.reply({
                        content: "\u0412\u044B \u0443\u0436\u0435 \u043F\u0440\u0438\u043E\u0431\u0440\u0435\u043B\u0438 \"".concat(background.name, "\". \u0412\u044B \u043D\u0435 \u043C\u043E\u0436\u0435\u0442\u0435 \u043A\u0443\u043F\u0438\u0442\u044C \u0435\u0433\u043E \u0441\u043D\u043E\u0432\u0430."),
                        ephemeral: true
                      }));

                    case 34:
                      return _context6.abrupt("return");

                    case 35:
                      _context6.next = 37;
                      return regeneratorRuntime.awrap(updateUserBalance(_userId, _userBalance - background.price));

                    case 37:
                      _context6.next = 39;
                      return regeneratorRuntime.awrap(addUserProduct(_userId, background.id));

                    case 39:
                      _context6.next = 41;
                      return regeneratorRuntime.awrap(i.reply({
                        content: "\u0412\u044B \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043F\u0440\u0438\u043E\u0431\u0440\u0435\u043B\u0438 \u0444\u043E\u043D \"".concat(background.name, "\" \u0437\u0430 ").concat(background.price, " ").concat(currencyName, "! \u0412\u0430\u0448 \u043D\u043E\u0432\u044B\u0439 \u0431\u0430\u043B\u0430\u043D\u0441: ").concat(_userBalance - background.price, " ").concat(currencyName, "."),
                        ephemeral: true
                      }));

                    case 41:
                      return _context6.abrupt("return");

                    case 42:
                      if (i.customId.startsWith('buyRole')) {
                        _context6.next = 44;
                        break;
                      }

                      return _context6.abrupt("return");

                    case 44:
                      roleId = i.customId.split('-')[1];
                      role = categories.flatMap(function (category) {
                        return category.fields;
                      }).find(function (field) {
                        return field.id === roleId;
                      });

                      if (role) {
                        _context6.next = 50;
                        break;
                      }

                      _context6.next = 49;
                      return regeneratorRuntime.awrap(i.reply({
                        content: 'Произошла ошибка, попробуйте еще раз.',
                        ephemeral: true
                      }));

                    case 49:
                      return _context6.abrupt("return");

                    case 50:
                      userId = i.user.id;
                      _context6.next = 53;
                      return regeneratorRuntime.awrap(getUserBalance(userId));

                    case 53:
                      userBalance = _context6.sent;

                      if (!(userBalance < role.price)) {
                        _context6.next = 58;
                        break;
                      }

                      _context6.next = 57;
                      return regeneratorRuntime.awrap(i.reply({
                        content: "\u0423 \u0432\u0430\u0441 \u043D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E ".concat(currencyName, " \u0434\u043B\u044F \u043F\u043E\u043A\u0443\u043F\u043A\u0438 \u044D\u0442\u043E\u0439 \u0440\u043E\u043B\u0438. \u0412\u0430\u0448 \u0431\u0430\u043B\u0430\u043D\u0441: ").concat(userBalance, " ").concat(currencyName, "."),
                        ephemeral: true
                      }));

                    case 57:
                      return _context6.abrupt("return");

                    case 58:
                      _context6.next = 60;
                      return regeneratorRuntime.awrap(hasUserBoughtProduct(userId, role.id));

                    case 60:
                      alreadyBought = _context6.sent;

                      if (!alreadyBought) {
                        _context6.next = 65;
                        break;
                      }

                      _context6.next = 64;
                      return regeneratorRuntime.awrap(i.reply({
                        content: "\u0412\u044B \u0443\u0436\u0435 \u043F\u0440\u0438\u043E\u0431\u0440\u0435\u043B\u0438 \"".concat(role.name, "\". \u0412\u044B \u043D\u0435 \u043C\u043E\u0436\u0435\u0442\u0435 \u043A\u0443\u043F\u0438\u0442\u044C \u0435\u0433\u043E \u0441\u043D\u043E\u0432\u0430."),
                        ephemeral: true
                      }));

                    case 64:
                      return _context6.abrupt("return");

                    case 65:
                      _context6.next = 67;
                      return regeneratorRuntime.awrap(updateUserBalance(userId, userBalance - role.price));

                    case 67:
                      _context6.next = 69;
                      return regeneratorRuntime.awrap(i.member.roles.add(role.id));

                    case 69:
                      _context6.next = 71;
                      return regeneratorRuntime.awrap(addUserProduct(userId, role.id));

                    case 71:
                      _context6.next = 73;
                      return regeneratorRuntime.awrap(i.reply({
                        content: "\u0412\u044B \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043F\u0440\u0438\u043E\u0431\u0440\u0435\u043B\u0438 \u0440\u043E\u043B\u044C \"".concat(role.name, "\" \u0437\u0430 ").concat(role.price, " ").concat(currencyName, "! \u0412\u0430\u0448 \u043D\u043E\u0432\u044B\u0439 \u0431\u0430\u043B\u0430\u043D\u0441: ").concat(userBalance - role.price, " ").concat(currencyName, "."),
                        ephemeral: true
                      }));

                    case 73:
                    case "end":
                      return _context6.stop();
                  }
                }
              });
            });
            collector.on('end', function () {
              console.log('Collector stopped.');
            });

          case 7:
          case "end":
            return _context7.stop();
        }
      }
    });
  }
};