let Discord = require("discord.js");

module.exports.info = {
    name: "voicekick",
    aliases: ["kickvoice"],
    example: "`#PREFIX##COMMAND# <userid/mention/username>`",
    info: "Kicks user from voice channel",
    tags: ["kick","voice","user","moderation"],
    perms: "Move Members"
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname),message)) return;
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    if (!args[0]) return client.emit("uisae", "U04", message, "");
    if (message.member.hasPermission("MOVE_MEMBERS") == true) {
        if (message.guild.member(client.user).hasPermission("MOVE_MEMBERS") == true) {
            client.util.searchUser(message, args[0], false).then(user => {
                let member = message.guild.member(user);
                member.voice.kick();
                message.react('✅');
            }).catch(() => {
                client.emit("uisae", "B04", message, "");
            });

        } else {
            client.emit("uisae", "B03", message, "");
        }
    } else {
        client.emit("uisae", "U03", message, "");
    }
}