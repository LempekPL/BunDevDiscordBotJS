const Discord = require('discord.js');
let setClearCache = new Map();
let cooldown = new Set();
const cacheDump = 60 * 60 * 1000;

module.exports = async (message, client) => {
    if (message.author.bot) return;

    let conn;
    if (!client.dbCache.guilds[message.guild.id] || !client.dbCache.users[message.author.id] || !client.dbCache.bot[client.user.id]) {
        conn = await new client.db.Conn().connect();
    }
    await checkCache(client, conn,"guilds", message.guild.id);

    let prefix = client.dbCache.guilds[message.guild.id].prefix;
    if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) {
        message.reply(`my prefix is \`${prefix}\``);
    }

    if (!message.content.startsWith(prefix)) return;

    await checkCache(client, conn,"users", message.author.id);
    await checkCache(client, conn,"bot", client.user.id);

    // return if globally banned
    let gbans = client.dbCache.bot[client.user.id].globalBans;
    if (gbans.length > 0) {
        if (gbans.includes(message.author.id)) {
            await client.util.gban(message, client);
            return;
        }
    }

    // load words to client
    let lang = client.dbCache.guilds[message.guild.id].language.force ? client.dbCache.guilds[message.guild.id].language : client.dbCache.users[message.author.id].language;
    lang = lang ?? {lang: "en", commands: "en"};
    client.words = require(`../../../lang/${lang.lang}.json`);
    client.wordsCom = require(`../../../lang/${lang.commands}.json`);

    // get args and check for command
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    args.shift().toLowerCase();
    let cmod = message.content.split(" ")[0];
    let commandFile = client.commands.get(client.commandMap.get(`${cmod.slice(prefix.length)}|${client.wordsCom.lang}`)) ?? client.commands.get(cmod.slice(prefix.length));
    if (!commandFile) return;

    // check for cooldown
    let slowmode = client.dbCache.guilds[message.guild.id].slowmode;
    if (cooldown.has(message.author.id)) {
        message.delete();
        message.reply(`you need to wait \`${Math.floor(slowmode / 60)}\`m \`${Math.floor(slowmode % 60)}\`s between commands.`).then(message => {
            message.delete({
                timeout: slowmode * 1000,
                reason: 'Autoremove'
            });
        });
        return;
    }

    // check if command is blocked
    let blocked = await client.util.blockCheck(client, message, commandFile.category)
    // run command
    if (!blocked) {
        await commandFile.run(client, message, args);

        let comCount = client.dbCache.bot[client.user.id].commands;
        let userCommand = client.dbCache.users[message.author.id].favCommands;
        await comCount++;
        userCommand[commandFile.info.name] ? userCommand[commandFile.info.name]++ : 1;

        // ignoring owners
        if (!(message.author.id === client.config.settings.ownerid || client.config.settings.subowners.includes(message.author.id))) {
            // ingnore cooldown for server administrators
            if (!message.member.hasPermission("ADMINISTRATOR")) {
                cooldown.add(message.author.id);
            }
            logCommand(client, message, comCount);
        }
    }

    // remove cooldown
    setTimeout(() => {
        cooldown.delete(message.author.id)
    }, slowmode * 1000)

    if (conn) {
        await conn.close();
    }
}

async function checkCache(client, conn, table, id) {
    let timeoutFromMap = setClearCache.get(id);
    if (timeoutFromMap) {
        setClearCache.delete(id);
        clearTimeout(timeoutFromMap)
    }
    if (client.dbCache[table][id]) {
        setClearCache.set(id, setTimeout(() => {
            client.dbCache[table][id] = null;
            setClearCache.delete(id);
            console.log("cleared")
        }, cacheDump));
        return;
    }
    let data = await conn.get(table, id);
    if (!data) {
        data = client.db.default.guilds
    }
    client.dbCache[table][id] = data;
    setClearCache.set(id, setTimeout(() => {
        client.dbCache[table][id] = null;
        setClearCache.delete(id);
        console.log("cleared")
    }, cacheDump));
}

async function logCommand(client, message, comCount) {
    let webhook = new Discord.WebhookClient(client.config.webhooks.all.split("/")[5], client.config.webhooks.all.split("/")[6]);
    let logCommandEmbed = new Discord.MessageEmbed;
    logCommandEmbed.setTitle(message.author.tag + " used command: " + command);
    logCommandEmbed.setDescription(message.content);
    logCommandEmbed.setColor('#ffff00')
    logCommandEmbed.setFooter("© Lempek", client.users.cache.get('249253855613812736').avatarURL);
    logCommandEmbed.addField("Server ID", message.guild.name + " (" + message.guild.id + ")");
    logCommandEmbed.addField("Channel ID", message.channel.name + " (" + message.channel.id + ")");
    logCommandEmbed.addField("Message ID", message.id);
    logCommandEmbed.addField("Message Created", message.createdAt);
    logCommandEmbed.addField("User Message Link", "https://discordapp.com/channels/" + message.guild.id + "/" + message.channel.id + "/" + message.id);
    logCommandEmbed.addField("Command", comCount);
    logCommandEmbed.addField("Message Owner", message.author.tag + " (" + message.author.id + ")");
    logCommandEmbed.setTimestamp();
    await webhook.send(loggen);
}