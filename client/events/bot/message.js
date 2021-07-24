const Discord = require("discord.js");

module.exports = async (client, message) => {
    if (message.author.bot) return;

    let guildData = await client.dbConn.get("guilds", message.guild.id);
    if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) {
        message.reply(`my prefix is \`${guildData.prefix}\``);
    }

    if (!message.content.startsWith(guildData.prefix)) return;

    const GlobalBans = await client.dbConn.getKey("bot", client.user.id, "globalBans");
    if (GlobalBans.length > 0 && GlobalBans.includes(message.author.id)) {
        client.util.globalBaned(message, client);
        return;
    }


    //client.lang =
}