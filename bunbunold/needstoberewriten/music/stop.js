let Discord = require("discord.js");

module.exports.info = {
    name: "stop",
    example: "`#PREFIX##COMMAND#`",
    info: "Stops music and cleares queue",
    tags: ["stop","music","queue"]
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname),message)) return;
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    let player = client.shoukaku.getPlayer(message.guild.id);
    if (!player) return;
    let pladb = await client.db.get("guilds",message.guild.id,"player");
    if (pladb.djrole && !message.member.roles.cache.some(role => role.id == pladb.djrole)) return message.channel.send("You need to have DJ role");
    if (message.member.voice.channel == null) return message.channel.send("You need to be in voice channel");
    let queue = client.queue[message.guild.id];
    queue.songs = [];
    queue.prev = [];
    await player.stopTrack();
    await message.react('⏹️');

}