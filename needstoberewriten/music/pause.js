let Discord = require("discord.js");

module.exports.info = {
    name: "pause",
    aliases: ["unpause"],
    example: "`#PREFIX##COMMAND#`",
    info: "Pauses or unpauses music",
    tags: ["stop","pause","music","song"]
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
    if (player.paused == true) {
        await player.setPaused(false);
        await message.channel.send("▶️ Unpaused");
        await message.react('▶️');
    } else {
        await player.setPaused(true);
        await message.channel.send("⏸️ Paused");
        await message.react('⏸️');
    }
}