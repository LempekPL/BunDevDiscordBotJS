const Discord = require("discord.js");

module.exports.info = {
    name: "help",
    tags: ["help", "?", "how", "how to", "info", "basic"]
}

module.exports.run = async (client, message, args) => {
    if (!args[0]) {
        helpMenuFull(client, message);
    } else {
        helpInfo(client, message, args)
    }
}

function helpMenuFull(client, message) {
    let embed = new Discord.MessageEmbed();
    embed.setColor(client.util.randomColor());
    embed.setAuthor(`${client.user.username} commands`, client.user.avatarURL());
    let categoryMap = new Map();
    let totalCommands = 0;
    client.commands.each(command => {
        if (command.category === "owner" && message.author.id !== client.config.settings.ownerId && !client.config.settings.subOwnersIds.includes(message.author.id)) return;
        totalCommands++;
        if (categoryMap.has(command.category)) {
            let tempCom = categoryMap.get(command.category);
            categoryMap.set(command.category, `${tempCom}, \`${client.langCom[command.info.name]?.default ?? command.info.name}\``);
        } else {
            categoryMap.set(command.category, `\`${command.info.name}\``);
        }
    });
    for (const element of require("../../../data/helpCategoriesOrder.json")) if (categoryMap.has(element)) {
        embed.addField(element, categoryMap.get(element))
    }

    embed.setDescription(`Shown command amount: \`${totalCommands}\` | Prefix: \`${client.dbData.guilds.prefix}\` | Bot version: \`v${require("../../../package.json").version}\``);
    embed.addField('\u200b', '\u200b');

    const HelpInfos = require(`../../../langs/${client.dbData.guilds.language.force ? client.dbData.guilds.language.main : client.dbData.users.language.main}/helpInfo.json`);
    if (HelpInfos.length > 0) {
        let randomHelpInfo = HelpInfos[Math.floor(Math.random() * HelpInfos.length)];
        embed.addField(`Random info`, `${randomHelpInfo
            .replaceAll(/#PREFIX#/g, client.dbData.guilds.prefix)
            .replaceAll(/#BOT_USED#/g, client.dbData.bot.commands)
            .replaceAll(/#OWNERS#/g, client.util.ownerString(client))
            .replaceAll(/#TRANSLATON_CREATORS#/g,
                (() => {
                    let translationCreatorsList = "";
                    client.lang.translationCreators.forEach(user => {
                        translationCreatorsList += (translationCreatorsList === "" ? client.users.cache.get(user).tag : `, ${client.users.cache.get(user).tag}`);
                    })
                    return translationCreatorsList;
                })()
            )}`);
    }
    client.util.footerEmbed(client, embed);
    message.channel.send({embeds: [embed]})
}

function helpInfo(client, message, args) {
    const commandFile = client.commands.get(client.commandMap.get(`${args[0]}|${client.dbData.guilds.language.force ? client.dbData.guilds.language.commands : client.dbData.users.language.commands}`)) ?? client.commands.get(args[0]);
    if (!commandFile) return;
    const DefCommandInfo = require(`../../../langs/en/commandInfo.json`)[commandFile.info.name];
    const SetCommandInfo = require(`../../../langs/${client.dbData.guilds.language.force ? client.dbData.guilds.language.main : client.dbData.users.language.main}/commandInfo.json`)[commandFile.info.name];
    const commandInfo = {...DefCommandInfo, ...SetCommandInfo};
    let embed = new Discord.MessageEmbed();
    embed.setColor(client.util.randomColor());
    embed.setAuthor(`${client.user.username} [${commandFile.info.name}] command`, client.user.avatarURL());
    embed.addField("Category", commandFile.category, true);
    embed.addField("Blocked status", `Server: \`unlocked\`\nUser: \`unlocked\``, true);
    embed.addField("Used by you", `\`${client.dbData.users.favouriteCommands[commandFile.info.name] ?? 0}\` times`, true);
    embed.addField("Examples", commandInfo?.example?.replaceAll(/#PREFIX#/g, client.dbData.guilds.prefix).replaceAll(/#COMMAND#/g, commandFile.info.name) ?? `${client.dbData.guilds.prefix}${commandFile.info.name}`);
    const aliases = (client.langCom[commandFile.info.name]?.default != null ? client.langCom[commandFile.info.name].default : commandFile.info.name) + (client.langCom[commandFile.info.name]?.aliases?.length > 0 ? `, ${client.langCom[commandFile.info.name].aliases.join(", ")}` : "")
    embed.addField("Aliases", aliases);
    embed.addField("Info", commandInfo.explanation ?? "Test and see.");
    embed.addField("User permissions", `${commandInfo?.userPerms ? commandInfo.userPerms + ", " : ""} SEND_MESSAGES`, true);
    embed.addField("Bot permissions", `${commandInfo?.botPerms ? commandInfo.botPerms + ", " : ""} SEND_MESSAGES`, true);
    if (!commandInfo?.example) {
        embed.setDescription("Following data is not 100% verified. Report this to owners of this bot.")
    }
    client.util.footerEmbed(client, embed);
    message.channel.send({embeds: [embed]})
}