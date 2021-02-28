let Discord = require("discord.js");
let cooldown = new Set();

module.exports.info = {
    name: "chucknorris",
    example: "`#PREFIX##COMMAND#`",
    info: "Gives random text response",
    tags: ["api","badosz","text","fun"]
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname),message)) return;
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    if (cooldown.has(message.author.id)) {
        message.channel.send(`Wait 5 seconds`);
    } else {
        if (!client.config.tokens.badosz) return client.emit("uisae", "B01", message, "Badosz api token not found");
        let response = await client.util.requester(`https://obrazium.com/v1/chucknorris`, client.config.tokens.badosz, "json");
        let embed = new Discord.MessageEmbed();
        embed.setTitle("Chuck:");
        embed.setDescription("```" + response.joke + "```");
        embed.setColor(ce);
        embed.setFooter("obrazium.com");
        message.channel.send(embed);
        cooldown.add(message.author.id);
        setTimeout(() => {
            cooldown.delete(message.author.id);
        }, 5000);
    }
}