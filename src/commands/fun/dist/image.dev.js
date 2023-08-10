"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _require = require('@discordjs/builders'),
    SlashCommandBuilder = _require.SlashCommandBuilder,
    EmbedBuilder = _require.EmbedBuilder;

module.exports = {
  data: new SlashCommandBuilder().setName('image').setDescription('Отправить сообщение с изображением').addStringOption(function (option) {
    return option.setName('url').setDescription('Ссылка на изображение').setRequired(true);
  }).addStringOption(function (option) {
    return option.setName('title').setDescription('Заголовок').setRequired(true);
  }).addStringOption(function (option) {
    return option.setName('desc').setDescription('Описание').setRequired(true);
  }).addStringOption(function (option) {
    return option.setName('optional').setDescription('Опциональные поля (Название1:Значение1:true (В одну строку), Название2:Значение2:false и т.д.)').setRequired(false);
  }),
  execute: function execute(interaction) {
    var image, title, desc, optional, mess, optionalFields;
    return regeneratorRuntime.async(function execute$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            image = interaction.options.getString('url');
            title = interaction.options.getString('title');
            desc = interaction.options.getString('desc');
            optional = interaction.options.getString('optional');
            mess = new EmbedBuilder().setColor(0x0099FF).setTitle(title).setDescription(desc).setFooter({
              text: "Abyss",
              iconURL: interaction.guild.iconURL({
                dynamic: true
              })
            }).setImage(image);

            if (optional) {
              optionalFields = optional.split(';').map(function (field) {
                var _field$split = field.split(':'),
                    _field$split2 = _slicedToArray(_field$split, 3),
                    name = _field$split2[0],
                    value = _field$split2[1],
                    inline = _field$split2[2];

                return {
                  name: name,
                  value: value,
                  inline: inline === 'true'
                };
              });
              mess.addFields(optionalFields);
            }

            _context.prev = 6;
            _context.next = 9;
            return regeneratorRuntime.awrap(interaction.deferReply());

          case 9:
            _context.next = 11;
            return regeneratorRuntime.awrap(interaction.deleteReply());

          case 11:
            _context.next = 13;
            return regeneratorRuntime.awrap(interaction.channel.send({
              embeds: [mess]
            }));

          case 13:
            _context.next = 20;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](6);
            console.error(_context.t0);
            _context.next = 20;
            return regeneratorRuntime.awrap(interaction.reply({
              content: 'Ошибка отправки сообщения',
              ephemeral: true
            }));

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[6, 15]]);
  }
};