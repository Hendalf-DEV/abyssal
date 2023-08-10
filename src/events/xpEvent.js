const { Events } = require('discord.js');
const db = require('../database');

const LEVEL_FACTOR = 100;
const XP_DELAY = 25000;

function calculateRequiredXP(level) {
    let rawXP;

    if (level < 5) {
        rawXP = LEVEL_FACTOR * 1.2 ** level;
    } else if (level >= 5 && level < 10) {
        rawXP = LEVEL_FACTOR * 1.3 ** level;
    } else if (level >= 10) {
        rawXP = LEVEL_FACTOR * 1.5 ** level;
    }

    return Math.round(rawXP);
}


const userCooldowns = new Map();

async function updateUserRank(userId, xpToAdd) {
    const { getUserRank } = require('../commands/fun/rank.js')
    const userRank = await getUserRank(userId);
    let newLevel;
    let newXP;
    let xpRequired;

    if (userRank) {
        newXP = userRank.xp + xpToAdd;
        newLevel = userRank.level;

        // eslint-disable-next-line no-constant-condition
        while (true) {
            xpRequired = calculateRequiredXP(newLevel);

            if (newXP >= xpRequired) {
                newXP = Math.floor(newXP - xpRequired);
                newLevel++;
            } else {
                break;
            }
        }

        db.run('UPDATE ranking SET xp = ?, level = ? WHERE userId = ?', [newXP, newLevel, userId]);
    } else {
        newXP = xpToAdd;
        newLevel = 0;

        // eslint-disable-next-line no-constant-condition
        while (true) {
            xpRequired = calculateRequiredXP(newLevel);

            if (newXP >= xpRequired) {
                newXP = Math.floor(newXP - xpRequired);
                newLevel++;
            } else {
                break;
            }
        }

        db.run('INSERT INTO ranking (userId, xp, level) VALUES (?, ?, ?)', [userId, newXP, newLevel]);
    }
}

function getRandomXP() {
    const weights = [
        { value: 5, weight: 0.3 },
        { value: 10, weight: 0.25 },
        { value: 15, weight: 0.2 },
        { value: 20, weight: 0.15 },
        { value: 25, weight: 0.1 },
    ];

    const totalWeight = weights.reduce((acc, curr) => acc + curr.weight, 0);
    let random = Math.random() * totalWeight;
    let weightSum = 0;

    for (const { value, weight } of weights) {
        weightSum += weight;
        if (random <= weightSum) {
            return Math.round(value);
        }
    }
}


module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;
    
        if (userCooldowns.has(message.author.id)) {
            return;
        }
    
        await updateUserRank(message.author.id, getRandomXP());
    
        userCooldowns.set(message.author.id, true);
        setTimeout(() => {
            userCooldowns.delete(message.author.id);
        }, XP_DELAY);
    },
    calculateRequiredXP
};
