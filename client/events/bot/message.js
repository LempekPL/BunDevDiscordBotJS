const Discord = require("discord.js");

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

    let userData = await client.dbConn.get("users", message.author.id);
    if (guildData.language.force) {

    }
}