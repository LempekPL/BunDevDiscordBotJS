const Discord = require('discord.js');
let setClearCache = new Map();
let cooldown = new Set();

module.exports = async (message, client) => {
    if (message.author.bot) return;

    await checkCache(client, message.guild.id, "guilds");

    let prefix = client.dbCache.guilds[message.guild.id].prefix ?? client.db.default.guilds.prefix;
    if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) {
        message.reply("my prefix is `" + prefix + "`");
    }

    if (!message.content.startsWith(prefix)) return;

    await checkCache(client, message.author.id, "users");
    await checkCache(client, client.user.id, "bot");

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
    let commandfile = client.commands.get(client.commandMap.get(`${cmod.slice(prefix.length)}|${client.wordsCom.lang}`)) ? client.commands.get(client.commandMap.get(`${cmod.slice(prefix.length)}|${client.wordsCom.lang}`)) : client.commands.get(cmod.slice(prefix.length));
    if (!commandfile) return;

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
    let blocked = client.util.blockCheck(client, message, commandfile.category)
    // run command
    if (!blocked) {
        await commandfile.run(client, message, args);

        let comCount = client.dbCache.bot[client.user.id].commands;
        let userCommand = client.dbCache.users[message.author.id].favCommands;
        await comCount++;
        userCommand[commandfile.info.name] ? userCommand[commandfile.info.name]++ : 1;

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
}

async function checkCache(client, id, table) {
    let conn = await new client.db.Conn().connect();
    let timeoutMap = setClearCache.get(id)
    if (timeoutMap) {
        setClearCache.delete(id);
        clearTimeout(timeoutMap)
    }
    if (!client.dbCache[table][id]) {
        let data = await conn.get(table, id);
        if (!data) {
            data = client.db.default.guilds
        }
        client.dbCache[table][id] = data;
    }
    await conn.close();
    let timeout = setTimeout(() => {
        client.dbCache[table][id] = {};
        setClearCache.delete(id);
    }, 60 * 60 * 1000);
    setClearCache.set(id, timeout);
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