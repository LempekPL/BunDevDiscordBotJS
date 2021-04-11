let Discord = require("discord.js");

module.exports.info = {
    name: "nick",
    example: "`#PREFIX##COMMAND# <name>`",
    info: "ONLY OWNER",
    tags: ["owner"]
}

module.exports.run = async (client, message, args) => {
    if (message.author.id != client.config.settings.ownerid  && !client.config.settings.subowners.includes(message.author.id)) return client.emit("uisae", "B99", message, "");
    let text = args.slice(0).join(" ");
    client.user.setUsername(text).then(message.channel.send("Nick zmieniono na `" + text + "`"));
}