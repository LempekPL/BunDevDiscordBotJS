let Discord = require("discord.js");

module.exports.info = {
    name: "voiceunban",
    example: "`#PREFIX##COMMAND# <userid/mention/username>`",
    info: "Unbans user from joining voice channels",
    tags: ["ban", "delete", "user", "moderation", "voice"],
    perms: "Move Members"
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname),message)) return;
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    if (!args[0]) return client.emit("uisae", "U04", message, "");
    if (message.member.hasPermission("MOVE_MEMBERS") == true) {
        if (message.guild.member(client.user).hasPermission("MOVE_MEMBERS") == true) {
            client.util.searchUser(message, args[0], false).then(async user => {
                let zn = false;
                await client.db.get("guilds",message.guild.id,"voiceBans").then(async bans => {
                    if (!bans || bans.length == 0) return client.emit("uisae", "B01", message, "There are no voice banned users");
                    bans.forEach(async (id, i) => {
                        if (id != user.id) return;
                        zn = true;
                        bans.splice(i, 1);
                        await client.db.update('guilds', message.guild.id, 'voiceBans', bans);
                        let embeda = new Discord.MessageEmbed();
                        embeda.setColor(ce);
                        embeda.setTitle(`OK B20`);
                        embeda.setDescription(`${user.tag} have been voice unbanned`);
                        if (client.config.settings.subowners.length==0) {
                            embeda.setFooter("© "+client.users.cache.get(client.config.settings.ownerid).username, client.users.cache.get(client.config.settings.ownerid).avatarURL());
                        } else {
                            let owners = client.users.cache.get(client.config.settings.ownerid).username
                            client.config.settings.subowners.forEach(sub => {
                                owners+=` & ${client.users.cache.get(sub).username}`;
                            });
                            embeda.setFooter("© "+owners, client.user.avatarURL());
                        }
                        embeda.setTimestamp();
                        message.channel.send(embeda);
                    });
                    if (!zn) {
                        client.emit("uisae", "B04", message, "");
                    }
                });
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