let Discord = require("discord.js");

module.exports.gban = (message, client) => {
    let embed = new Discord.MessageEmbed();
    embed.setTitle(`Globalban`);
    embed.setDescription(`You can't use this bot.\nYou can appeal here https://discord.gg/NEGmf5A`);
    embed.setColor("#FF0000");
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
};