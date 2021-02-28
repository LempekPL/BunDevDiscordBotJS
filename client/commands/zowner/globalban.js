let Discord = require("discord.js");

module.exports.info = {
    name: "globalban",
    example: "`#PREFIX##COMMAND#`",
    info: "Bans/Unbans user from using this bot"
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname), message)) return;
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    if (message.author.id != client.config.settings.ownerid && !client.config.settings.subowners.includes(message.author.id)) return client.emit("uisae", "B99", message, "");
    if (!args[0]) {
        let gbans = await client.db.get("bot", client.user.id, "globalBans");
        var lista = "";
        for (i = 0; i < gbans.length; i++) {
            let banned = await client.util.searchUser(message, gbans[i], false);
            lista += await `${banned.tag} [${banned.id}]\n`;
        }
        return await message.channel.send(`\`\`\`css\n${lista}\n\`\`\``);
    }
    let user = await client.util.searchUser(message, args[0], false);
    if (message.author.id != client.config.settings.ownerid) return;
    if (!user && isNaN(Number(args[0]))) {
        message.channel.send("User not found");
    } else if (!user && !isNaN(Number(args[0]))) {
        message.channel.send("User not found, but adding the id");
        let gbans = await client.db.get("bot", client.user.id, "globalBans");
        if (gbans.includes(args[0])) {
            let newgbans = await gbans.filter(function (value) {
                return value != args[0];
            });
            await client.db.update("bot", client.user.id, "globalBans", newgbans);
            message.channel.send("This user now can use this bot");
        } else {
            await gbans.push(args[0]);
            await client.db.update("bot", client.user.id, "globalBans", gbans);
            message.channel.send("This user now can't use this bot");
        }
    } else {
        let gbans = await client.db.get("bot", client.user.id, "globalBans");
        if (gbans.includes(user.id)) {
            let newgbans = await gbans.filter(function (value) {
                return value != user.id;
            });
            await client.db.update("bot", client.user.id, "globalBans", newgbans);
            message.channel.send("This user now can use this bot");
        } else {
            await gbans.push(user.id);
            await client.db.update("bot", client.user.id, "globalBans", gbans);
            message.channel.send("This user now can't use this bot");
        }
    }
}