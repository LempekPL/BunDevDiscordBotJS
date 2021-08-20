let Discord = require("discord.js");

module.exports.info = {
    name: "stopmessage",
    tags: ["owner"]
}

module.exports.run = async (client, message, args) => {
    if (message.author.id !== client.config.settings.ownerId && !client.config.settings.subOwnersIds.includes(message.author.id)) return client.emit("uisae", "B99", message, "");
    let link = args[0].split("/")
    let messageToDelete = await client.guilds.cache.get(link[4]).channels.cache.get(link[5]).messages.cache.get(link[6]);
    try {
        messageToDelete.delete({ timeout: 0, reason: "Don't" });
    } catch (e) {
        message.channel.send("Couldn't delete");
        console.log(e);
    }
}
