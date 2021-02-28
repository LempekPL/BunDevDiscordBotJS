let Discord = require("discord.js");
let playman = require("./player/player");
let rm = require('discord.js-reaction-menu');

module.exports.info = {
    name: "search",
    example: "`#PREFIX##COMMAND# <search term>`",
    info: "Searches for music (and joins bot if needed)\nTo search through soundcloud start with -sc",
    tags: ["play", "song", "music", "youtube", "soundcloud", "search"]
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname),message)) return;
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    if (!args[0]) return client.emit("uisae", "U04", message, "");
    let pladb = await client.db.get("guilds",message.guild.id,"player");
    if (pladb.djrole && !message.member.roles.cache.some(role => role.id == pladb.djrole)) return message.channel.send("You need to have DJ role");
    if (message.member.voice.channel == null) return message.channel.send("You need to be in voice channel");
    let track = args.join(" ");
    let searchType = track.startsWith("-sc") ? "scsearch:"+track : "ytsearch:"+track
    await playman.getSong(client, `${searchType}`).then(async songs => {
        if (songs.loadType == "NO_MATCHES") {
            return client.emit("uisae", "P04", message, "");
        } else if (songs.loadType == "LOAD_FAILED") {
            return client.emit("uisae", "P01", message, songs.exception.message);
        } else {
            let e = new Discord.MessageEmbed();
            e.setColor(ce);
            if (client.config.settings.subowners.length==0) {
                e.setFooter("© "+client.users.cache.get(client.config.settings.ownerid).username, client.users.cache.get(client.config.settings.ownerid).avatarURL());
            } else {
                let owners = client.users.cache.get(client.config.settings.ownerid).username
                client.config.settings.subowners.forEach(sub => {
                    owners+=` & ${client.users.cache.get(sub).username}`;
                });
                e.setFooter("© "+owners, client.user.avatarURL());
            }
            e.setTimestamp();
            e.setTitle("Music search 🎧");
            songs.tracks.forEach((s, i) => {
                if(i >= 10) return;
                let lonmb = s.info.length / 1000
                e.addField(`${i+1}. ${s.info.title}`, `${s.info.author} | ${client.util.time(lonmb)}`);
            });
            e.addField('\u200b', `Reply with number to choose song. You have 30 seconds. Type \`cancel\` to cancel`);
            let msearch;
            message.channel.send(e).then(mes => msearch = mes);

            let collector = message.channel.createMessageCollector(m => m.author = message.author, {time: 30000});
            collector.on("collect", async m => {
                if(m.content.toLowerCase().startsWith("cancel")) {
                    collector.stop();
                    return message.channel.send("Canceled ✅")
                }
                
                songs.tracks.forEach(async (s, i) => {
                    if(i >= 10) return;
                    if(Number(m.content) == i+1) {
                        await playea(s, client, message, ce);
                        collector.stop();
                    }
                });
            });
            collector.on("end", () => {
                msearch.delete();
            });
        }
    });
}

function playea(song, client, message, ce) {
    let c = new Discord.MessageEmbed();
    c.setColor(ce);
    if (client.config.settings.subowners.length==0) {
        c.setFooter("© "+client.users.cache.get(client.config.settings.ownerid).username, client.users.cache.get(client.config.settings.ownerid).avatarURL());
    } else {
        let owners = client.users.cache.get(client.config.settings.ownerid).username
        client.config.settings.subowners.forEach(sub => {
            owners+=` & ${client.users.cache.get(sub).username}`;
        });
        c.setFooter("© "+owners, client.user.avatarURL());
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
            c.setTitle("▶️ Now playing");
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