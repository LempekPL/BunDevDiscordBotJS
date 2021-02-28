let Discord = require("discord.js");

module.exports.info = {
    name: "destroy",
    aliases: ["close"],
    example: "`#PREFIX##COMMAND#`",
    info: "ONLY OWNER",
    tags: ["owner"]
}

module.exports.run = async (client, message, args) => {
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    let z = 0;
    if (message.author.id != client.config.settings.ownerid  && !client.config.settings.subowners.includes(message.author.id)) return client.emit("uisae", "B99", message, "");
    for (let a of client.shoukaku.players) {
        z++;
    }
    let eembed = new Discord.MessageEmbed();
    eembed.setColor(ce);
    eembed.setTitle("Do you want to destroy client?");
    eembed.setDescription("There are " + z + " players");
    eembed.addField('\u200b', `Reply with yes. You have 30 seconds. Type \`cancel\` to cancel`);
    let msearch;
    message.channel.send(eembed).then(mes => msearch = mes);

    let collector = message.channel.createMessageCollector(m => m.author = message.author, {time: 30000});
    collector.on("collect", async m => {
        if(m.content.toLowerCase().startsWith("cancel")) {
            collector.stop();
            return message.channel.send("Canceled ✅");
        }

        if (m.content == "yes") {
            message.channel.send("Exiting...");
            collector.stop();
            client.user.setStatus('invisible');
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