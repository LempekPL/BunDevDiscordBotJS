let Discord = require("discord.js");
let playman = require("./player/player");
let qc = require("./player/queue");

module.exports.info = {
    name: "playlist",
    aliases: ["pl"],
    example: "`#PREFIX##COMMAND#` or `#PREFIX##COMMAND# -h` for more options",
    info: "Save your favourite songs.",
    tags: ["save", "pl", "playlist", "music", "spotify", "youtube", "soundcloud"]
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname), message)) return;
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    let queue = client.queue[message.guild.id];
    let prefix = await client.db.get("guilds", message.guild.id, "prefix");
    let pldb = await client.db.get("users", message.author.id, "playlists");
    let e = new Discord.MessageEmbed();
    e.setColor(ce);
    if (client.config.settings.subowners.length == 0) {
        e.setFooter("© " + client.users.cache.get(client.config.settings.ownerid).username, client.users.cache.get(client.config.settings.ownerid).avatarURL());
    } else {
        let owners = client.users.cache.get(client.config.settings.ownerid).username
        client.config.settings.subowners.forEach(sub => {
            owners += ` & ${client.users.cache.get(sub).username}`;
        });
        e.setFooter("© " + owners, client.user.avatarURL());
    }
    e.setTimestamp();
    e.setTitle("📁 Playlist");
    switch (args[0]) {
        case "-e":
        case "-h":
        case "-edit":
        case "-help":
            let embeda = new Discord.MessageEmbed();
            embeda.setColor(ce);
            embeda.setDescription(`
            Use \`${prefix}playlist <value>\`
            **Save** (s)
            > --save <name lowercase without spaces> (saves current playlist)
            **Add** (a)
            > --add <name lowercase without spaces> <song num from queue (0 is current song) or song num from queue (e.g. 3-10 will add songs to playlist from queue position 3 to 10) or \`all\`> (add selected songs to playlist)
            **Update** (u) 
            > --update <name lowercase without spaces> (edits selected playlist with current one)
            **Move** (d)
            > --move <name lowercase without spaces> <num song> <place num> (moves song to selected place in selected playlist)
            **Replace** (r)
            > --replace <name lowercase without spaces> <num song 1> <num song 2> (replaces songs together in selected playlist)
            **Delete** (d)
            > --delete <name lowercase without spaces> (deletes selected playlist)
            **Remove** (re) 
            > --remove <name lowercase without spaces> <num song from display or song num from display (e.g. 1-14 will remove songs from playlist in position 1 to 14)> (removes selected song from playlist)
            **Load** (l)
            > --load <name lowercase without spaces> (loads selected playlist)
            **Display** (di)
            > --display <name lowercase without spaces> (displays selected playlist, playlists names are in user options)
            `);
            embeda.setTitle(`Playlist Edit`);
            if (client.config.settings.subowners.length == 0) {
                embeda.setFooter("© " + client.users.cache.get(client.config.settings.ownerid).username, client.users.cache.get(client.config.settings.ownerid).avatarURL());
            } else {
                let owners = client.users.cache.get(client.config.settings.ownerid).username
                client.config.settings.subowners.forEach(sub => {
                    owners += ` & ${client.users.cache.get(sub).username}`;
                });
                embeda.setFooter("© " + owners, client.user.avatarURL());
            }
            embeda.setTimestamp();
            message.channel.send(embeda);
            break;

            // **Move** (m) !!DONT WORK!!
            // > --move <name lowercase without spaces> <num song to move> <num position to move> (moves selected song to specified place in playlist)
        case "--save":
        case "-s":
        case "--create":
        case "-c":
            if (message.member.voice.channel == null) return message.channel.send("You need to be in voice channel");
            if (!queue || (queue.songs.length == 0 && !queue.np.track)) {
                message.channel.send("Queue and now playing song are empty");
                return;
            }
            no = 0;
            client.config.settings.subowners.forEach(sub => {
                if (message.author.id != sub) {
                    no++;
                }
            });
            let sG = client.guilds.cache.get(client.config.settings.supportServer).members.cache.get(message.author.id).roles.cache;
            if (pldb.length >= 1000 && (client.config.settings.ownerid == message.author.id || no != client.config.settings.subowners.length)) {
                message.channel.send("You can only save up to 1000 playlists\nSorry you can't have more");
                return;
            } else if (pldb.length >= 200 && sG.has(client.config.settings.betaroleid)) {
                message.channel.send("You can only save up to 500 playlists\nJoin staff in support server to bump it even more.");
                return;
                // } else if (pldb.length >= 500 && sG.has(client.config.settings.betaroleid)) {
                //     message.channel.send("You can only save up to 500 playlists\nJoin VIPs in support server to bump it even more.");
                //     return;
            } else if (pldb.length >= 40 && client.guilds.cache.get(client.config.settings.supportServer).member(message.author)) {
                message.channel.send("You can only save up to 40 playlists\nJoin betatesters in support server to bump it to 200.");
                return;
            } else if (pldb.length >= 10 && !client.guilds.cache.get(client.config.settings.supportServer).member(message.author)) {
                message.channel.send("You can only save up to 10 playlists\nJoin support server to bump it to 40. `" + prefix + "links`");
                return;
            }
            if (!isNaN(args[1].slice()[0])) {
                message.channel.send("Names can't start with numbers");
                return;
            }
            if (pldb[args[1].toLowerCase()]) {
                message.channel.send("This playlist already exists. Use `" + prefix + "playlist --update " + args[1].toLowerCase() + "` or `" + prefix + "playlist --add " + args[1].toLowerCase() + " all`");
                return;
            }
            lista = queue.songs.slice(0);
            let song = queue.np;
            lista.unshift(song);
            pldb[args[1].toLowerCase()] = lista;
            await client.db.update('users', message.author.id, 'playlists', pldb);
            message.channel.send("Playlist settings saved as `" + args[1].toLowerCase() + "`");
            break;

        case "--update":
        case "-u":
            if (message.member.voice.channel == null) return message.channel.send("You need to be in voice channel");
            if (!queue || (queue.songs.length == 0 && !queue.np.track)) {
                message.channel.send("Queue and now playing song are empty");
                return;
            }
            if (!pldb[args[1].toLowerCase()]) {
                message.channel.send("This playlist doesn't exists. Use `" + prefix + "playlist --save " + args[1].toLowerCase() + "`");
                return;
            }
            liste = queue.songs.slice(0);
            let songg = queue.np;
            liste.unshift(songg);
            pldb[args[1].toLowerCase()] = liste;
            await client.db.update('users', message.author.id, 'playlists', pldb);
            message.channel.send("Playlist settings saved as `" + args[1].toLowerCase() + "`");
            break;

        case "--add":
        case "-a":
            if (message.member.voice.channel == null) return message.channel.send("You need to be in voice channel");
            if (!queue || (queue.songs.length == 0 && !queue.np.track)) {
                message.channel.send("Queue and now playing song are empty");
                return;
            }
            if (!pldb[args[1].toLowerCase()]) {
                message.channel.send("This playlist doesn't exists. Use `" + prefix + "playlist --save " + args[1].toLowerCase() + "`");
                return;
            }
            let list = [];
            if (!args[2]) {
                list = queue.songs.slice(0);
                let songa = queue.np;
                list.unshift(songa);
            } else if (args[2] == "all") {
                list = queue.songs.slice(0);
                let songa = queue.np;
                list.unshift(songa);
            } else if (args[2].includes("-")) {
                let ara = args[2].split('-');
                if (ara[0] == 0) {
                    ara[0] = 1;
                }
                if (ara[0] > ara[1]) return;
                list = queue.songs.slice(ara[0] - 1, ara[1]);
                if (args[2].split('-')[0] == 0) {
                    let songi = queue.np;
                    list.unshift(songi);
                }
            } else if (!isNaN(args[2])) {
                if (args[2] == 0) {
                    list.push(queue.np);
                } else {
                    list = queue.songs.slice(0);
                    list = list.slice(args[2] - 1, args[2]);
                }
            } else {
                list = queue.songs.slice(0);
                let songa = queue.np;
                list.unshift(songa);
            }
            list.forEach(sdata => {
                pldb[args[1].toLowerCase()].push(sdata);
            });
            await client.db.update('users', message.author.id, 'playlists', pldb);
            message.channel.send("Songs added to the playlist `" + args[1].toLowerCase() + "`");
            break;

        case "--move":
        case "-m":
            if (!pldb[args[1].toLowerCase()]) {
                message.channel.send("This playlist doesn't exists.");
                return;
            }
            pldb[args[1].toLowerCase()].splice(Number(args[2]) - 1, 0, pldb[args[1].toLowerCase()].splice(Number(args[3]) - 1, 1)[0]);
            await client.db.update('users', message.author.id, 'playlists', pldb);
            message.channel.send("Song in playlist `" + args[1].toLowerCase() + "` moved");
            break;

        case "--replace":
        case "-r":
            if (!pldb[args[1].toLowerCase()]) {
                message.channel.send("This playlist doesn't exists.");
                return;
            }
            pldb[args[1].toLowerCase()].splice(Number(args[2]) -1, 0, pldb[args[1].toLowerCase()].splice(Number(args[3]) -1, 1)[0]);
            pldb[args[1].toLowerCase()].splice(Number(args[3])-1, 0, pldb[args[1].toLowerCase()].splice(Number(args[2]), 1)[0]);
            await client.db.update('users', message.author.id, 'playlists', pldb);
            message.channel.send("Songs in playlist `" + args[1].toLowerCase() + "` replaced");
            break;

        case "--delete":
        case "-d":
            if (!pldb[args[1].toLowerCase()]) {
                message.channel.send("This playlist doesn't exists.");
                return;
            }
            pldb[args[1].toLowerCase()] = false;
            await client.db.update('users', message.author.id, 'playlists', pldb);
            message.channel.send("Playlist deleted `" + args[1].toLowerCase() + "`");
            break;

        case "--remove":
        case "-re":
            if (!pldb[args[1].toLowerCase()]) {
                message.channel.send("This playlist doesn't exists.");
                return;
            }
            if (!args[2] || args[2] < 1 || args[2] > pldb[args[1].toLowerCase()].length) {
                return client.emit("uisae", "U06", message, [1, pldb[args[1].toLowerCase()].length]);
            }
            if (args[2].includes("-")) {
                let ara = args[2].split('-');
                if (ara[0] < 1) {
                    return client.emit("uisae", "U06", message, [1, pldb[args[1].toLowerCase()].length]);
                } else if (ara[1] > pldb[args[1].toLowerCase()]) {
                    return client.emit("uisae", "U06", message, [1, pldb[args[1].toLowerCase()].length]);
                } else if (ara[0] > ara[1]) {
                    return client.emit("uisae", "U06", message, [1, pldb[args[1].toLowerCase()].length]);
                }
                pldb[args[1].toLowerCase()].splice(ara[0] - 1, ara[1]);
            } else if (!isNaN(args[2])) {
                if (args[2] == 0) {
                    list = queue.np;
                } else {
                    pldb[args[1].toLowerCase()].splice(args[2] - 1, args[2]);
                }
            } else {
                return client.emit("uisae", "U06", message, [1, pldb[args[1].toLowerCase()].length]);
            }
            await client.db.update('users', message.author.id, 'playlists', pldb);
            message.channel.send("Songs deleted from playlist `" + args[1].toLowerCase() + "`");
            break;

        case "--load":
        case "-l":
            if (message.member.voice.channel == null) return message.channel.send("You need to be in voice channel");
            if (!pldb[args[1].toLowerCase()]) {
                message.channel.send("This playlist doesn't exists. Use `" + prefix + "playlist --save " + args[1].toLowerCase() + "`");
                return;
            }
            if (!client.queue[message.guild.id] || !client.queue[message.guild.id].np.track) {
                if (!client.queue[message.guild.id]) {
                    queue = new qc(message.guild.id, client);
                }
                let s = {
                    title: pldb[args[1].toLowerCase()][0].title.replace(/`/g, "'"),
                    channel: pldb[args[1].toLowerCase()][0].channel,
                    length: pldb[args[1].toLowerCase()][0].length,
                    requester: pldb[args[1].toLowerCase()][0].requester,
                    url: pldb[args[1].toLowerCase()][0].url,
                    track: pldb[args[1].toLowerCase()][0].track,
                    date: Date.now()
                };
                await playman.play(s, client, message).then(t => {
                    let lonk = s.length / 1000;

                    e.addField("Title", s.title, true);
                    e.addField("Channel name", s.channel, true);
                    e.addField("Length", `${client.util.time(lonk)}`, true);
                    e.addField("Requested by", s.requester);
                    if (t == "play") {
                        e.setTitle("▶️ Playing");
                        message.channel.send(e);
                    } else if (t == "queue") {
                        e.setTitle("➕ Added to queue");
                        message.channel.send(e);
                    } else {
                        client.emit("uisae", "P01", message, "JUST REPORT THIS ERROR");
                    }
                });
                await pldb[args[1].toLowerCase()].forEach(song => {
                    queue.songs.push({
                        title: song.title.replace(/`/g, "'"),
                        channel: song.channel,
                        length: song.length,
                        requester: song.requester,
                        url: song.url,
                        track: song.track,
                        date: Date.now()
                    });
                });
                await queue.songs.shift();
            } else {
                pldb[args[1].toLowerCase()].forEach(song => {
                    queue.songs.push({
                        title: song.title.replace(/`/g, "'"),
                        channel: song.channel,
                        length: song.length,
                        requester: song.requester,
                        url: song.url,
                        track: song.track,
                        date: Date.now()
                    });
                });
            }
            await message.channel.send("Loaded playlist `" + args[1].toLowerCase() + "`");
            break;

        case "--display":
        case "-di":
            if (!pldb[args[1].toLowerCase()]) {
                message.channel.send("This playlist doesn't exists. Use `" + prefix + "playlist --save " + args[1].toLowerCase() + "`");
                return;
            }
            let songi = pldb[args[1].toLowerCase()];
            let il;
            let longm = 0;
            let datasg = "";
            if (!args[2] || args[2] * 20 > songi.length + 19 || args[2] <= 0) {
                args[2] = 1;
            }
            if (!isNaN(args[2])) {
                for (il = args[2] > 1 ? (args[2] - 1) * 20 : 0; il < songi.length; il++) {
                    songs = songi[il];
                    for (let inda = 0; inda < il; inda++) {
                        longm = longm + songi[inda].length;
                    }
                    if (!(il >= 20 * args[2])) {
                        datasg += `\n ${il+1}. \`${songs.channel}\` - ${songs.title} | ${client.util.time(songs.length/1000)}`;
                    }
                }
            }
            e.setDescription(`**Playlist \`${args[1].toLowerCase()}\`** ${datasg}`);
            let keq = 0;
            for (keq = 0; keq * 20 < songi.length; keq++) {}
            if (il - (20 * args[2]) > 0) {
                e.addField(`And ${il-(20*args[2])} more...`, `Use ${prefix}playlist --display ${args[1].toLowerCase()} <number> to get another page | ${args[2]} of ${keq}`);
            } else {
                e.addField('\u200b', `Use ${prefix}playlist --display ${args[1].toLowerCase()} <number> to get another page | ${args[2]} of ${keq}`);
            }
            message.channel.send(e);
            break;

        default:
            let datapl = "";
            ipl = 1;
            for (let prop in pldb) {
                if (pldb[prop]) {
                    datapl += datapl ? `\n> ${ipl}. ${prop}` : `> ${ipl}. ${prop}`;
                    ipl++;
                }
            }
            if (ipl == 1) {
                datapl = "> none";
            }
            e.setDescription(`
**Playlists**
${datapl}

Use \`${prefix}playlist --edit\` if you want to change options
            `);
            message.channel.send(e);
            break;
    }
}