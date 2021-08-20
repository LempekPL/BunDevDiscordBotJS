let Discord = require("discord.js");

module.exports.info = {
    name: "globalban",
    tags: ["owner"]
}

module.exports.run = async (client, message, args) => {
    if (message.author.id !== client.config.settings.ownerId && !client.config.settings.subOwnersIds.includes(message.author.id)) return client.emit("uisae", "B99", message, "");
    if (!args[0]) {
        var list = "";
        for (let i = 0; i < client.dbData.bot.globalBans.length; i++) {
            let banned = await client.util.searchUser(client, message, client.dbData.bot.globalBans[i], {returnAuthor: false, multiServerSearch: true}, false);
            if (!banned) {
                list += `\`username not found\` [${client.dbData.bot.globalBans[i]}]\n`;
            } else {
                list += `${banned.tag} [${banned.id}]\n`;
            }
        }
        return await message.channel.send(`\`\`\`css\n${list}\n\`\`\``);
    }
    let user = await client.util.searchUser(client, message, args[0], {returnAuthor: false, allowChoose: true}, false);
    if (!user) {
        message.channel.send("User not found, but using user id");
        if (isNaN(Number(args[0]))) return;
        if (client.dbData.bot.globalBans.includes(args[0])) {
            client.dbData.bot.globalBans = await client.dbData.bot.globalBans.filter((value) => {
                return value !== args[0];
            });
            message.channel.send("This user now can use this bot");
        } else {
            client.dbData.bot.globalBans.push(args[0]);
            message.channel.send("This user now can't use this bot");
        }
    } else {
        if (client.dbData.bot.globalBans.includes(user.id)) {
            client.dbData.bot.globalBans = await client.dbData.bot.globalBans.filter((value) => {
                return value !== user.id;
            });
            message.channel.send("This user now can use this bot");
        } else {
            client.dbData.bot.globalBans.push(user.id);
            message.channel.send("This user now can't use this bot");
        }
    }
}