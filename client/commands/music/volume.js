let Discord = require("discord.js");

module.exports.info = {
    name: "volume",
    aliases: ["vol"],
    example: "`#PREFIX##COMMAND# <value>`",
    info: "Changes volume",
    tags: ["volume","sound","music"]
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname),message)) return;
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    let player = client.shoukaku.getPlayer(message.guild.id);
    if (!player) return;
    if (message.member.voice.channel == null) return message.channel.send("You need to be in voice channel");

    let femo;
    if (player.volume == 0) {
        femo = `🔇`;
    } else if (player.volume >= 1 && player.volume <= 54) {
        femo = `🔈`;
    } else if (player.volume >= 55 && player.volume <= 99) {
        femo = `🔉`;
    } else if (player.volume >= 100 && player.volume <= 150) {
        femo = `🔊`;
    } else {
        femo = `📢`;
    }

    if (!args[0]) return message.channel.send(`${femo} Vol ${player.volume}%`);
    if (isNaN(args[0])) return message.channel.send("Please give a **number**");
    if ((args[0] >= 0 && args[0] <= 1000) || message.author.id == client.config.settings.ownerid) {
        let pladb = await client.db.get("guilds",message.guild.id,"player");
        if (pladb.djrole && !message.member.roles.cache.some(role => role.id == pladb.djrole)) return message.channel.send("You need to have DJ role");
        let emo;
        if (args[0] < player.volume) {
            emo = `🔉`;
        } else {
            emo = `🔊`;
        }
        await player.setVolume(Number(args[0]));
        await message.channel.send(`${emo} Volume ${args[0]}%`);
        await message.react(emo);
    } else {
        client.emit("uisae", "U06", message, [0, 1000]);
    }
}