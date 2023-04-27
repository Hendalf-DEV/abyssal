"use strict";

var _require = require('discord.js'),
    SlashCommandBuilder = _require.SlashCommandBuilder,
    EmbedBuilder = _require.EmbedBuilder;

module.exports = {
  data: new SlashCommandBuilder().setName('ban').setDescription('Выдаёт бан пользователю').addUserOption(function (option) {
    return option.setName('user').setDescription('Укажите пользователя которого Вы хотите забанить').setRequired(true);
  }).addStringOption(function (option) {
    return option.setName('reason').setDescription('Введите причину бана (Не обязательно)');
  }),
  execute: function execute(interaction) {
    var reason, loh, MuteBuild;
    return regeneratorRuntime.async(function execute$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            reason = interaction.options.getString('reason') || 'Не указана';
            loh = interaction.options.getUser('user');
            MuteBuild = new EmbedBuilder().setColor('#cc0e00').setTitle("\u0412\u044B\u0434\u0430\u043D \u0431\u0430\u043D ".concat(interaction.options.getUser('user').tag)).setDescription("\u041F\u0440\u0438\u0447\u0438\u043D\u0430 \u0431\u0430\u043D\u0430: ".concat(reason, " ")).setFooter({
              text: "\u0410\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440 ".concat(interaction.user.tag),
              iconURL: interaction.guild.iconURL({
                dynamic: true
              })
            });
            _context.next = 5;
            return regeneratorRuntime.awrap(interaction.reply({
              embeds: [MuteBuild]
            }));

          case 5:
            interaction.guild.members.ban(loh, {
              reason: interaction.options.getString('reason') || 'Не указана'
            });

          case 6:
          case "end":
            return _context.stop();
        }
      }
    });
  }
};