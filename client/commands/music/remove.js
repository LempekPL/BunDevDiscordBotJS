let Discord = require("discord.js");

module.exports.info = {
    name: "remove",
    aliases: ["rmv"],
    example: "`#PREFIX##COMMAND# <song number>`",
    info: "Removes song from queue",
    tags: ["next","song","music","queue","remove"]
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
    if (player.track == null) return message.channel.send("No song to delete");
    let queue = client.queue[message.guild.id];
    if (pladb.voteSkip && !pladb.djrole) {
        let queue = client.queue[message.guild.id];
        let userz = client.channels.cache.get(player.voiceConnection.voiceChannelID).members.filter(m => !m.user.bot).size;
        let prefix = await client.db.get("guilds", message.guild.id, "prefix");
        let num = Number(args[0]);
        if (!queue.vdel[num]) {
            for (let i = 0; i < num + 1; i++) {
                if (!queue.vdel[i]) {
                    queue.vdel[i] = [];
                }
            }
        }
        if (queue.vdel[num].includes(message.author.id)) {
            return message.channel.send(`More than half of the users need to use \`${prefix}remove ${num}\` to remove this song\n${queue.vdel[num].length} out of ${userz} want to remove this song`);
        } else {
            queue.vdel[num].push(message.author.id);
            message.channel.send(`More than half of the users need to use \`${prefix}remove ${num}\` to remove this song\n${queue.vdel[num].length} out of ${userz} want to remove this song`);
        }
        if (queue.vdel[num].length > (userz / 2)) {
            queue.vdel = [];
            if (args[0] > 0 && args[0] <= queue.songs.length) {
                let n = Number(args[0]) - 1;
                queue.songs.splice(n, 1);
                await message.channel.send("➖ Removed");
            } else {
                return client.emit("uisae", "U06", message, [1, queue.songs.length]);
            }
        }
    } else {
        if (args[0] > 0 && args[0] <= queue.songs.length) {
            let n = Number(args[0]) - 1;
            queue.songs.splice(n, 1);
            await message.react('➖');
        } else {
            return client.emit("uisae", "U06", message, [1, queue.songs.length]);
        }
    }

}