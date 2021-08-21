const Config = require("../data/config.json");
const fetch = require("node-fetch");
const Discord = require("discord.js");
const fs = require("fs");

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
 * @param {boolean} [errorMessage=false] - If true it will send errorMessage if it finds one else it will just ignore error.
 * @returns {Promise<User>} - Discord User
 */
module.exports.searchUser = (client, message, stringToCheck = "", {
    returnAuthor = false,
    ignoreBots = true,
    allowChoose = false,
    multiServerSearch = false,
    multiServerChoose = false
} = {
    returnAuthor: false,
    ignoreBots: true,
    allowChoose: false,
    multiServerSearch: false,
    multiServerChoose: false
}, errorMessage = true) => {
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
        if (err !== "dont" && errorMessage) {
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
 * @param {string} type - Available types: `customString`, `customEmbed`, `guild`, `command`
 * @param {string} webhookUrl - Discord webhook link
 * @param data - Discord embed or string or data for command embed {user, message, sendMessageData, description} or data for command embed {guild, type = (`joined`/`left`)}
 */
module.exports.logger = async (type, webhookUrl, data) => {
    const webhook = new Discord.WebhookClient({url: webhookUrl});
    switch (type) {
        case "customString":
            await webhook.send({content: `${data}`})
            break;
        case "customEmbed":
            await webhook.send({embeds: [data]});
            break;
        case "guild":
            await webhook.send({embeds: [guildEmbedLog(data)]});
            break;
        case "command":
            await webhook.send({embeds: [commandEmbedLog(data)]});
            break;
    }
}

async function guildEmbedLog(guild, type) {
    let embed = new Discord.MessageEmbed();
    if (type === "joined") {
        embed.setColor("#00cc00");
        embed.setTitle(`Joined to server: ${guild.name} (${guild.id})`);
    } else if (type === "left") {
        embed.setColor("#cc0000");
        embed.setTitle(`Left the server: ${guild.name} (${guild.id})`);
    }
    const OwnerUser = await guild.fetchOwner();
    embed.setDescription(`Owner: ${OwnerUser.user.tag} (${OwnerUser.user.id}) \nALL Members: ${guild.memberCount} \nBots: ${guild.members.cache.filter(m => m.user.bot).size} \n\n\`${guild.iconURL()}\``);
    embed.setThumbnail(guild.iconURL());
    return embed;
}

function commandEmbedLog({client, message, messageData, title, description, thumbnail}) {
    let embed = new Discord.MessageEmbed();
    if (title) embed.setTitle(`${title}`);
    if (description) embed.setDescription(`${description}`);
    if (thumbnail) embed.setThumbnail(thumbnail);
    embed.setColor('#ff0000');
    embed.addField("Server", `${message.guild} (${message.guild.id})`);
    embed.addField("Channel", `${message.channel} (${message.channel.id})`);
    embed.addField("Message", message.id);
    embed.addField("Message created", `<t:${(message.createdTimestamp / 1000).toFixed(0)}:F>`);
    embed.addField("Message owner", `${message.author.tag} (${message.author.id})`);
    embed.addField("User message link", `https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`);
    if (messageData) embed.addField("Bot message link", `https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${messageData.id}`);
    if (client) embed.addField("Command", `${client.dbData.bot.commands}`);
    embed.setTimestamp();
    return embed;
}

// TODO: response.headers.get('x-ratelimit-remaining')
/**
 * obrazium.com api handler for images
 * @param client - Discord client
 * @param message - Discord message
 * @param {string} endpoint - api endpoint
 * @param {string} responseType - api response type: `buffer`, `json`
 * @param {string} inputTypes - input needed for api: `urlAvatar`, `urlImage`, `hex`, `text`, `urlAvatar+hex`, `urlImage+hex`, `decorational`
 * @param args - arguments
 */
module.exports.obraziumHandler = async (client, message, endpoint, responseType = "buffer", inputTypes, args) => {
    if (!client || !message || !endpoint) {
        throw new Error(`Client, message or endpoint not specified`);
    }
    let embed = new Discord.MessageEmbed();
    embed.setTitle(endpoint.charAt(0).toUpperCase() + endpoint.slice(1));
    embed.setColor(client.util.randomColor());
    embed.setFooter("obrazium.com");
    let urlArgs = "";
    let user;
    let urlToWebhookLog;
    switch (inputTypes) {
        case "urlAvatar":
            user = await client.util.searchUser(client, message, args, {
                returnAuthor: true,
                ignoreBots: false,
                allowChoose: true
            });
            if (!user) return;
            urlArgs = `?url=${user.avatarURL({format: "png", size: 1024})}`;
            urlToWebhookLog = user.avatarURL({format: "png", size: 1024});
            break;
        case "urlImage":
            urlArgs = `?url=${args}`;
            break;
        case "hex":
            urlArgs = `?hex=${args}`;
            break;
        case "text":
            urlArgs = `?text=${encodeURIComponent(args)}`;
            break;
        case "urlAvatar+hex":
            user = await client.util.searchUser(client, message, args[1], {
                returnAuthor: true,
                ignoreBots: false,
                allowChoose: true
            });
            if (!user) return;
            urlArgs = `?hex=${args[0]}&url=${user.avatarURL({format: "png", size: 1024})}`;
            urlToWebhookLog = user.avatarURL({format: "png", size: 1024});
            break;
        case "urlImage+hex":
            urlArgs = `?hex=${args[0]}&url=${args[1]}`;
            urlToWebhookLog = args[1];
            break;
        case "decorational":
            user = await client.util.searchUser(client, message, args, {ignoreBots: false});
            if (!user) return;
            embed.setDescription(`${message.author} ${client.lang[endpoint]} ${user}`);
            break;
    }
    let data = await requester(`https://obrazium.com/v1/${endpoint}${urlArgs}`, {Authorization: process.env.OBRAZIUM}, responseType);
    let messageData;
    if (responseType === "json") {
        embed.setDescription(`\`\`\`${data.text}\`\`\``)
        messageData = await message.channel.send({embeds: [embed]});
    } else if (responseType === "buffer") {
        await fs.writeFileSync(`${endpoint}.gif`, data);
        embed.setImage(`attachment://${endpoint}.gif`);
        messageData = await message.channel.send({
            embeds: [embed], files: [`./${endpoint}.gif`]
        });
        await fs.unlinkSync(`${endpoint}.gif`);
    }
    if (responseType === "buffer" && urlToWebhookLog) {
        await client.util.logger("command", process.env.WEBHOOK_IMAGE_COMMANDS, {
            client,
            user,
            message,
            messageData,
            title: `${user.tag} used \`${endpoint}\` endpoint`,
            description: `\`${urlToWebhookLog}\``,
            thumbnail: urlToWebhookLog
        });
    }
}

async function requester(requestUrl, headers, responseType = "buffer") {
    try {
        let response = await fetch(requestUrl, {
            method: "GET",
            headers
        });
        switch (responseType) {
            case "json":
                return await response.json();
            case "buffer":
                return await response.buffer();
        }
    } catch (e) {
        console.log(e)
    }
}

/**
 * Additional confirmation
 * @param client - Discord client
 * @param message - Discord message
 * @param {string} customMessage - Custom message to ask
 * @param {number} collectorTime - How long it collects messages
 * @param {Object.<string,function>} values - values to collect and then use function
 */
module.exports.additionalConfirmation = async (client, message, customMessage = "Are you sure you want to do it? Type `yes` to confirm, `cancel` to cancel. You have 30 seconds to decide", collectorTime = 30000, values) => {
    let askMessage = await message.channel.send(customMessage);
    let collector = message.channel.createMessageCollector({
        filter: m => m.author = message.author,
        time: collectorTime
    });
    collector.on("collect", async m => {
        if (m.content.toLowerCase().startsWith("cancel")) {
            collector.stop();
            return message.channel.send("Canceled ✅");
        }

        if (Object.keys(values).includes(m.content)) {
            values[m.content]();
            collector.stop();
        }
    });
    collector.on("end", () => {
        askMessage.delete();
    });
}

module.exports.globalBaned = (client, message) => {
    let embed = new Discord.MessageEmbed();
    embed.setTitle("Globalban");
    embed.setDescription("You can't use this bot\n Contact one of the owners to get unbanned");
    embed.setColor("RED");
    client.util.footerEmbed(client, embed);
    message.channel.send({embeds: [embed]})
}