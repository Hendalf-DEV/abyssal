const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./abyssdb.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) console.error(err.message);
    console.log('Подключение к базе данных успешно.');
});


db.serialize(() => {

    db.run(`CREATE TABLE IF NOT EXISTS voiceTime (
        userId TEXT PRIMARY KEY,
        totalTime INTEGER
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS users (
        userId TEXT PRIMARY KEY,
        balance INTEGER
    )`);


    db.run(`CREATE TABLE IF NOT EXISTS user_products (
        userId TEXT,
        productId TEXT,
        UNIQUE(userId, productId)
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS dailies (
        userId TEXT,
        lastClaim TEXT,
        UNIQUE(userId)
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS married (
        userId1 TEXT,
        userId2 TEXT,
        UNIQUE(userId1, userId2)
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS backgrounds (
        userId TEXT,
        background TEXT,
        backgroundURL TEXT,
        UNIQUE(userId)
    );`);


    db.run(`CREATE TABLE IF NOT EXISTS ranking (
        userId TEXT,
        xp INTEGER,
        level INTEGER
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS clans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clanName TEXT NOT NULL,
        leaderId TEXT NOT NULL,
        treasury INTEGER DEFAULT 0
    )`);

    db.run(`
    CREATE TABLE IF NOT EXISTS clan_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clan_id INTEGER,
        user_id TEXT,
        rank TEXT,
        FOREIGN KEY(clan_id) REFERENCES clans(id)
    )`);

    db.run(`
    CREATE TABLE IF NOT EXISTS clan_ranks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clan_id INTEGER NOT NULL,
        rank_name TEXT NOT NULL,
        permissions_bitmask INTEGER NOT NULL DEFAULT 0,
        rank_order INTEGER NOT NULL,
        FOREIGN KEY (clan_id) REFERENCES clans (id)
    )`);
})

module.exports = db;
