let Discord = require("discord.js");

module.exports.info = {
    name: "clearserverdatabase",
    tags: ["clear", "database", "security"],
}

module.exports.run = async (client, message, args) => {
    if (message.author.id !== message.guild.ownerId) return client.emit("uisae", "U03", message, "You need to be creator of this server to delete it from bot database");
    let values = {
        "yes": async () => {
            let deleted = await client.dbConn.delete("guilds", message.guild.id);
            if (deleted) {
                message.channel.send("Server data deleted successfully")
            } else {
                client.emit("uisae", "B01", message, "Something went wrong with deleting data");
            }
        }
    };
    await client.util.additionalConfirmation(client, message, "Are you sure you want to delete this guild from bot database? Type `yes` to confirm or `cancel` to cancel. You have 30 seconds", 30000, values);
}