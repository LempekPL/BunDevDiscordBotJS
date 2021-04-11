let Discord = require("discord.js");
let cooldown = new Set();

module.exports.info = {
    name: "trump",
    example: "`#PREFIX##COMMAND# <text>`",
    info: "Gives picture with your text",
    tags: ["api","badosz","picture","text","fun"]
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname),message)) return;
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    if (cooldown.has(message.author.id)) {
        message.channel.send(`Wait 5 seconds`);
    } else {
        let text = encodeURIComponent(client.util.polskieliterytoblad(args.join(' ')));
        if (!text) return client.emit("uisae", "U04", message, "");
        let response = await client.util.requester(`https://obrazium.com/v1/trump?text=${text}`, client.config.tokens.badosz, "buffer");
        let embed = new Discord.MessageEmbed();
        embed.attachFiles([{
            attachment: response,
            name: "trump.png"
        }]);
        embed.setImage("attachment://trump.png");
        embed.setColor(ce);
        embed.setFooter("obrazium.com");
        message.channel.send(embed);
        cooldown.add(message.author.id);
        setTimeout(() => {
            cooldown.delete(message.author.id);
        }, 5000);
    }
}