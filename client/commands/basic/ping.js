const Discord = require("discord.js");

module.exports.info = {
    name: "ping",
    tags: ["speed", "ping", "internet", "basic"]
}

module.exports.run = async (client, message, args) => {
    let pingMessage = await message.channel.send({
        content: `Ping? <a:discordloading:815380005320130670>`,
        reply: {messageReference: message.id}
    });
    let p = new Discord.MessageEmbed();
    p.setColor(client.util.randomColor());
    p.setAuthor(client.user.tag, client.user.avatarURL())
    p.setDescription(`Ping: **${pingMessage.createdTimestamp - message.createdTimestamp}**ms. \nGateway (API): **${Math.round(client.ws.ping)}**ms`);
    client.util.footerEmbed(client, p);
    p.setTimestamp();
    await pingMessage.edit({content: "Pong! <a:dloading:815379977163767810>", embeds: [p]});
}
