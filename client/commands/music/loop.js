let Discord = require("discord.js");

module.exports.info = {
    name: "loop",
    example: "`#PREFIX##COMMAND#` or `#PREFIX##COMMAND# <one/all/shuffle/shuffleloop/none>`",
    info: "Sets loop for the songs",
    tags: ["loop","shuffle","music"]
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
    if ((!queue.loop && !queue.loopqueue && !queue.shuffle && !args[0]) || args[0] == "one" || args[0] == "-o") {
        queue.loop = true;
        queue.loopqueue = false;
        queue.shuffle = false;
        await message.channel.send("🔂 Loop One");
    } else if ((queue.loop && !queue.loopqueue && !queue.shuffle && !args[0]) || args[0] == "all" || args[0] == "-a") {
        queue.loop = false;
        queue.loopqueue = true;
        queue.shuffle = false;
        await message.channel.send("🔁 Loop All");
    } else if ((!queue.loop && queue.loopqueue && !queue.shuffle && !args[0]) || args[0] == "shuffle" || args[0] == "-s") {
        queue.loop = false;
        queue.loopqueue = false;
        queue.shuffle = true;
        await message.channel.send("🔀 Shuffle");
    } else if ((!queue.loop && !queue.loopqueue && queue.shuffle && !args[0]) || args[0] == "shuffleloop" || args[0] == "-sl") {
        queue.loop = false;
        queue.loopqueue = true;
        queue.shuffle = true;
        await message.channel.send("🔀🔁 Shuffle Loop");
    } else {
        queue.loop = false;
        queue.loopqueue = false;
        queue.shuffle = false;
        await message.channel.send("↩️ None");
    }
}