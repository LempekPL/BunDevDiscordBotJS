let Discord = require("discord.js");

module.exports.info = {
    name: "previous",
    aliases: ["prev"],
    example: "`#PREFIX##COMMAND#`",
    info: "Plays previous song. Limit to previous songs is 10",
    tags: ["previous","song","music","queue"]
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
    if (pladb.votePrev && !pladb.djrole) {
        let userz = client.channels.cache.get(player.voiceConnection.voiceChannelID).members.filter(m => !m.user.bot).size;
        let prefix = await client.db.get("guilds", message.guild.id, "prefix");
        if (queue.vprev.includes(message.author.id)) {
            return message.channel.send(`More than half of the users need to use \`${prefix}previous\` to play previous song\n${queue.vprev.length} out of ${userz} want to skip this song`);
        } else {
            queue.vprev.push(message.author.id);
            message.channel.send(`More than half of the users need to use \`${prefix}previous\` to play previous song\n${queue.vprev.length} out of ${userz} want to skip this song`);
        }
        if (queue.vprev.length > (userz / 2)) {
            queue.vprev = [];
            let prev = queue.prev.shift();
            if (!prev) return message.channel.send("No previous song");
            queue.songs.unshift(queue.np);
            queue.songs.unshift(prev);
            if (queue.shuffle && !queue.loop) {
                queue.shuffle = false;
                await player.stopTrack();
                queue.shuffle = true;
            } else if (!queue.shuffle && queue.loop) {
                queue.loop = false;
                await player.stopTrack();
                queue.loop = true;
            } else if (queue.shuffle && queue.loop) {
                queue.loop = false;
                queue.shuffle = false;
                await player.stopTrack();
                queue.loop = true;
                queue.shuffle = true;
            } else {
                await player.stopTrack();
            }
            await message.channel.send("⏮️ Previous");
            await queue.prev.shift();
        }
    } else {
        let prev = queue.prev.shift();
        if (!prev) return message.channel.send("No previous song");
        queue.songs.unshift(queue.np);
        queue.songs.unshift(prev);
        await player.stopTrack();
        message.react('⏮️');
        await queue.prev.shift();
    }

}