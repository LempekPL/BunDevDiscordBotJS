let Discord = require('discord.js');
let cooldown = new Set();
let syncCooldown = new Set();
let syncDBCooldown = new Set();
let slowmode;

module.exports = async (message, client) => {
    if (message.author.bot) return;

    await checkCache(client, "guilds", message.guild.id);

    let prefix = client.dbCache.guilds[message.guild.id].prefix;
    if (!prefix) prefix = client.config.settings.prefix;
    if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) {
        message.reply("my prefix is `" + prefix + "`");
    }

    if (!message.content.startsWith(prefix)) return;

    await checkCache(client, "users", message.author.id);
    await checkCache(client, "bot", client.user.id);

    // bot global bans
    let gbans = client.dbCache.bot[client.user.id].globalBans;
    if (gbans.length > 0) {
        if (gbans.includes(message.author.id)) {
            await client.util.gban(message, client);
            return;
        }
    }

    // load words to client
    langu = client.dbCache.guilds[message.guild.id].language;
    lang = langu.force ? client.dbCache.guilds[message.guild.id].language : client.dbCache.users[message.author.id].language;
    client.words = client.util.langM(lang.lang);
    client.wordsCom = client.util.langM(lang.commands);

    // get args from message
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    args.shift().toLowerCase();
    let cmod = message.content.split(" ")[0];
    let commandfile = client.commands.get(client.commandMap.get(`${cmod.slice(prefix.length)}|${client.wordsCom.lang}`)) ? client.commands.get(client.commandMap.get(`${cmod.slice(prefix.length)}|${client.wordsCom.lang}`)) : client.commands.get(cmod.slice(prefix.length));
    if (!commandfile) return;

    slowmode = client.dbCache.guilds[message.guild.id].slowmode;
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
        loggen(client, message, comCount);
    }

    await checkDB(client, "guilds", message.guild.id);
    await checkDB(client, "users", message.author.id);
    await checkDB(client, "bot", client.user.id);

    // removing cooldown
    setTimeout(() => {
        cooldown.delete(message.author.id)
    }, slowmode * 1000)

}

async function checkCache(client, object, id) {
    if (!client.dbCache[object][id] || !syncCooldown.has(id) || client.forceCheck.has(id)) {
        await client.db.check(object, id);
        await client.db.syncCache(client, object, id);
        syncCooldown.add(id);
        setTimeout(() => {
            syncCooldown.delete(id)
        }, 60 * 1000)
    }
}

async function checkDB(client, object, id) {
    if (client.dbCache[object][id]) {
        await client.db.check(object, id);
        await client.db.syncDB(client, object, id);
    }
}

async function loggen(client, message, comCount) {
    let whook = new Discord.WebhookClient(client.config.webhooks.all.split("/")[5], client.config.webhooks.all.split("/")[6]);
    let loggen = new Discord.MessageEmbed;
    loggen.setTitle(message.author.tag + " used command: " + command);
    loggen.setDescription(message.content);
    loggen.setColor('#ffff00')
    loggen.setFooter("© Lempek", client.users.cache.get('249253855613812736').avatarURL);
    loggen.addField("Server ID", message.guild.name + " (" + message.guild.id + ")");
    loggen.addField("Channel ID", message.channel.name + " (" + message.channel.id + ")");
    loggen.addField("Message ID", message.id);
    loggen.addField("Message Created", message.createdAt);
    loggen.addField("User Message Link", "https://discordapp.com/channels/" + message.guild.id + "/" + message.channel.id + "/" + message.id);
    loggen.addField("Command", comCount);
    loggen.addField("Message Owner", message.author.tag + " (" + message.author.id + ")");
    loggen.setTimestamp();
    await whook.send(loggen);
}