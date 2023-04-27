"use strict";

var _require = require('@discordjs/builders'),
    SlashCommandBuilder = _require.SlashCommandBuilder;

var _require2 = require('discord.js'),
    EmbedBuilder = _require2.EmbedBuilder,
    ActionRowBuilder = _require2.ActionRowBuilder,
    ButtonBuilder = _require2.ButtonBuilder,
    PermissionsBitField = _require2.PermissionsBitField;

module.exports = {
  data: new SlashCommandBuilder().setName('createrolemessage').setDescription('Создает сообщение с кнопками для добавления ролей.'),
  execute: function execute(interaction) {
    var roleButton1, roleButton3, roleButton2, actionRow, UserBuild;
    return regeneratorRuntime.async(function execute$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
              _context.next = 22;
              break;
            }

            // Создаем кнопки и строку действий
            roleButton1 = new ButtonBuilder().setCustomId('role1').setLabel('Мужчина ♂️').setStyle('Secondary');
            roleButton3 = new ButtonBuilder().setCustomId('role3').setLabel('Девушка ♀️').setStyle('Secondary');
            roleButton2 = new ButtonBuilder().setCustomId('role2').setLabel('Не хочу говорить').setStyle('Secondary');
            actionRow = new ActionRowBuilder().addComponents(roleButton1, roleButton2, roleButton3);
            UserBuild = new EmbedBuilder().setColor(0x0c0c0d).setTitle("\u041A\u0430\u043A\u043E\u0432 \u0432\u0430\u0448 \u0433\u0435\u043D\u0434\u0435\u0440?").setDescription("\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0432\u0430\u0448 \u0433\u0435\u043D\u0434\u0435\u0440 \u043A\u043D\u043E\u043F\u043A\u0430\u043C\u0438 \u043D\u0438\u0436\u0435").setFooter({
              text: "Abyss",
              iconURL: interaction.guild.iconURL({
                dynamic: true
              })
            }); // Отправляем сообщение с кнопками

            _context.prev = 6;
            _context.next = 9;
            return regeneratorRuntime.awrap(interaction.deferReply());

          case 9:
            _context.next = 11;
            return regeneratorRuntime.awrap(interaction.deleteReply());

          case 11:
            _context.next = 13;
            return regeneratorRuntime.awrap(interaction.channel.send({
              embeds: [UserBuild],
              components: [actionRow]
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
            _context.next = 25;
            break;

          case 22:
            _context.next = 24;
            return regeneratorRuntime.awrap(interaction.reply('У вас нету прав'));

          case 24:
            return _context.abrupt("return", _context.sent);

          case 25:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[6, 15]]);
  }
};