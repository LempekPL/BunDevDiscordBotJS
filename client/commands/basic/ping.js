let Discord = require("discord.js");

module.exports.info = {
    name: "ping",
    tags: ["speed","ping","internet","basic"]
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname),message)) return;
    let msg = await message.channel.send(`Ping? <a:discordloading:815380005320130670>`);
    let p = new Discord.MessageEmbed;
    p.setColor(client.util.randomColorConfig(client));
    p.addField("Pong! <a:dloading:815379977163767810>", `Ping: **${msg.createdTimestamp - message.createdTimestamp}**ms. \nGateway (API): **${Math.round(client.ws.ping)}**ms`);
    if (client.config.settings.subowners.length==0) {
        p.setFooter("© "+client.users.cache.get(client.config.settings.ownerid).username, client.users.cache.get(client.config.settings.ownerid).avatarURL());
    } else {
        let owners = client.users.cache.get(client.config.settings.ownerid).username
        client.config.settings.subowners.forEach(sub => {
            owners+=` & ${client.users.cache.get(sub).username}`;
        });
        p.setFooter("© "+owners, client.user.avatarURL());
    }
    p.setTimestamp();
    msg.edit(p);
}
