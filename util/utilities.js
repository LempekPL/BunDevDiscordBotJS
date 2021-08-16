const Config = require("../data/config.json");

/**
 * Search for user
 * @param client - Discord client
 * @param message - Discord message
 * @param {string} [stringToCheck] - String to search for user
 * @param {Object} options - Options
 * @param {boolean} [options.returnAuthor=false] - If true it will return message author if it won't find any user.
 * @param {boolean} [options.ignoreBots=true] - If true it will ignore bots.
 * @param {boolean} [options.allowChoose=false] - If true it will allow you to choose users.
 * @param {boolean} [options.multiServerSearch=false] - If true it will search for user in every server.
 * @param {boolean} [options.multiServerChoose=false] - If true it will allow you to choose users from every server.
 * @returns {Promise<User>} - Discord User
 */
module.exports.searchUser = (client, message, stringToCheck = "", {
    returnAuthor = false,
    ignoreBots = true,
    allowChoose = false,
    multiServerSearch = false,
    multiServerChoose = false
}) => {
    // TODO: add addtional check if user is private or restricted
    if (!client || !message) {
        throw new Error(`${!client ? `${!message ? `Client and message` : `Client`}` : `Message`} not specified`);
    }
    let returning = new Promise(async (resolve, reject) => {
        // check for mentions
        if (message.mentions.users.first()) {
            if (ignoreBots && message.mentions.users.first().bot) {
                if (returnAuthor) {
                    return resolve(message.author);
                }
                return reject("found user is a bot");
            }
            return resolve(message.mentions.users.first())
        }
        // check if stringToCheck has data
        if (!stringToCheck) {
            if (returnAuthor) {
                return resolve(message.author);
            }
            return reject("user not found");
        }
        // check for user in guild using id or if multiServerSearch is true then check everywhere for user using id
        if (message.guild.members.cache.get(stringToCheck) !== undefined || (multiServerSearch && client.users.cache.get(stringToCheck) !== undefined)) {
            if (ignoreBots && (client.users.cache.get(stringToCheck).bot || stringToCheck === "662484808416362499")) {
                if (returnAuthor) {
                    return resolve(message.author);
                }
                return reject("found user is a bot");
            }
            return resolve(client.users.cache.get(stringToCheck))
        }
        // check for user using username, if multiServerSearch is true then check for them too
        let users = new Map();
        let usersWereBots = false;
        let collection = multiServerSearch && multiServerChoose ? client.users.cache : message.guild.members.cache;
        for (const member of collection) {
            let user = multiServerSearch && multiServerChoose ? member[1] : member[1].user;
            if (user.username.toLowerCase().includes(stringToCheck.toLowerCase())) {
                if (!(ignoreBots && user.bot)) {
                    users.set(user.tag, user);
                }
                if (ignoreBots && user.bot) {
                    usersWereBots = true;
                }
            }
        }
        switch (users.size) {
            case 0:
                if (returnAuthor) {
                    return resolve(message.author);
                }
                return reject(ignoreBots && usersWereBots ? "found users are bots" : "user not found");
            case 1:
                return resolve(users.entries().next().value[1]);
            default:
                if (!allowChoose) {
                    resolve(users.entries().next().value[1])
                    break;
                }
                let userList = []
                for (const user of users[Symbol.iterator]()) {
                    userList.push(user[0]);
                }
                let mesAsk = await message.channel.send(`${client.lang.replyWith}: \`${userList.join("`, `")}\` ${client.lang.or} \`cancel\`. You have 20 seconds.`)
                let collector = await message.channel.createMessageCollector({
                    filter: m => m.author === message.author,
                    time: 20000
                });
                collector.on("collect", async m => {
                    if (userList.includes(m.content)) {
                        collector.stop();
                        if (m.guild.me.permissions.has("MANAGE_MESSAGES")) {
                            m.delete();
                        }
                        return resolve(users.get(m.content));
                    }
                    if (m.content === "cancel") {
                        collector.stop();
                        if (m.guild.me.permissions.has("MANAGE_MESSAGES")) {
                            m.delete();
                        }
                        return reject("dont")
                    }
                });
                collector.on("end", () => {
                    mesAsk.delete()
                    setTimeout(() => {
                        return reject("dont")
                    }, 5000)
                });
                break;
        }
    });
    return returning.catch((err) => {
        if (err !== "dont") {
            client.emit("uisae", "U04", message, err);
        }
    });
}

/**
 * Returns random color
 * @returns {(string|Array<number>)} - Array with random values [R, G, B] or random string from config.json
 */
module.exports.randomColor = () => {
    if (Config.randomColors.length !== 0) {
        let i = Math.floor(Math.random() * Config.randomColors.length);
        return Config.randomColors[i];
    }
    const R = Math.floor(Math.random() * 256);
    const G = Math.floor(Math.random() * 256);
    const B = Math.floor(Math.random() * 256);
    return [R, G, B];
}

/**
 * Creates footer for embed, no return
 * @param client - Discord client
 * @param embed - Discord embed
 */
module.exports.footerEmbed = (client, embed) => {
    if (!client || !embed) {
        throw new Error(`${!client ? `${!embed ? `Client and embed` : `Client`}` : `Embed`} not specified`);
    }
    if (Config.settings.subOwnersIds.length === 0) {
        embed.setFooter("© " + client.users.cache.get(Config.settings.ownerId).username, client.users.cache.get(Config.settings.ownerId).avatarURL());
    } else if (Config.settings.subOwnersIds.length <= 2) {
        let owners = client.users.cache.get(Config.settings.ownerId).username
        Config.settings.subOwnersIds.forEach(sub => {
            owners += ` & ${client.users.cache.get(sub).username}`;
        });
        embed.setFooter("© " + owners, client.user.avatarURL());
    } else {
        embed.setFooter(client.bot.tag, client.user.avatarURL());
    }
    embed.setTimestamp();
}

/**
 * Returns owners of this bot
 * @param client - Discord client
 * @param {string} type - Available types: tag - "Lempek#7376", username - "Lempek", discriminator - "7376"
 * @param {number} limit - Amount of max returned owners, if there are more owners than limit then it will return "many people"
 * @returns {string} - String with owners
 */
module.exports.ownerString = (client, type = "tag", limit = 4) => {
    if ((type !== "tag" && type !== "username" && type !== "discriminator") || limit <= 0) {
        return "many people"
    }
    if (client.config.settings.subOwnersIds.length === 0) {
        return `\`${client.users.cache.get(client.config.settings.ownerId)[type]}\``;
    } else if (client.config.settings.subOwnersIds.length <= limit) {
        let owners = `\`${client.users.cache.get(client.config.settings.ownerId)[type]}\``
        client.config.settings.subOwnersIds.forEach(sub => {
            owners += `, \`${client.users.cache.get(sub)[type]}\``;
        });
        return owners;
    } else {
        return client.lang.manyPeople;
    }
}

/**
 * Sends a logging webhook message
 * @param client - Discord client
 * @param message - Discord embed
 * @param webhook - Discord webhook link
 * @param {String} data - Data to send
 */
module.exports.logger = (client, message, webhook, data) => {

}

// other utilities
module.exports.globalBaned = (client) => {

}

