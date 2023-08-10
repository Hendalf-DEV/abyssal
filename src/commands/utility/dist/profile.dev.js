"use strict";

var Canvas = require('canvas');

var _require = require('discord.js'),
    AttachmentBuilder = _require.AttachmentBuilder,
    SlashCommandBuilder = _require.SlashCommandBuilder;

var db = require('../../database');

function formatMilliseconds(ms) {
  var seconds = Math.floor(ms / 1000 % 60);
  var minutes = Math.floor(ms / (1000 * 60) % 60);
  var hours = Math.floor(ms / (1000 * 60 * 60));
  return "".concat(hours.toString().padStart(2, '0'), ":").concat(minutes.toString().padStart(2, '0'), ":").concat(seconds.toString().padStart(2, '0'));
}

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

function getBGURL(userId) {
  return regeneratorRuntime.async(function getBGURL$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return", new Promise(function (resolve, reject) {
            db.get('SELECT backgroundURL FROM backgrounds WHERE userId = ?', [userId], function (error, row) {
              if (error) {
                reject(error);
              } else {
                resolve(row ? row.backgroundURL : 'https://i.imgur.com/H5yzOvq.png');
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

module.exports = {
  data: new SlashCommandBuilder().setName('profile').setDescription('Ваш профиль').addUserOption(function (option) {
    return option.setName('user').setDescription('Укажите пользователя (Опцианально)').setRequired(false);
  }),
  execute: function execute(interaction) {
    var width, height, canvas, ctx, bg, glowSize, glowColor, rectWidth, rectHeight, rectX, rectY, cornerRadius, member, usr, avatar, profilePictureSize, profilePictureRadius, profilePictureX, profilePictureY, name, userBalance, wallet, userTime, timeSpentInVoice, formattedTimeSpentInVoice, online, buffer, attachment, _width, _height, _canvas, _ctx, _bg, _glowSize, _glowColor, _rectWidth, _rectHeight, _rectX, _rectY, _cornerRadius, user, _member, _avatar, _profilePictureSize, _profilePictureRadius, _profilePictureX, _profilePictureY, _name, _userBalance, _wallet, _userTime, _timeSpentInVoice, _formattedTimeSpentInVoice, _online, _buffer, _attachment;

    return regeneratorRuntime.async(function execute$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!(interaction.options.getUser('user') !== null)) {
              _context3.next = 106;
              break;
            }

            _context3.next = 3;
            return regeneratorRuntime.awrap(interaction.deferReply());

          case 3:
            width = 1080;
            height = 620;
            canvas = Canvas.createCanvas(width, height);
            ctx = canvas.getContext('2d');
            _context3.t0 = regeneratorRuntime;
            _context3.t1 = Canvas;
            _context3.next = 11;
            return regeneratorRuntime.awrap(getBGURL(interaction.options.getUser('user').id));

          case 11:
            _context3.t2 = _context3.sent;
            _context3.t3 = _context3.t1.loadImage.call(_context3.t1, _context3.t2);
            _context3.next = 15;
            return _context3.t0.awrap.call(_context3.t0, _context3.t3);

          case 15:
            bg = _context3.sent;
            // Create linear gradient for the background
            // Draw the background with a glow effect
            glowSize = 15;
            glowColor = '#ffffff';
            ctx.beginPath();
            rectWidth = 1050;
            rectHeight = 590;
            rectX = 10;
            rectY = 10;
            cornerRadius = 20; // Draw the larger rounded rectangle with the glow effect

            ctx.beginPath();
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = glowSize;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.moveTo(rectX + cornerRadius, rectY);
            ctx.lineTo(rectX + rectWidth - cornerRadius, rectY);
            ctx.arcTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + cornerRadius, cornerRadius);
            ctx.lineTo(rectX + rectWidth, rectY + rectHeight - cornerRadius);
            ctx.arcTo(rectX + rectWidth, rectY + rectHeight, rectX + rectWidth - cornerRadius, rectY + rectHeight, cornerRadius);
            ctx.lineTo(rectX + cornerRadius, rectY + rectHeight);
            ctx.arcTo(rectX, rectY + rectHeight, rectX, rectY + rectHeight - cornerRadius, cornerRadius);
            ctx.lineTo(rectX, rectY + cornerRadius);
            ctx.arcTo(rectX, rectY, rectX + cornerRadius, rectY, cornerRadius);
            ctx.closePath();
            ctx.fill();
            ctx.clip(); // Draw the image within the larger rounded rectangle

            ctx.drawImage(bg, rectX, rectY, rectWidth, rectHeight); // Load profile picture

            member = interaction.options.getMember('user');
            usr = interaction.options.getUser('user');
            _context3.next = 46;
            return regeneratorRuntime.awrap(Canvas.loadImage(member.displayAvatarURL().replace('.webp', '.jpg')));

          case 46:
            avatar = _context3.sent;
            // Draw rounded profile picture with a glow effect
            profilePictureSize = 225;
            profilePictureRadius = profilePictureSize / 2;
            profilePictureX = width / 2 - profilePictureRadius;
            profilePictureY = height / 2 - profilePictureRadius;
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, profilePictureRadius + glowSize, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = glowSize;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.fill();
            ctx.save();
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, profilePictureRadius, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatar, profilePictureX, profilePictureY, profilePictureSize, profilePictureSize);
            ctx.restore();
            name = interaction.options.getMember('user').nickname ? interaction.options.getMember('user').nickname : interaction.options.getUser('user').username; // Draw user tag

            ctx.font = '52px Museo Cyrl 500';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0, 0, 0, 185)';
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.shadowBlur = 8;
            ctx.fillText("".concat(name, "#").concat(interaction.options.getUser('user').discriminator), width / 2, 105);
            _context3.next = 77;
            return regeneratorRuntime.awrap(getUserBalance(usr.id));

          case 77:
            userBalance = _context3.sent;
            _context3.next = 80;
            return regeneratorRuntime.awrap(Canvas.loadImage('https://i.imgur.com/zWhRE0w.png'));

          case 80:
            wallet = _context3.sent;
            ctx.drawImage(wallet, 688, 190, 62, 49);
            ctx.font = '42px Museo Cyrl 500';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'left';
            ctx.fillText('Баланс', 768, 200);
            ctx.fillText(userBalance, 768, 250);
            _context3.next = 89;
            return regeneratorRuntime.awrap(new Promise(function (resolve) {
              db.get("SELECT totalTime FROM voiceTime WHERE userId = ?", usr.id, function (err, row) {
                if (err) {
                  console.error(err);
                  resolve(null);
                } else {
                  resolve(row);
                }
              });
            }));

          case 89:
            userTime = _context3.sent;
            timeSpentInVoice = userTime ? userTime.totalTime : 0;
            formattedTimeSpentInVoice = formatMilliseconds(timeSpentInVoice);
            _context3.next = 94;
            return regeneratorRuntime.awrap(Canvas.loadImage('https://i.imgur.com/XvHNDuP.png'));

          case 94:
            online = _context3.sent;
            ctx.drawImage(online, 702, 300, 65, 65);
            ctx.font = '42px Museo Cyrl 500';
            ctx.fillStyle = '#ffffff';
            ctx.fillText('Онлайн ГЧ', 782, 320);
            ctx.fillText(formattedTimeSpentInVoice, 782, 370);
            buffer = canvas.toBuffer();
            attachment = new AttachmentBuilder(buffer, {
              name: 'image.jpg'
            });
            _context3.next = 104;
            return regeneratorRuntime.awrap(interaction.editReply({
              files: [attachment]
            }));

          case 104:
            _context3.next = 209;
            break;

          case 106:
            _context3.next = 108;
            return regeneratorRuntime.awrap(interaction.deferReply());

          case 108:
            _width = 1080;
            _height = 620;
            _canvas = Canvas.createCanvas(_width, _height);
            _ctx = _canvas.getContext('2d');
            _context3.t4 = regeneratorRuntime;
            _context3.t5 = Canvas;
            _context3.next = 116;
            return regeneratorRuntime.awrap(getBGURL(interaction.user.id));

          case 116:
            _context3.t6 = _context3.sent;
            _context3.t7 = _context3.t5.loadImage.call(_context3.t5, _context3.t6);
            _context3.next = 120;
            return _context3.t4.awrap.call(_context3.t4, _context3.t7);

          case 120:
            _bg = _context3.sent;
            // Create linear gradient for the background
            // Draw the background with a glow effect
            _glowSize = 15;
            _glowColor = '#ffffff';

            _ctx.beginPath();

            _rectWidth = 1050;
            _rectHeight = 590;
            _rectX = 10;
            _rectY = 10;
            _cornerRadius = 20; // Draw the larger rounded rectangle with the glow effect

            _ctx.beginPath();

            _ctx.shadowColor = _glowColor;
            _ctx.shadowBlur = _glowSize;
            _ctx.shadowOffsetX = 0;
            _ctx.shadowOffsetY = 0;

            _ctx.moveTo(_rectX + _cornerRadius, _rectY);

            _ctx.lineTo(_rectX + _rectWidth - _cornerRadius, _rectY);

            _ctx.arcTo(_rectX + _rectWidth, _rectY, _rectX + _rectWidth, _rectY + _cornerRadius, _cornerRadius);

            _ctx.lineTo(_rectX + _rectWidth, _rectY + _rectHeight - _cornerRadius);

            _ctx.arcTo(_rectX + _rectWidth, _rectY + _rectHeight, _rectX + _rectWidth - _cornerRadius, _rectY + _rectHeight, _cornerRadius);

            _ctx.lineTo(_rectX + _cornerRadius, _rectY + _rectHeight);

            _ctx.arcTo(_rectX, _rectY + _rectHeight, _rectX, _rectY + _rectHeight - _cornerRadius, _cornerRadius);

            _ctx.lineTo(_rectX, _rectY + _cornerRadius);

            _ctx.arcTo(_rectX, _rectY, _rectX + _cornerRadius, _rectY, _cornerRadius);

            _ctx.closePath();

            _ctx.fill();

            _ctx.clip(); // Draw the image within the larger rounded rectangle


            _ctx.drawImage(_bg, _rectX, _rectY, _rectWidth, _rectHeight); // Load profile picture


            user = interaction.user.id;
            _member = interaction.member;
            _context3.next = 151;
            return regeneratorRuntime.awrap(Canvas.loadImage(_member.displayAvatarURL().replace('.webp', '.jpg')));

          case 151:
            _avatar = _context3.sent;
            // Draw rounded profile picture with a glow effect
            _profilePictureSize = 225;
            _profilePictureRadius = _profilePictureSize / 2;
            _profilePictureX = _width / 2 - _profilePictureRadius;
            _profilePictureY = _height / 2 - _profilePictureRadius;

            _ctx.beginPath();

            _ctx.arc(_width / 2, _height / 2, _profilePictureRadius + _glowSize, 0, 2 * Math.PI, false);

            _ctx.closePath();

            _ctx.shadowColor = _glowColor;
            _ctx.shadowBlur = _glowSize;
            _ctx.shadowOffsetX = 0;
            _ctx.shadowOffsetY = 0;

            _ctx.fill();

            _ctx.save();

            _ctx.beginPath();

            _ctx.arc(_width / 2, _height / 2, _profilePictureRadius, 0, 2 * Math.PI, false);

            _ctx.closePath();

            _ctx.clip();

            _ctx.drawImage(_avatar, _profilePictureX, _profilePictureY, _profilePictureSize, _profilePictureSize);

            _ctx.restore();

            _name = interaction.member.nickname ? interaction.member.nickname : interaction.user.username; // Draw user tag

            _ctx.font = '52px Museo Cyrl 500';
            _ctx.fillStyle = '#ffffff';
            _ctx.textAlign = 'center';
            _ctx.shadowColor = 'rgba(0, 0, 0, 185)';
            _ctx.shadowOffsetX = 2;
            _ctx.shadowOffsetY = 2;
            _ctx.shadowBlur = 8;

            _ctx.fillText("".concat(_name, "#").concat(interaction.user.discriminator), _width / 2, 105);

            _context3.next = 182;
            return regeneratorRuntime.awrap(getUserBalance(user));

          case 182:
            _userBalance = _context3.sent;
            _context3.next = 185;
            return regeneratorRuntime.awrap(Canvas.loadImage('https://i.imgur.com/zWhRE0w.png'));

          case 185:
            _wallet = _context3.sent;

            _ctx.drawImage(_wallet, 688, 190, 62, 49);

            _ctx.font = '42px Museo Cyrl 500';
            _ctx.fillStyle = '#ffffff';
            _ctx.textAlign = 'left';

            _ctx.fillText('Баланс', 768, 200);

            _ctx.fillText(_userBalance, 768, 250);

            _context3.next = 194;
            return regeneratorRuntime.awrap(new Promise(function (resolve) {
              db.get("SELECT totalTime FROM voiceTime WHERE userId = ?", user, function (err, row) {
                if (err) {
                  console.error(err);
                  resolve(null);
                } else {
                  resolve(row);
                }
              });
            }));

          case 194:
            _userTime = _context3.sent;
            _timeSpentInVoice = _userTime ? _userTime.totalTime : 0;
            _formattedTimeSpentInVoice = formatMilliseconds(_timeSpentInVoice);
            _context3.next = 199;
            return regeneratorRuntime.awrap(Canvas.loadImage('https://i.imgur.com/XvHNDuP.png'));

          case 199:
            _online = _context3.sent;

            _ctx.drawImage(_online, 702, 300, 65, 65);

            _ctx.font = '42px Museo Cyrl 500';
            _ctx.fillStyle = '#ffffff';

            _ctx.fillText('Онлайн ГЧ', 782, 320);

            _ctx.fillText(_formattedTimeSpentInVoice, 782, 370);

            _buffer = _canvas.toBuffer();
            _attachment = new AttachmentBuilder(_buffer, {
              name: 'image.jpg'
            });
            _context3.next = 209;
            return regeneratorRuntime.awrap(interaction.editReply({
              files: [_attachment]
            }));

          case 209:
          case "end":
            return _context3.stop();
        }
      }
    });
  }
};