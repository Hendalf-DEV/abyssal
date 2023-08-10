"use strict";

var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('./abyssdb.db');
db.run("CREATE TABLE IF NOT EXISTS voiceTime (\n    userId TEXT PRIMARY KEY,\n    totalTime INTEGER\n)");
db.run("CREATE TABLE IF NOT EXISTS users (\n    userId TEXT PRIMARY KEY,\n    balance INTEGER\n)");
db.run("CREATE TABLE IF NOT EXISTS user_products (\n    userId TEXT,\n    productId TEXT,\n    UNIQUE(userId, productId)\n);");
db.run("CREATE TABLE IF NOT EXISTS married (\n    userId1 TEXT,\n    userId2 TEXT,\n    UNIQUE(userId1, userId2)\n);");
db.run("CREATE TABLE IF NOT EXISTS clans (\n    clanId INTEGER PRIMARY KEY AUTOINCREMENT,\n    name TEXT,\n    leaderId TEXT,\n    treasury INTEGER\n)");
db.run("CREATE TABLE IF NOT EXISTS clan_members (\n    userId TEXT,\n    clanId INTEGER,\n    rank TEXT,\n    FOREIGN KEY(clanId) REFERENCES clans(clanId),\n    UNIQUE(userId, clanId)\n);");
db.run("CREATE TABLE IF NOT EXISTS backgrounds (\n    userId TEXT,\n    background TEXT,\n    backgroundURL TEXT,\n    UNIQUE(userId)\n);");
module.exports = db;