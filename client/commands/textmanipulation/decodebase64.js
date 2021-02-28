let Discord = require("discord.js");
let cooldown = new Set();

module.exports.info = {
    name: "decodebase64",
    aliases: ["debase64", "deb64", "db64"],
    example: "`#PREFIX##COMMAND# <text>`",
    info: "Changes your text",
    tags: ["api","badosz","text","fun","decode","code"]
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname),message)) return;
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    if (cooldown.has(message.author.id)) {
        message.channel.send(`Wait 5 seconds`);
    } else {
        let prefix = await client.db.get("guilds",message.guild.id,"prefix");
        let text = encodeURIComponent(client.util.polskieliterytoblad(args.join(' ')));
        if (!text) return client.emit("uisae", "U04", message, "");
        let response = await client.util.requester(`https://obrazium.com/v1/decode-base64?text=${text}`, client.config.tokens.badosz, "json");
        let embed = new Discord.MessageEmbed();
        embed.setDescription(response.formatted);
        embed.setColor(ce);
        embed.setFooter("obrazium.com");
        message.channel.send(embed);
        cooldown.add(message.author.id);
        setTimeout(() => {
            cooldown.delete(message.author.id);
        }, 5000);
    }
}