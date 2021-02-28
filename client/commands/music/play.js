let Discord = require("discord.js");
let playman = require("./player/player");
let qc = require("./player/queue");
const {
    equalizer
} = require("./player/eq.js");
let second = 1;
let minute = second * 60;
let hour = minute * 60;

module.exports.info = {
    name: "play",
    aliases: ["p"],
    example: "`#PREFIX##COMMAND# <link youtube/soundcloud/spotify (needs to start with https://)>` or `#PREFIX##COMMAND# <music name>`",
    info: "Plays music (and joins bot if needed)\nSpotify playlist loading limit is 100 \nIf using spotify you can offset playlist to load (e.g. you have 200 song playlist and the loading limit is 100 songs use `#PREFIX#play <spotify link>` and then `#PREFIX#play <spotify link> 100` to load next half of the playlist).",
    tags: ["play", "song", "music", "youtube", "soundcloud", "spotify"]
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname), message)) return;
    let im = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[im];
    if (!args[0]) return client.emit("uisae", "U04", message, "");
    let pladb = await client.db.get("guilds", message.guild.id, "player");
    if (pladb.djrole && !message.member.roles.cache.some(role => role.id == pladb.djrole)) return message.channel.send("You need to have DJ role");
    let track = args.join(" ");
    if (message.member.voice.channel == null) return message.channel.send("You need to be in voice channel");
    let prefix = await client.db.get("guilds", message.guild.id, "prefix");

    await playman.getSong(client, track).then(async s => {
        if (s.status == 500) {
            return client.emit("uisae", "P01", message, "Status: " + s.status + " Error: " + s.error + " Message: " + s.message + "\n**Try again later**");
        }
        if (s.loadType == "NO_MATCHES") {
            await playman.getSong(client, `ytsearch:${track}`).then(async songs => {
                if (songs.loadType == "NO_MATCHES") {
                    return client.emit("uisae", "P04", message, "");
                } else if (songs.loadType == "LOAD_FAILED") {
                    await playman.getSong(client, `ytsearch:${track}`).then(async songs => {
                        if (songs.loadType == "NO_MATCHES") {
                            return client.emit("uisae", "P04", message, "");
                        } else if (songs.loadType == "LOAD_FAILED") {
                            return client.emit("uisae", "P01", message, songs.exception.message);
                        } else {
                            await playea(songs.tracks[0], client, message, ce);
                        }
                    });
                } else {
                    await playea(songs.tracks[0], client, message, ce);
                }
            });
        } else if (s.loadType == "PLAYLIST_LOADED") {
            if (!client.queue[message.guild.id]) new qc(message.guild.id, client);
            let queue = client.queue[message.guild.id];
            let c = 0;
            s.tracks.forEach(async song => {
                c++;
                queue.songs.push({
                    title: song.info.title.replace(/`/g, "'"),
                    channel: song.info.author,
                    length: song.info.length,
                    requester: message.author.tag,
                    url: song.info.uri,
                    track: song.track,
                    date: Date.now()
                });
            });

            let z = new Discord.MessageEmbed();
            z.setTitle(`✅ Playlist Loaded`)
            z.setColor(ce);
            if (client.config.settings.subowners.length == 0) {
                z.setFooter("© " + client.users.cache.get(client.config.settings.ownerid).username, client.users.cache.get(client.config.settings.ownerid).avatarURL());
            } else {
                let owners = client.users.cache.get(client.config.settings.ownerid).username
                client.config.settings.subowners.forEach(sub => {
                    owners += ` & ${client.users.cache.get(sub).username}`;
                });
                z.setFooter("© " + owners, client.user.avatarURL());
            }
            z.setTimestamp();
            z.setDescription(`Loaded ${c} songs from playlist`)
            message.channel.send(z);
            await playea(s.tracks[0], client, message, ce);
            if (!queue.songs[0]) {
                await queue.songs.shift();
            }
        } else {
            await playea(s.tracks[0], client, message, ce);
        }
    });

}

function playea(song, client, message, ce) {
    let c = new Discord.MessageEmbed();
    c.setColor(ce);
    if (client.config.settings.subowners.length == 0) {
        c.setFooter("© " + client.users.cache.get(client.config.settings.ownerid).username, client.users.cache.get(client.config.settings.ownerid).avatarURL());
    } else {
        let owners = client.users.cache.get(client.config.settings.ownerid).username
        client.config.settings.subowners.forEach(sub => {
            owners += ` & ${client.users.cache.get(sub).username}`;
        });
        c.setFooter("© " + owners, client.user.avatarURL());
    }
    c.setTimestamp();
    if (!song) return client.emit("uisae", "P01", message, "Something went wrong with song.");
    let s = {
        title: song.info.title.replace(/`/g, "'"),
        channel: song.info.author,
        length: song.info.length,
        requester: message.author.tag,
        url: song.info.uri,
        track: song.track,
        date: Date.now()
    };
    playman.play(s, client, message).then(t => {
        let lonk = s.length / 1000;

        c.addField("Title", s.title, true);
        c.addField("Channel name", s.channel, true);
        c.addField("Length", `${client.util.time(lonk)}`, true);
        c.addField("Requested by", s.requester);
        if (t == "play") {
            c.setTitle("▶️ Playing");
            message.react('▶️');
            message.channel.send(c);
        } else if (t == "queue") {
            c.setTitle("➕ Added to queue");
            message.react('➕');
            message.channel.send(c);
        } else {
            client.emit("uisae", "P01", message, "JUST REPORT THIS ERROR");
        }
    });
}