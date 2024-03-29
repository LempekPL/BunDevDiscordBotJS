const coolDown = new Map();

module.exports = async (client, message) => {
    if (message.author.bot) return;

    let [guildData, botData, userData] = await getData(client, message);
    if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) {
        message.reply(`my prefix is \`${guildData.prefix}\``);
    }

    if (!message.content.startsWith(guildData.prefix)) return;

    // check if user is globally banned
    if (botData.globalBans.length > 0 && botData.globalBans.includes(message.author.id)) {
        client.util.globalBaned(client, message);
        return;
    }

    // check if user has coolDown
    let cooldownUser = coolDown.get(message.author.id);
    if (cooldownUser) {
        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) {
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

    // set language
    let defaultLang = require(`../../../web/public/lang/en/all.json`);
    let defaultLangCom = require(`../../../web/public/lang/en/commandExclusive.json`);
    let setLang, comLang, setLangCom;
    if (guildData.language.force) {
        setLang = require(`../../../web/public/lang/${guildData.language.main}/all.json`);
        setLangCom = require(`../../../web/public/lang/${guildData.language.main}/commandExclusive.json`);
        comLang = guildData.language.main;
    } else {
        setLang = require(`../../../web/public/lang/${userData.language.main}/all.json`);
        setLangCom = require(`../../../web/public/lang/${userData.language.main}/commandExclusive.json`);
        comLang = userData.language.main;
    }
    client.lang = {...defaultLang, ...setLang};
    client.langCom = {...defaultLangCom, ...setLangCom};

    // filter arguments and search for command in client
    let args = message.content.slice(guildData.prefix.length).trim().split(/ +/g);
    let command = args.shift().toLowerCase();
    let commandFile = client.commands.get(client.commandMap.get(`${command}|${comLang}`)) ?? client.commands.get(command);
    if (!commandFile) return;

    botData.commands++;
    userData.favouriteCommands[commandFile.info.name] = isNaN(userData.favouriteCommands[commandFile.info.name]) ? 1 : userData.favouriteCommands[commandFile.info.name] + 1;

    client.dbData = {"guilds": guildData, "users": userData, "bot": botData}
    try {
        await commandFile.run(client, message, args);
    } catch (error) {
        console.error(error)
        client.emit("uisae", "B01", message, `Report this to bot owners!!!\n${error}`)
    }
    await updateData(client, message);

    // ignore coolDown for server administrators and for bot owners
    if (!message.member.permissions.has("ADMINISTRATOR") && message.author.id !== client.config.settings.ownerId && !client.config.settings.subOwnersIds.includes(message.author.id)) {
        let cooldownDate = new Date(Date.now() + guildData.slowmode * 1000);
        coolDown.set(message.author.id, cooldownDate);
    }

    // delete coolDown
    setTimeout(() => {
        coolDown.delete(message.author.id)
    }, guildData.slowmode * 1000);

    //logging command
    await logCommand(client, message);
}

const logCommand = async (client, message) => {
    await client.util.logger("command", process.env.WEBHOOK_ALL_COMMANDS, {
        client,
        message,
        title: `${message.author.tag} sent \`${message.content.slice(client.dbData.guilds.prefix.length).trim().split(/ +/g)[0]}\` command`,
        description: `**Message content:**\n\`${message.content}\``
    });
}

const getData = async (client, message) => {
    let guildData = client.dbConn.get("guilds", message.guild.id);
    let botData = client.dbConn.get("bot", client.user.id);
    let userData = client.dbConn.get("users", message.author.id);
    return Promise.all([guildData, botData, userData])
}

const updateData = async (client, message) => {
    let guildUpdated = await client.dbConn.update("guilds", message.guild.id, client.dbData.guilds);
    let botUpdated = await client.dbConn.update("bot", client.user.id, client.dbData.bot);
    let userUpdated = await client.dbConn.update("users", message.author.id, client.dbData.users);
    await Promise.all([guildUpdated, botUpdated, userUpdated])
}