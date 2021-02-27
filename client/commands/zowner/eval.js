let Discord = require("discord.js");
let db = require('../../../util/db.js');
let util = require("../../../util/util");
let config = require("../../../data/config.json");
let index = require("../../../index.js");
let prefix = config.prefix;

module.exports.info = {
    name: "eval",
    example: "`#PREFIX##COMMAND# <code>`",
    info: "ONLY OWNER",
    tags: ["owner"]
}

module.exports.run = async (client, message, args) => {
    let i = Math.floor(Math.random() * config.c.length);
    let ce = config.c[i];
    if (message.author.id != config.settings.ownerid  && !config.settings.subowners.includes(message.author.id)) return client.emit("uisae", "B99", message, "");
    let evalv = null;
    let text = args.slice(0).join(" ");
    try {
        evalv = eval(text);
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
    if (!String(evalv).includes(config.tokens.token)) {
        message.channel.send(eembed);
    }
}