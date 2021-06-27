let Discord = require('discord.js');
let setClearCache = new Map();

module.exports = async (message, client) => {
    if (message.author.bot) return;

    await checkCache(client, message.guild.id, "guild");

    let prefix = client.dbCache.guilds[message.guild.id].prefix;
    if (!prefix) prefix = client.config.settings.prefix;
    if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) {
        message.reply("my prefix is `" + prefix + "`");
    }

    if (!message.content.startsWith(prefix)) return;

    await checkCache(client, message.author.id, "users");
    await checkCache(client, client.user.id, "bot");

    let gbans = client.dbCache.bot[client.user.id].globalBans;
    if (gbans.length > 0) {
        if (gbans.includes(message.author.id)) {
            await client.util.gban(message, client);
            return;
        }
    }


}

async function checkCache(client, id, table) {
    let conn = await new client.db.Conn().connect();
    let timeoutMap = setClearCache.get(id)
    if (timeoutMap) {
        setClearCache.delete(id);
        clearTimeout(timeoutMap)
    }
    if (!client.dbCache.guilds[id]) {
        client.dbCache.guilds[id] = await conn.getFull(table, id);
    }
    await conn.close();
    let timeout = setTimeout(()=>{ client.dbCache.guilds[id] = {}; setClearCache.delete(id); }, 60*60*1000);
    setClearCache.set(id, timeout);
}