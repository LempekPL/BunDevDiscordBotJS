let Discord = require("discord.js");

module.exports.info = {
    name: "playnow",
    aliases: ["pnow"],
    example: "`#PREFIX##COMMAND# <song number>`",
    info: "Plays now chosen song without skipping songs",
    tags: ["song","music","queue","playnow","play"]
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname),message)) return;
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    let player = client.shoukaku.getPlayer(message.guild.id);
    if (!player) return;
    if (message.member.voice.channel == null) return message.channel.send("You need to be in voice channel");
    let pladb = await client.db.get("guilds",message.guild.id,"player");
    if (pladb.djrole && !message.member.roles.cache.some(role => role.id == pladb.djrole)) return message.channel.send("You need to have DJ role");
    if (player.track == null) return message.channel.send("No song to play now");
    let queue = client.queue[message.guild.id];
    if (pladb.voteSkip && !pladb.djrole) {
        let userz = client.channels.cache.get(player.voiceConnection.voiceChannelID).members.filter(m => !m.user.bot).size;
        let prefix = await client.db.get("guilds", message.guild.id, "prefix");
        let num = Number(args[0]);
        if (!queue.vplaynow[num]) {
            for (let i = 0; i < num + 1; i++) {
                if (!queue.vplaynow[i]) {
                    queue.vplaynow[i] = [];
                }
            }
        }
        if (queue.vplaynow[num].includes(message.author.id)) {
            return message.channel.send(`More than half of the users need to use \`${prefix}playnow ${num}\` to play this song\n${queue.vplaynow[num].length} out of ${userz} want to play this song`);
        } else {
            queue.vplaynow[num].push(message.author.id);
            message.channel.send(`More than half of the users need to use \`${prefix}playnow ${num}\` to play this song\n${queue.vplaynow[num].length} out of ${userz} want to play this song`);
        }
        if (queue.vplaynow[num].length > (userz / 2)) {
            queue.vplaynow = [];
            if (args[0] > 0 && args[0] <= queue.songs.length) {
                let n = Number(args[0]) - 1;
                let sog = queue.songs.splice(n, 1)[0];
                queue.songs.unshift(sog);
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
                await message.channel.send("⏭️ Playing now");
            } else {
                return client.emit("uisae", "U06", message, [1, queue.songs.length]);
            }
        }
    } else {
        if (args[0] > 0 && args[0] <= queue.songs.length) {
            let n = Number(args[0]) - 1;
            let sog = queue.songs.splice(n, 1)[0];
            queue.songs.unshift(sog);
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
            await message.channel.send("⏭️ Playing now");
            message.react('⏭️');
        } else {
            return client.emit("uisae", "U06", message, [1, queue.songs.length]);
        }
    }
}