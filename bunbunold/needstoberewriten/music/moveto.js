let Discord = require("discord.js");
let second = 1;
let minute = second * 60;
let hour = minute * 60;

module.exports.info = {
    name: "moveto",
    aliases: ["seekto"],
    example: "`#PREFIX##COMMAND# <seconds>`",
    info: "Moves song to specific moment",
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
    if (args[0] < 0) return message.channel.send("Please give number higher than 0");
    if (args[0] >= 86400) return message.channel.send("Please give number lower than 86400");
    let hoursa = Math.floor(args[0] / (hour));
    if (hoursa < 10) {hoursa = "0"+String(hoursa)}
    let minsa = Math.floor((args[0] % (hour)) / (minute));
    if (minsa < 10) {minsa = "0"+String(minsa)}
    let secsa = Math.floor((args[0] % (minute)) / (second));
    if (secsa < 10) {secsa = "0"+String(secsa)}
    if (args[0] == 0) {args[0] = -1}

    if (hoursa <= 0) {
        timea = `${minsa}:${secsa}`;
    } else {
        timea = `${hoursa}:${minsa}:${secsa}`;
    }

    let emo;
    if (args[0]*1000 < player.position) {
        emo = `⏪`;
    } else {
        emo = `⏩`;
    }

    await player.seekTo(args[0]*1000);
    await message.channel.send(`${emo} Moved to ${timea}`);
    await message.react(emo);
}