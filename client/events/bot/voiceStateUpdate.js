let db = require("../../../util/db.js");

module.exports = async (oldState, newState, client) => {
    await db.get("guilds",newState.guild.id,"voiceBans").then(async bans => {
        var vChannel = newState.channel;
        if(!vChannel) return;
        if(!bans) return;
        let zn = false;
        bans.forEach(id => {
            if(id == newState.id) zn = true;
        });
        if(!zn) return;
        newState.kick();
    });

    let vC = oldState.channelID;
    let player = await client.shoukaku.getPlayer(oldState.guild.id);
    if(!player || vC != player.voiceConnection.voiceChannelID) return;
    if(client.channels.cache.get(player.voiceConnection.voiceChannelID).members.filter(m => !m.user.bot).size == 0) {
        setTimeout(async () => {
            if (client.channels.cache.get(player.voiceConnection.voiceChannelID).members.filter(m => !m.user.bot).size == 0) {
                let queue = client.queue[oldState.guild.id];
                queue.loop = false;
                queue.loopqueue = false;
                queue.shuffle = false;
                queue.prev = [];
                queue.songs = [];
                await player.disconnect();
                //await message.channel.send("⏏️ Disconnected, no one's listening");
            }
        }, 30 * 1000);
    }
}