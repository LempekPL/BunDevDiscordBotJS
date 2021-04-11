let Discord = require("discord.js");
let cooldown = new Set();

module.exports.info = {
    name: "redditimg",
    example: "`#PREFIX##COMMAND# <subreddit>`",
    info: "ONLY OWNER",
    tags: ["owner"]
}

module.exports.run = async (client, message, args) => {
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    if (message.author.id != client.config.settings.ownerid  && !client.config.settings.subowners.includes(message.author.id)) return client.emit("uisae", "B99", message, "");
    if (cooldown.has(message.author.id)) {
        message.channel.send(`Wait 5 seconds`);
    } else {
        args[1] = args[1] ? args[1] : "hot";
        let response = await client.util.requester(`http://lempek.tk/api/reddit?subreddit=${args[0]}&type=${args[1]}`, client.config.tokens.lempek, "json");
        let embed = new Discord.MessageEmbed();
        embed.attachFiles({
            attachment: response.image,
            name: 'reddit.png'
        });
        embed.setDescription(`[r/${response.subreddit} | u/${response.author_name}](https://reddit.com/${response.permalink})\n**${response.post_title}**`);
        embed.setImage("attachment://reddit.png");
        embed.setColor(ce);
        embed.setFooter(`👍 ${response.ups} | 💬 ${response.count_comments}`);
        message.channel.send(embed);
        cooldown.add(message.author.id);
        setTimeout(() => {
            cooldown.delete(message.author.id);
        }, 5000);
    }
}