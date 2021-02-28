let Discord = require("discord.js");

module.exports.info = {
    name: "randomnumbergenerator",
    aliases: ["rng"],
    example: "`#PREFIX##COMMAND# <min number> <max number>`",
    info: "info",
    tags: ["test"]
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname),message)) return;
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    if (!args[0] || !args[1]) {return client.emit("uisae", "U04", message, "");}
    if (args[0]>=args[1]) return;
    let numb = Math.floor(Math.random() * (Number(args[1])-Number(args[0]))) + Number(args[0]);
    message.channel.send("Random number: `"+numb+"`")
}