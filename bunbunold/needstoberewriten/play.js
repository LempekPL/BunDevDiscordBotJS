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
    if (await client.util.blockCheck(client.util.codename(__dirname),message)) return;
    let im = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[im];
    if (!args[0]) return client.emit("uisae", "U04", message, "");
    let pladb = await client.db.get("guilds", message.guild.id, "player");
    if (pladb.djrole && !message.member.roles.cache.some(role => role.id == pladb.djrole)) return message.channel.send("You need to have DJ role");
    let track = args.join(" ");
    if (message.member.voice.channel == null) return message.channel.send("You need to be in voice channel");
    let prefix = await client.db.get("guilds", message.guild.id, "prefix");
    if (args[0].startsWith("https://open.spotify.com/")) {
        let link = args[0].split("/");
        if (args[0].includes("playlist")) {
            link = args[0].includes("user") ? link[6].split("?") : link[4].split("?");
            let apiToken = await client.util.requester(`http://api.badosz.com/base64?text=${client.config.tokens.spotify.id}:${client.config.tokens.spotify.secret}`, client.config.tokens.badosz, "json");
            let toke = await client.util.requester(`https://accounts.spotify.com/api/token`, "Basic " + apiToken.formatted, "json", "Authorization", "POST", ["grant_type", "client_credentials"]);
            let songlist = await client.util.requester(`https://api.spotify.com/v1/playlists/${link[0]}/tracks?total&offset=${0}`, "Bearer " + toke.access_token, "json");
            if (!client.queue[message.guild.id]) new qc(message.guild.id, client);
            let queue = client.queue[message.guild.id];
            let c = 0;
            let corrS = "";
            let corrC = 0;
            let thelist = [];
            let messCont = !queue.songs[0] ? "Loading may take up to 10 seconds (depends on the length of the playlist)\nBut music will start playing after the first song will be loaded (it loads songs randomly, then it sorts them)" : "Loading may take up to 10 seconds (depends on the length of the playlist)";
            let mesg = await message.channel.send(messCont);
            for (ind = 0; ind < songlist.total / 100; ind++) {
                songlist = await client.util.requester(`https://api.spotify.com/v1/playlists/${link[0]}/tracks?fields=items(track(name%2Cartists(name)))%2Ctotal&offset=${ind * 100}`, "Bearer " + toke.access_token, "json");
                await songlist.items.forEach(async (song, i) => {
                    i = i+ 100*ind;
                    let artistList = "";
                    song.track.artists.forEach(artist => {
                        if (!artistList) {
                            artistList = artist.name
                        } else {
                            artistList += " " + artist.name;
                        }
                    });
                    let searchQuery = song.track.name + " " + artistList;
                    let s = await playman.getSong(client, `ytsearch:${searchQuery}`);
                    if (s.status == 500) {
                        return client.emit("uisae", "P01", message, "Status: " + s.status + " Error: " + s.error + " Message: " + s.message + "\n**Try again later**");
                    }
                    if (s.loadType == "NO_MATCHES" || s.loadType == "LOAD_FAILED") {
                        let songs = await playman.getSong(client, `scsearch:${searchQuery}`);
                        if (songs.loadType == "NO_MATCHES") {
                            return client.emit("uisae", "P04", message, "");
                        } else if (songs.loadType == "LOAD_FAILED") {
                            corrC++;
                            corrS += `${searchQuery}\n`;
                        } else {
                            if (i == 0 && !queue.songs[0] && c <= 100) {
                                await playea(songs.tracks[0], client, message, ce);
                            }
                            let songz = songs.tracks[0];
                            if (!songz) {
                                console.log("ERROR1");
                                console.log(songz);
                                songz = songs.tracks[1];
                            }
                            if (!songz) {
                                console.log("ERROR");
                                console.log(songs);
                                client.emit("uisae", "P01", message, "ERROR with loading song, please try again");
                                songz = songs.tracks[2];
                            }
                            thelist[i] = {
                                title: songz.info.title.replace(/`/g, "'"),
                                channel: songz.info.author,
                                length: songz.info.length,
                                requester: message.author.tag,
                                url: songz.info.uri,
                                track: songz.track,
                                date: Date.now()
                            };
                            c++;
                        }

                    } else {
                        if (i == 0 && !queue.songs[0] && c <= 100) {
                            await playea(s.tracks[0], client, message, ce);
                        }
                        let sos = s.tracks[0];
                        thelist[i] = {
                            title: sos.info.title.replace(/`/g, "'"),
                            channel: sos.info.author,
                            length: sos.info.length,
                            requester: message.author.tag,
                            url: sos.info.uri,
                            track: sos.track,
                            date: Date.now()
                        };
                        c++;
                    }
                    if (songlist.total == c) {
                        thelist.forEach(async son => {
                            await queue.songs.push(son);
                        });
                        let z = new Discord.MessageEmbed();
                        z.setTitle(`✅ Spotify playlist Loaded`)
                        z.setColor(ce);
                        if (client.config.settings.subowners.length==0) {
                            z.setFooter("© "+client.users.cache.get(client.config.settings.ownerid).username, client.users.cache.get(client.config.settings.ownerid).avatarURL());
                        } else {
                            let owners = client.users.cache.get(client.config.settings.ownerid).username
                            client.config.settings.subowners.forEach(sub => {
                                owners+=` & ${client.users.cache.get(sub).username}`;
                            });
                            z.setFooter("© "+owners, client.user.avatarURL());
                        }
                        z.setTimestamp();
                        z.setDescription(`Loaded ${c} songs from playlist`);
                        message.channel.send(z);
                        if (corrC > 0) {
                            client.emit("uisae", "P15", message, [corrC, corrS]);
                        };
                        if (queue.songs[0]) {
                            await queue.songs.shift();
                        };
                        mesg.delete();
                    } else {
                        if (ind < c/100) {
                            client.emit("uisae", "P01", message, "Something went wrong when loading playlist\n**Try again later**");
                            mesg.delete();
                        }
                    }
                });
            }
        } else if (args[0].includes("track")) {
            link = args[0].includes("user") ? link[6].split("?") : link[4].split("?");
            let apiToken = await client.util.requester(`http://api.badosz.com/base64?text=${client.config.tokens.spotify.id}:${client.config.tokens.spotify.secret}`, client.config.tokens.badosz, "json");
            let toke = await client.util.requester(`https://accounts.spotify.com/api/token`, "Basic " + apiToken.formatted, "json", "Authorization", "POST", ["grant_type", "client_credentials"]);
            let song = await client.util.requester(`https://api.spotify.com/v1/tracks/${link[0]}`, "Bearer " + toke.access_token, "json");
            let artistList = "";
            console.log(song)
            song.artists.forEach(artist => {
                if (!artistList) {
                    artistList = artist.name
                } else {
                    artistList += " " + artist.name;
                }
            });
            let searchQuery = song.name + " " + artistList;
            let s = await playman.getSong(client, `ytsearch:${searchQuery}`);
            if (s.status == 500) {
                return client.emit("uisae", "P01", message, "Status: " + s.status + " Error: " + s.error + " Message: " + s.message + "\n**Try again later**");
            }
            if (s.loadType == "NO_MATCHES" || s.loadType == "LOAD_FAILED") {
                let songs = await playman.getSong(client, `scsearch:${searchQuery}`);
                if (songs.loadType == "NO_MATCHES") {
                    return client.emit("uisae", "P04", message, "");
                } else if (songs.loadType == "LOAD_FAILED") {
                    return client.emit("uisae", "P01", message, songs.exception.message);
                } else {
                    await playea(songs.tracks[0], client, message, ce);
                }

            } else {
                await playea(s.tracks[0], client, message, ce);
            }
        } else {
            return client.emit("uisae", "P14", message);
        }
    } else {
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
                if (client.config.settings.subowners.length==0) {
                    z.setFooter("© "+client.users.cache.get(client.config.settings.ownerid).username, client.users.cache.get(client.config.settings.ownerid).avatarURL());
                } else {
                    let owners = client.users.cache.get(client.config.settings.ownerid).username
                    client.config.settings.subowners.forEach(sub => {
                        owners+=` & ${client.users.cache.get(sub).username}`;
                    });
                    z.setFooter("© "+owners, client.user.avatarURL());
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