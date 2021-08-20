let Discord = require("discord.js");

module.exports.info = {
    name: "destroy",
    aliases: ["close"],
    tags: ["owner"]
}

module.exports.run = async (client, message, args) => {
    if (message.author.id !== client.config.settings.ownerId && !client.config.settings.subOwnersIds.includes(message.author.id)) return client.emit("uisae", "B99", message, "");
    let z = 0;
    for (let a of client.shoukaku.players) {
        z++;
    }
    let embed = new Discord.MessageEmbed();
    embed.setColor(client.util.randomColor());
    embed.setTitle("Do you want to destroy client?");
    embed.setDescription("There are " + z + " active music players");
    embed.addField('\u200b', `Reply with yes. You have 30 seconds. Type \`cancel\` to cancel`);
    let msearch = await message.channel.send({embeds:[embed]});

    let collector = message.channel.createMessageCollector({filter: m => m.author = message.author, time: 30000});
    collector.on("collect", async m => {
        if(m.content.toLowerCase().startsWith("cancel")) {
            collector.stop();
            return message.channel.send("Canceled ✅");
        }

        if (m.content === "yes") {
            message.channel.send("Exiting...");
            collector.stop();
            client.user.setStatus("invisible");
            setTimeout(() => {
                client.destroy();
                setTimeout(() => {
                    process.exit(1);
                }, 100)
            }, 100);
        }
    });
    collector.on("end", () => {
        msearch.delete();
    });
}