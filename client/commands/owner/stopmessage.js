let Discord = require("discord.js");

module.exports.info = {
    name: "stopmessage",
    tags: ["owner"]
}

module.exports.run = async (client, message, args) => {
    if (message.author.id !== client.config.settings.ownerid  && !client.config.settings.subowners.includes(message.author.id)) return client.emit("uisae", "B99", message, "");
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    link = args[0].split("/")
    megs = client.guilds.cache.get(link[4]).channels.cache.get(link[5]).messages.cache.get(link[6]);
    megs.delete({ timeout: 0, reason: "Don't" });
}
