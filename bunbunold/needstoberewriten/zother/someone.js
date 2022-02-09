let Discord = require("discord.js");

module.exports.info = {
    name: "someone",
    example: "`#PREFIX##COMMAND#`",
    info: "You can now #PREFIX#someone to randomly select somebody at random https://www.youtube.com/watch?v=BeG5FqTpl9U",
    tags: ["everyone","select","user","other","someone","random"],
    perms: "Mention Everyone"
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname),message)) return;
    if (!message.member.hasPermission("MENTION_EVERYONE")) return message.reply(`You need to have permission to mention everyone`);
    let i = Math.floor(Math.random() * (message.guild.members.cache.filter(m => !m.user.bot).size - 1) + 1);
    let a = Array.from(message.guild.members.cache.filter(m => !m.user.bot));
    let b = a[i] + '';
    if (b == 'undefined') {
        b = "eh," + message.author
    }
    b = b.split(",");
    message.channel.send("@someone " + b[1]);
}
