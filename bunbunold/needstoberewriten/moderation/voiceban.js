let Discord = require("discord.js");

module.exports.info = {
    name: "voiceban",
    example: "`#PREFIX##COMMAND# <userid/mention/username>`",
    info: "Bans user from joining voice channels, shows list of them if no one was selected",
    tags: ["ban", "delete", "user", "moderation", "voice"],
    perms: "Move Members"
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname),message)) return;
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    if (!args[0]) {
        let voiceBans = await client.db.get("guilds", message.guild.id, "voiceBans");
        let ba = "";
        voiceBans.forEach(ban => {
            ba = ba + "<@" + ban + "> (" + client.users.cache.get(ban).tag + ")\n";
        });
        ba = !ba ? "none" : ba;
        let embed = new Discord.MessageEmbed();
        embed.setColor(ce);
        embed.setTitle(`Voice Banned`);
        embed.setDescription(`${ba}`);
        if (client.config.settings.subowners.length==0) {
            embed.setFooter("© "+client.users.cache.get(client.config.settings.ownerid).username, client.users.cache.get(client.config.settings.ownerid).avatarURL());
        } else {
            let owners = client.users.cache.get(client.config.settings.ownerid).username
            client.config.settings.subowners.forEach(sub => {
                owners+=` & ${client.users.cache.get(sub).username}`;
            });
            embed.setFooter("© "+owners, client.user.avatarURL());
        }
        embed.setTimestamp();
        message.channel.send(embed);
        return;
    }
    if (message.member.hasPermission("MOVE_MEMBERS") == true) {
        if (message.guild.member(client.user).hasPermission("MOVE_MEMBERS") == true) {
            client.util.searchUser(message, args[0], false).then(async user => {
                if (message.author.id == user.id) {
                    let embed = new Discord.MessageEmbed();
                    embed.setColor(ce);
                    embed.setTitle(`OK WHY?`);
                    embed.setDescription(`Why you want to voice ban yourself`);
                    if (client.config.settings.subowners.length==0) {
                        embed.setFooter("© "+client.users.cache.get(client.config.settings.ownerid).username, client.users.cache.get(client.config.settings.ownerid).avatarURL());
                    } else {
                        let owners = client.users.cache.get(client.config.settings.ownerid).username
                        client.config.settings.subowners.forEach(sub => {
                            owners+=` & ${client.users.cache.get(sub).username}`;
                        });
                        embed.setFooter("© "+owners, client.user.avatarURL());
                    }
                    embed.setTimestamp();
                    message.channel.send(embed);
                } else if (user.id == client.user.id) {
                    let embed = new Discord.MessageEmbed();
                    embed.setColor(ce);
                    embed.setTitle(`OK WHY?`);
                    embed.setDescription(`Why you want to voice ban me 😢`);
                    if (client.config.settings.subowners.length==0) {
                        embed.setFooter("© "+client.users.cache.get(client.config.settings.ownerid).username, client.users.cache.get(client.config.settings.ownerid).avatarURL());
                    } else {
                        let owners = client.users.cache.get(client.config.settings.ownerid).username
                        client.config.settings.subowners.forEach(sub => {
                            owners+=` & ${client.users.cache.get(sub).username}`;
                        });
                        embed.setFooter("© "+owners, client.user.avatarURL());
                    }
                    embed.setTimestamp();
                    message.channel.send(embed);
                }
                let member = message.guild.member(user);
                member.voice.kick();
                await client.db.get("guilds", message.guild.id, "voiceBans").then(async bans => {
                    if (!bans) bans = [];
                    bans.push(user.id);
                    await client.db.update('guilds', message.guild.id, 'voiceBans', bans);
                    let embeda = new Discord.MessageEmbed();
                    embeda.setColor(ce);
                    embeda.setTitle(`OK B20`);
                    embeda.setDescription(`${user.tag} have been voice banned`);
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