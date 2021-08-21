const Discord = require("discord.js");
const Use = {
    Str: valueToString => JSON.stringify(valueToString)
}

module.exports.info = {
    name: "aval",
    tags: ["owner"]
}

module.exports.run = async (client, message, args) => {
    if (message.author.id !== client.config.settings.ownerId && !client.config.settings.subOwnersIds.includes(message.author.id)) return client.emit("uisae", "B99", message, "");
    let evalv = null;
    let text = args.slice(0).join(" ");
    try {
        evalv = eval("(async () => {" + text + "})()");
    } catch (err) {
        message.channel.send("Don't work\n" + err);
        return;
    }

    try {
        let eembed = new Discord.MessageEmbed();
        eembed.setColor(client.util.randomColor());
        eembed.setAuthor("AVAL - JS");
        eembed.setTitle("INPUT:");
        eembed.setDescription("```js\n" + text + "\n```");
        eembed.addField("OUTPUT:", "```js\n" + evalv + "\n```");
        if (!String(evalv).includes(process.env.TOKEN)) {
            message.channel.send({embeds: [eembed]});
        }
    } catch (e) {
        console.log(e);
        client.emit("uisae", "ERROR", message, e);
    }
}