let Discord = require("discord.js");

module.exports.info = {
    name: "skip",
    aliases: ["s", "next", "n"],
    example: "`#PREFIX##COMMAND#`",
    info: "Plays next song",
    tags: ["next", "song", "music", "queue", "skip"]
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
    if (player.track == null) return message.channel.send("No song to skip");
    if (pladb.voteSkip && !pladb.djrole) {
        let queue = client.queue[message.guild.id];
        let userz = client.channels.cache.get(player.voiceConnection.voiceChannelID).members.filter(m => !m.user.bot).size;
        let prefix = await client.db.get("guilds", message.guild.id, "prefix");
        if (queue.vskip.includes(message.author.id)) {
            return message.channel.send(`More than half of the users need to use \`${prefix}skip\` to skip this song\n${queue.vskip.length} out of ${userz} want to skip this song`);
        } else {
            queue.vskip.push(message.author.id);
            message.channel.send(`More than half of the users need to use \`${prefix}skip\` to skip this song\n${queue.vskip.length} out of ${userz} want to skip this song`);
        }
        if (queue.vskip.length > (userz / 2)) {
            queue.vskip = [];
            await player.stopTrack();
            await message.channel.send("⏭️ Skipped");
        }
    } else {
        await player.stopTrack();
        await message.react('⏭️');
    }

}