let Discord = require("discord.js");
let qc = require("./queue");
let megz = null;

let play = async (song, client, message) => {
    return new Promise(async (resolve, reject) => {
        if (!client.queue[message.guild.id]) new qc(message.guild.id, client);
        let queue = client.queue[message.guild.id];
        let node = await client.shoukaku.getNode();
        let player = await client.shoukaku.getPlayer(message.guild.id);
        if (!message.member.voice.channel.joinable) return client.emit("uisae", "B03", message, "");
        if (!player) {
            player = await node.joinVoiceChannel({
                guildID: message.guild.id,
                voiceChannelID: message.member.voice.channel.id,
                deaf: true
            });
            player.on("end", async data => {
                if (queue.loop && !queue.loopqueue && !queue.shuffle) {
                    queue.songs.unshift(queue.np);
                } else if (!queue.loop && (queue.loopqueue || (queue.loopqueue && queue.shuffle))) {
                    queue.songs.push(queue.np);
                } else {
                    queue.prev.unshift(queue.np);
                }
                if (queue.prev.length > 10) {
                    queue.prev.pop();
                }
                if (queue.prev.length > 12) {
                    queue.prev.splice(10, queue.prev.length);
                }
                queue.vskip = [];
                queue.vskipto = [];
                queue.vprev = [];
                queue.vdel = [];

                let next;
                if ((queue.loop || queue.loopqueue) && !queue.shuffle) {
                    next = queue.songs.shift();
                } else if (!queue.loop && queue.shuffle) {
                    let n = Math.floor(Math.random() * queue.songs.length);
                    next = queue.songs.splice(n, 1)[0];
                } else {
                    next = queue.songs.shift();
                }
                if (next == null) {
                    queue.np = {track: "", title: "", channel: "", length: 0, requester: "", url: "", date: 0};
                    return;
                } else {
                    let pladb = await client.db.get("guilds", message.guild.id, "player");
                    if (pladb.nextSong) {
                        let i = Math.floor(Math.random() * client.config.c.length);
                        let ce = client.config.c[i];
                        let b = new Discord.MessageEmbed();
                        b.setColor(ce);
                        if (client.config.settings.subowners.length==0) {
                            b.setFooter("© "+client.users.cache.get(client.config.settings.ownerid).username, client.users.cache.get(client.config.settings.ownerid).avatarURL());
                        } else {
                            let owners = client.users.cache.get(client.config.settings.ownerid).username
                            client.config.settings.subowners.forEach(sub => {
                                owners+=` & ${client.users.cache.get(sub).username}`;
                            });
                            b.setFooter("© "+owners, client.user.avatarURL());
                        }
                        b.setTimestamp();
                        let lonk = next.length / 1000;
                        b.setTitle("▶️ Now playing");
                        b.addField("Title", next.title, true);
                        b.addField("Channel name", next.channel, true);
                        b.addField("Length", `${client.util.time(lonk)}`, true);
                        b.addField("Requested by", next.requester);
                        
                        if (megz) {
                            megz.delete({ timeout: 1, reason: "Next song" });
                            megz = await message.channel.send(b);
                        } else {
                            megz = await message.channel.send(b);
                        }
                    }
                    
                    setTimeout(() => {
                        play(next, client, message);
                    }, 400);
                }
                return;
            });
        }

        if (player.track) {
            queue.songs.push(song);
            resolve("queue");
        } else {
            player.playTrack(song.track);
            Object.assign(song, {
                date: Date.now()
            });
            queue.np = song;
            resolve("play");
        }

    });
}

let getSong = async (client, string) => {
    return new Promise(async (resolve, reject) => {
        let res = await client.util.requester(`http://${client.config.lavalink.host}:${client.config.lavalink.restport}/loadtracks?identifier=${encodeURIComponent(string)}`, client.config.lavalink.password, "json");
        if (!res) throw "NO_MATCH";
        resolve(res);
    });
}

module.exports.play = play;
module.exports.getSong = getSong;