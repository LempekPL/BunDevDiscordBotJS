let Discord = require("discord.js");

module.exports.info = {
    name:"fastpoll",
    aliases:["fp"],
    example: "`#PREFIX##COMMAND# <subject>`",
    info: "Creates fast poll YES or NO",
    tags: ["poll","choosing","yes","no"]
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname),message)) return;
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    if (args[0] == null) return client.emit("uisae", "U04", message, "");
    message.delete().catch();
    let pk = args.join(" ").split("|");
    let nazwa = pk[0];
    let opis = pk[1];
    if (pk[1] == null) {
        nazwa = `FastPoll`;
        opis = pk[0];
    }
    let poll = new Discord.MessageEmbed()
        .setTitle(nazwa)
        .setColor(ce)
        .setDescription(opis)
    message.channel.send(poll).then(poll => {
        poll.react("✅").then(m => {
        poll.react("❌")
        })})
}