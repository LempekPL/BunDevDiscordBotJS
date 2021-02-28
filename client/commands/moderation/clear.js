let Discord = require("discord.js");

module.exports.info = {
    name: "clear",
    aliases: ["prune", "hide_without_showing_it_back", "delete", "mrclean", "vanish", "bleach"],
    example: "`#PREFIX##COMMAND# <number of messages>`",
    info: "Clears messages. Max 100.",
    tags: ["prune", "delete", "vanish", "bleach", "pure", "message", "moderation"],
    perms: "Manage Messages"
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname),message)) return;
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    if (!args[0]) return client.emit("uisae", "U04", message, "");
    if (message.member.hasPermission("MANAGE_MESSAGES") == true) {
        if (message.guild.member(client.user).hasPermission("MANAGE_MESSAGES") == true) {
            if (args[0] == null) {
                client.emit("uisae", "U04", message, "");
            } else {
                let wartosc = parseInt(args[0], 10);
                if (wartosc >= 101) {
                    client.emit("uisae", "D03", message, "");
                    return;
                } else {
                    let wartosc = parseInt(args[0], 10);
                    message.delete().catch()
                    message.channel.messages.fetch({
                        limit: wartosc
                    }).then(messages => {
                        message.channel.bulkDelete(wartosc).then(messages => {
                            let embed = new Discord.MessageEmbed();
                            embed.setColor(ce);
                            embed.setAuthor(`Clear`);
                            if (message.author.id == client.config.settings.ownerid) {
                                embed.setTitle(`Task Failed Successfully`);
                            } else {
                                embed.setTitle(`OK B20`);
                            }
                            embed.setDescription(`**${messages.size} messages has been deleted successfully**`);
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
                            message.channel.send(embed).then(message => {message.delete({ timeout: 5000, reason: 'Autoremove' });});
                        }).catch(e => client.emit("uisae", "D02", message, ""), false);
                    });
                }
            }
        } else {
            client.emit("uisae", "B03", message, "");
        }
    } else {
        client.emit("uisae", "U03", message, "");
    }
}