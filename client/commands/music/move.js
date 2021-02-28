let Discord = require("discord.js");

module.exports.info = {
    name: "move",
    aliases: ["seek"],
    example: "`#PREFIX##COMMAND# <seconds>`",
    info: "Moves song forward or backwards",
    tags: ["move","seek","song","music"]
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname),message)) return;
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    let player = client.shoukaku.getPlayer(message.guild.id);
    if (!player || player.track == null) return;
    let pladb = await client.db.get("guilds",message.guild.id,"player");
    if (pladb.djrole && !message.member.roles.cache.some(role => role.id == pladb.djrole)) return message.channel.send("You need to have DJ role");
    if (message.member.voice.channel == null) return message.channel.send("You need to be in voice channel");
    if (!args[0]) return message.channel.send("Please give a number");
    if (isNaN(args[0])) return message.channel.send("Please give a **number**");
    let numb = player.position + (args[0]*1000)
    let emo;
    if (args[0] < 0) {
        emo = `⏪`;
    } else {
        emo = `⏩`;
    }
    await player.seekTo(numb);
    await message.channel.send(`${emo} Moved ${args[0]} seconds`);
    await message.react(emo);
}