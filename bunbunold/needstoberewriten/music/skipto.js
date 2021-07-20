let Discord = require("discord.js");

module.exports.info = {
    name: "skipto",
    aliases: ["sto"],
    example: "`#PREFIX##COMMAND# <song number>`",
    info: "Plays skips songs to the chosen one",
    tags: ["next", "song", "music", "queue", "skip", "skipto"]
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname),message)) return;
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    let player = client.shoukaku.getPlayer(message.guild.id);
    if (!player) return;
    let pladb = await client.db.get("guilds", message.guild.id, "player");
    if (pladb.djrole && !message.member.roles.cache.some(role => role.id == pladb.djrole)) return message.channel.send("You need to have DJ role");
    if (message.member.voice.channel == null) return message.channel.send("You need to be in voice channel");
    if (player.track == null) return message.channel.send("No song to skip to");
    let queue = client.queue[message.guild.id];
    if (pladb.voteSkip && !pladb.djrole) {
        let userz = client.channels.cache.get(player.voiceConnection.voiceChannelID).members.filter(m => !m.user.bot).size;
        let prefix = await client.db.get("guilds", message.guild.id, "prefix");
        let num = Number(args[0]);
        if (!queue.vskipto[num]) {
            for (let i = 0; i < num + 1; i++) {
                if (!queue.vskipto[i]) {
                    queue.vskipto[i] = [];
                }
            }
        }
        if (queue.vskipto[num].includes(message.author.id)) {
            return message.channel.send(`More than half of the users need to use \`${prefix}skipto ${num}\` to skip\n${queue.vskipto[num].length} out of ${userz} want to skip to this song`);
        } else {
            queue.vskipto[num].push(message.author.id);
            message.channel.send(`More than half of the users need to use \`${prefix}skipto ${num}\` to skip to this song\n${queue.vskipto[num].length} out of ${userz} want to skip to this song`);
        }
        if (queue.vskipto[num].length > (userz / 2)) {
            queue.vskipto = [];
            if (args[0] > 0 && args[0] <= queue.songs.length) {
                let n = Number(args[0]);
                let sogs = queue.songs.splice(0, n);
                queue.songs.unshift(sogs[n - 1]);
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
                await message.channel.send("⏭️ Skipped");
                sogs.forEach((sog, i) => {
                    if (i != (n - 1)) {
                        queue.prev.unshift(sog);
                    }
                });
            } else {
                return client.emit("uisae", "U06", message, [1, queue.songs.length]);
            }
        }
    } else {
        if (args[0] > 0 && args[0] <= queue.songs.length) {
            let n = Number(args[0]);
            let sogs = queue.songs.splice(0, n);
            queue.songs.unshift(sogs[n - 1]);
            await player.stopTrack();
            await message.react('⏭️');
            sogs.forEach((sog, i) => {
                if (i != (n - 1)) {
                    queue.prev.unshift(sog);
                }
            });
        } else {
            return client.emit("uisae", "U06", message, [1, queue.songs.length]);
        }
    }

}