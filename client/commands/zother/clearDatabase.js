let Discord = require("discord.js");

module.exports.info = {
    name: "cleardatabase",
    example: "`#PREFIX##COMMAND# user` or `#PREFIX##COMMAND# guild`",
    info: "Clears all data from database. If you want to clear guild data you need to contact server creator.",
    tags: ["clear", "database", "security"],
    perms: "SERVER OWNER (only for deleting server data)"
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname), message)) return;
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    let deleted;
    switch (args[0]) {
        case "user":
            deletion("users")
            break;

        case "guild":
            if (message.guild.ownerID == message.author.id) {
                deletion("guilds")
            } else {
                client.emit("uisae", "U03", message, "");
            }
            break;

        default:
            client.emit("uisae", "U05", message, "");
            break;
    }
    function deletion(obj) {
        let mesg;
        message.channel.send("Are you sure you want to delete "+obj+" data. Type `yes` to confirm, `cancel` to cancel. You have 30 seconds to decide").then(message => mesg = message);
        let collector = message.channel.createMessageCollector(m => m.author = message.author, {
            time: 30000
        });
        collector.on("collect", async m => {
            if (m.content.toLowerCase().startsWith("cancel")) {
                collector.stop();
                return message.channel.send("Canceled ✅");
            }
    
            if (m.content == "yes") {
                deleted = await client.db.del(obj, message.guild.id);
                if (deleted) {
                    message.channel.send(obj.charAt(0).toUpperCase() + obj.slice(1)+" data deleted successfully")
                } else {
                    client.emit("uisae", "B01", message, "Something went wrong with deleting data");
                }
                collector.stop();
            }
        });
        collector.on("end", () => {
            mesg.delete();
        });
    }
}