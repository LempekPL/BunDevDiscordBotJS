const Discord = require("discord.js");
const BotVersion = require("../../../package.json").version;

module.exports.info = {
    name: "help",
    tags: ["help", "?", "how", "how to", "info", "basic"]
}

module.exports.run = async (client, message, args) => {
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

    embed.setDescription(`Shown command amount: \`${totalCommands}\` | Prefix: \`${client.dbData.guilds.prefix}\` | Bot version: \`v${BotVersion}\``);
    embed.addField('\u200b', '\u200b');
    let randomHelpInfo = client.config.randomHelpInfo[Math.floor(Math.random() * client.config.randomHelpInfo.length)];
    embed.addField(`Random info`, `${randomHelpInfo.replace(/#PREFIX#/g,client.dbData.guilds.prefix).replace(/#BOT_USED#/g,client.dbData.bot.commands).replace(/#OWNERS#/g,ownerString(client))}`);
    client.util.footerEmbed(client, embed);
    message.channel.send({embeds:[embed]})
}

function ownerString(client) {
    if (client.config.settings.subOwnersIds.length === 0) {
        return `\`${client.users.cache.get(client.config.settings.ownerId).tag}\``;
    } else if (client.config.settings.subOwnersIds.length <= 4) {
        let owners = `\`${client.users.cache.get(client.config.settings.ownerId).tag}\``
        client.config.settings.subOwnersIds.forEach(sub => {
            owners += `, \`${client.users.cache.get(sub).tag}\``;
        });
        return owners;
    } else {
        return "many people";
    }
}