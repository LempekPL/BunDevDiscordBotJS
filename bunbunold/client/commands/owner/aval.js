let Discord = require("discord.js");

module.exports.info = {
    name: "aval",
    example: "`#PREFIX##COMMAND# <code>`",
    tags: ["owner"]
}

module.exports.run = async (client, message, args) => {
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    if (message.author.id !== client.config.settings.ownerid  && !client.config.settings.subowners.includes(message.author.id)) return client.emit("uisae", "B99", message, "");
    let evalv = null;
    let text = args.slice(0).join(" ");
    try {
        evalv = eval("(async () => {" + text + "})()");
    } catch (err) {
        message.channel.send("Don't work " + err);
        return;
    }
    let eembed = new Discord.MessageEmbed();
    eembed.setColor(ce);
    eembed.setAuthor("EVAL - JS");
    eembed.setTitle("INPUT:");
    eembed.setDescription("```js\n" + text + "\n```");
    eembed.addField("OUTPUT:", "```js\n" + evalv + "\n```");
    if (!String(evalv).includes(client.config.tokens.token)) {
        message.channel.send(eembed);
    }
}