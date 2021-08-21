const Discord = require("discord.js");

module.exports.info = {
    name: "syncsendcommands",
    tags: ["owner"]
}

module.exports.run = async (client, message, args) => {
    if (message.author.id !== client.config.settings.ownerId && !client.config.settings.subOwnersIds.includes(message.author.id)) return client.emit("uisae", "B99", message, "");
    let allData = await client.dbConn.getAll("users");
    let filteredData = allData.filter(user => {
        return Object.keys(user.favouriteCommands).length > 0;
    });
    let total = 1;
    filteredData.forEach(user => {
        for (const favouriteCommandsKey in user.favouriteCommands) {
            total += user.favouriteCommands[favouriteCommandsKey]
        }
    });
    client.dbData.bot.commands = total;
    message.channel.send("Bot send commands synced with users send commands. New total: " + total);
}