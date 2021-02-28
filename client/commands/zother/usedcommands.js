let Discord = require("discord.js");

module.exports.info = {
    name: "usedcommands",
    aliases: ["uc", "usedcom"],
    example: "`#PREFIX##COMMAND#`",
    info: "info",
    tags: ["test"]
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname), message)) return;
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    let embed = new Discord.MessageEmbed();
    embed.setColor(ce);
    let fav = await client.db.get("users", message.author.id, "favCommands");
    let comman = "";
    let total = 0;
    for (let comm in fav) {
        comman += `${comm}: ${fav[comm]}\n`;
        total += fav[comm];
    }
    if (!fav || Object.keys(fav).length == 0) {
        comman = 'none';
    }
    embed.setTitle(`Commands used by ${message.author.tag}: ${total}`);
    embed.setDescription(`${comman}`);
    if (client.config.settings.subowners.length == 0) {
        embed.setFooter("© " + client.users.cache.get(client.config.settings.ownerid).username, client.users.cache.get(client.config.settings.ownerid).avatarURL());
    } else {
        let owners = client.users.cache.get(client.config.settings.ownerid).username
        client.config.settings.subowners.forEach(sub => {
            owners += ` & ${client.users.cache.get(sub).username}`;
        });
        embed.setFooter("© " + owners, client.user.avatarURL());
    }
    embed.setTimestamp();
    message.channel.send(embed);
}