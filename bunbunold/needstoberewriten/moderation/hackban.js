let Discord = require("discord.js");

module.exports.info = {
    name: "hackban",
    aliases: ["ultimatebanhammer"],
    example: "`#PREFIX##COMMAND# <userid only>`",
    info: "Bans user from server without user being on the server",
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
            reason = args.slice(1).join(' ');
            if (args[0] != null) {
                if (!reason) {
                    reason = `none`;
                }
                let embeda = new Discord.MessageEmbed();
                embeda.setColor(ce);
                embeda.setAuthor(message.author.tag);
                embeda.setTitle(`OK B20`);
                embeda.setDescription(`<@${args[0]}> have been banned for \`${reason}\` reason by ${message.author.tag}`);
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
                let a = 0;
                message.guild.members.ban(args[0], `Banned by ${message.author.tag} for reason ${reason}`).catch(() => {
                    client.emit("uisae", "U05", message, "");
                    a = 1;
                }).then(async () => {
                    if (a == 0) {
                        await message.channel.send(embeda);
                    }
                });
            } else {
                client.emit("uisae", "U04", message, "");
            }
        } else {
            client.emit("uisae", "B03", message, "");
        }
    } else {
        client.emit("uisae", "U03", message, "");
    }
}