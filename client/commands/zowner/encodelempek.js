let Discord = require("discord.js");
let cooldown = new Set();

module.exports.help = {
}

module.exports.info = {
    name: "encodelempek",
    aliases: ["enlempek", "enlk"],
    example: "`#PREFIX##COMMAND# <text>`",
    info: "Encodes text to lempek code",
    tags: ["code","encode","text","lempekapi","lempek","api"]
}

module.exports.run = async (client, message, args) => {
    if (message.author.id != client.config.settings.ownerid  && !client.config.settings.subowners.includes(message.author.id)) return client.emit("uisae", "B99", message, "");
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    if (cooldown.has(message.author.id)) {
        message.channel.send(`Wait 5 seconds`);
    } else {
        let db = require("../../util/db.js");
        let prefix = await client.db.get("guilds",message.guild.id,"prefix");

        let text = encodeURIComponent(client.util.polskieliterytoblad(args.join(' ')));
        if (!text) return client.util.uisae("U04", client, message, args, prefix);
        let response = await client.util.requester(`http://localhost:3001/api/lempekencode?text=${text}`, client.config.tokens.lempek, "json");
        let embed = new Discord.MessageEmbed();
        embed.setDescription(response.body);
        embed.setColor(ce);
        embed.setFooter("lempek.tk");
        message.channel.send(embed);
        cooldown.add(message.author.id);
        setTimeout(() => {
            cooldown.delete(message.author.id);
        }, 5000);
    }
}