const Discord = require("discord.js");
const cooldown = new Map();

module.exports = async (client, message) => {
    if (message.author.bot) return;

    let guildData = await client.dbConn.get("guilds", message.guild.id);
    if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) {
        message.reply(`my prefix is \`${guildData.prefix}\``);
    }

    if (!message.content.startsWith(guildData.prefix)) return;

    let botData = await client.dbConn.get("bot", client.user.id);
    if (botData.globalBans.length > 0 && botData.globalBans.includes(message.author.id)) {
        client.util.globalBaned(message, client);
        return;
    }

    // check for cooldown
    let cooldownUser = cooldown.get(message.author.id)
    if (cooldownUser) {
        if (message.guild.me.hasPermission("MANAGE_MESSAGES")) {
            message.delete();
        }
        let gap = cooldownUser.getTime() - Date.now();
        message.reply(`you need to wait \`${Math.floor(gap / 60000)}\`m \`${Math.floor((gap % 60000) / 1000)}\`s to use this bot again.`).then(message => {
            message.delete({
                timeout: gap,
                reason: 'Autoremove'
            });
        });
        return;
    }

    let userData = await client.dbConn.get("users", message.author.id);
    // set language
    let defaultLang = require(`../../../langs/en/all.json`);
    let setLang, comLang;
    if (guildData.language.force) {
        setLang = require(`../../../langs/${guildData.language.main}/all.json`);
        comLang = guildData.language.main;
    } else {
        setLang = require(`../../../langs/${userData.language.main}/all.json`);
        comLang = userData.language.main;
    }
    client.lang = {...defaultLang, ...setLang};

    // filter arguments and search for command in client
    let args = message.content.slice(guildData.prefix.length).trim().split(/ +/g);
    args.shift().toLowerCase();
    let prefixCommand = message.content.split(" ")[0];
    let commandFile = client.commands.get(client.commandMap.get(`${prefixCommand.slice(guildData.prefix.length)}|${comLang}`)) ?? client.commands.get(prefixCommand.slice(guildData.prefix.length));
    if (!commandFile) return;

    client.dbData = {"guilds": guildData, "users": userData, "bot": botData}
    await commandFile.run(client, message, args);

    // ignoring cooldown and logging command for bot owners
    if (!(message.author.id === client.config.settings.ownerid || client.config.settings.subowners.includes(message.author.id))) {
        // ingnore cooldown for server administrators
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            let cooldownDate = new Date(Date.now() + guildData.slowmode * 1000);
            cooldown.set(message.author.id, cooldownDate);
        }
        // logCommand(client, message, comCount);
    }

    setTimeout(() => {
        cooldown.delete(message.author.id)
    }, guildData.slowmode * 1000)
}