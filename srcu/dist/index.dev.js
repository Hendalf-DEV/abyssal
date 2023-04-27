"use strict";

var _require = require('discord.js'),
    Client = _require.Client,
    Collection = _require.Collection,
    Events = _require.Events,
    GatewayIntentBits = _require.GatewayIntentBits,
    REST = _require.REST,
    Routes = _require.Routes,
    ActivityType = _require.ActivityType;

var fs = require('node:fs');

var path = require('node:path');

require('dotenv').config();

var TOKEN = process.env['TOKEN'];
var GUILD = process.env['GUILD'];

var db = require('./database');

var client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildVoiceStates]
});
var commands = [];
client.commands = new Collection();
var foldersPath = path.join(__dirname, 'commands');
var commandFolders = fs.readdirSync(foldersPath);
var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
  for (var _iterator = commandFolders[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var folder = _step.value;
    var commandsPath = path.join(foldersPath, folder);
    var commandFiles = fs.readdirSync(commandsPath).filter(function (file) {
      return file.endsWith('.js');
    });
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = commandFiles[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var file = _step3.value;
        var filePath = path.join(commandsPath, file);

        var command = require(filePath);

        if ('data' in command && 'execute' in command) {
          commands.push(command.data.toJSON());
        } else {
          console.log("[WARNING] The command at ".concat(filePath, " is missing a required \"data\" or \"execute\" property."));
        }

        client.commands.set(command.data.name, command);
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
          _iterator3["return"]();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }
  }
} catch (err) {
  _didIteratorError = true;
  _iteratorError = err;
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator["return"] != null) {
      _iterator["return"]();
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError;
    }
  }
}

var eventsPath = path.join(__dirname, 'events');
var eventFiles = fs.readdirSync(eventsPath).filter(function (file) {
  return file.endsWith('.js');
});
var _iteratorNormalCompletion2 = true;
var _didIteratorError2 = false;
var _iteratorError2 = undefined;

try {
  var _loop = function _loop() {
    var file = _step2.value;
    var filePath = path.join(eventsPath, file);

    var event = require(filePath);

    if (event.once) {
      client.once(event.name, function () {
        return event.execute.apply(event, arguments);
      });
    } else {
      client.on(event.name, function () {
        return event.execute.apply(event, arguments);
      });
    }
  };

  for (var _iterator2 = eventFiles[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
    _loop();
  }
} catch (err) {
  _didIteratorError2 = true;
  _iteratorError2 = err;
} finally {
  try {
    if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
      _iterator2["return"]();
    }
  } finally {
    if (_didIteratorError2) {
      throw _iteratorError2;
    }
  }
}

client.once(Events.ClientReady, function () {
  console.log('Бот запущен');
  var totalUsers = 0;
  client.guilds.cache.forEach(function (guild) {
    totalUsers += guild.members.cache.filter(function (member) {
      return !member.user.bot;
    }).size;
  });
  client.user.setActivity("\u041D\u0430\u0431\u043B\u044E\u0434\u0430\u0435\u0442 \u0437\u0430 ".concat(totalUsers, " \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u0430\u043C\u0438"), {
    type: ActivityType.Watching
  });
  client.user.setPresence({
    status: "idle"
  });
  var CLIENT_ID = client.user.id;
  var rest = new REST({
    version: '9'
  }).setToken(TOKEN);

  (function _callee() {
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            if (!GUILD) {
              _context.next = 5;
              break;
            }

            _context.next = 4;
            return regeneratorRuntime.awrap(rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD), {
              body: commands
            }));

          case 4:
            console.log('Все команды были обновлены');

          case 5:
            _context.next = 10;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            if (_context.t0) console.error(_context.t0);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 7]]);
  })();
});
client.on(Events.VoiceStateUpdate, function _callee2(oldState, newState) {
  var userId, oldChannelId, newChannelId, userJoinTime, userLeaveTime, _userJoinTime, timeSpentInVoice;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          userId = newState.member.user.id;
          oldChannelId = oldState.channelId;
          newChannelId = newState.channelId;

          if (!oldChannelId && newChannelId) {
            console.log("voiceStateUpdate: ".concat(oldState, " | ").concat(newState)); // Пользователь подключился к голосовому каналу

            userJoinTime = Date.now();
            newState.member.user.voiceJoinTime = userJoinTime;
          } else if (oldChannelId && !newChannelId) {
            console.log("voiceStateUpdate: ".concat(oldState, " | ").concat(newState)); // Пользователь отключился от голосового канала

            userLeaveTime = Date.now();
            _userJoinTime = oldState.member.user.voiceJoinTime || userLeaveTime;
            timeSpentInVoice = userLeaveTime - _userJoinTime;
            db.run("INSERT OR IGNORE INTO voiceTime (userId, totalTime) VALUES (?, 0)", userId);
            db.run("UPDATE voiceTime SET totalTime = totalTime + ? WHERE userId = ?", [timeSpentInVoice, userId]);
          }

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
});
client.login(TOKEN);