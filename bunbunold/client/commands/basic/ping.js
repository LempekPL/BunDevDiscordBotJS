let Discord = require("discord.js");

module.exports.info = {
    name: "ping",
    lang: {
        en: require("../../../lang/en.json").command.ping.infoData,
        pl: require("../../../lang/pl.json").command.ping.infoData
    },
    tags: ["speed","ping","internet","basic"]
}

module.exports.run = async (client, message, args) => {
    let msg = await message.channel.send(`Ping? <a:discordloading:815380005320130670>`);
    let p = new Discord.MessageEmbed;
    p.setColor(client.util.randomColorConfig(client));
    p.addField(`Pong! <a:dloading:815379977163767810>`, `Ping: **${msg.createdTimestamp - message.createdTimestamp}**ms. \nGateway (API): **${Math.round(client.ws.ping)}**ms`);
    client.util.setFooterOwner(client, p);
    p.setTimestamp();
    msg.edit(p);
}
