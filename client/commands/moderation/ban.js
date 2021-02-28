let Discord = require("discord.js");

module.exports.info = {
    name: "ban",
    aliases: ["banhammer"],
    example: "`#PREFIX##COMMAND# <userid/mention/username>`",
    info: "Bans user from the server",
    tags: ["ban","hammer","delete","user","moderation"],
    perms: "Ban Members"
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname),message)) return;
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    if (!args[0]) return client.emit("uisae", "U04", message, "");
    if (message.member.hasPermission("BAN_MEMBERS") == true) {
        if (message.guild.member(client.user).hasPermission("BAN_MEMBERS") == true) {
            client.util.searchUser(message, args[0], false).then(async user => {
                let member = message.guild.member(user);
                reason = args.slice(1).join(' ');
                if (message.author.id == user.id) {
                    let embed = new Discord.MessageEmbed();
                    embed.setColor(ce);
                    embed.setTitle(`OK WHY?`);
                    embed.setDescription(`Why you want to ban yourself`);
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
                } else if (member.bannable == true) {
                    if (!reason) {
                        reason = `none`;
                    }
                    let embed = new Discord.MessageEmbed();
                    embed.setColor(ce);
                    embed.setTitle(`OK sorry`);
                    embed.setDescription(`You have been banned from \`${message.guild.name}\` for \`${reason}\` reason`);
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
                    member.send(embed);
                    let embeda = new Discord.MessageEmbed();
                    embeda.setColor(ce);
                    embeda.setTitle(`OK B20`);
                    embeda.setDescription(`${user.tag} have been banned for \`${reason}\` reason by ${message.author.tag}`);
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
                    member.ban(`Banned by ${message.author.tag} for reason ${reason}`);
                } else {
                    client.emit("uisae", "B05", message, "");
                }
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