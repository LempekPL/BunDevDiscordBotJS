let Discord = require("discord.js");
let eq = require("./player/eq.js");
let bandz = [
    "25Hz",
    "40Hz",
    "63Hz",
    "100Hz",
    "160Hz",
    "250Hz",
    "400Hz",
    "630Hz",
    "1KHz",
    "1.6KHz",
    "2.5KHz",
    "4KHz",
    "6.3KHz",
    "10KHz",
    "16KHz"
];

module.exports.info = {
    name: "equalizer",
    aliases: ["eq"],
    example: "`#PREFIX##COMMAND# <band> <gain>` or `#PREFIX##COMMAND# <preset>` or `#PREFIX##COMMAND# -h`",
    info: "Change equalizer. There are 15 bands. Gain values range from -0.25 to 1.0, where -0.25 means the given band is completely muted, and 0.25 means it is doubled. Available presets: `pop`, `rock`, `jazz`,  `hiphop`, `electric`, `metal`, `bassboost`, `earrape`, `reset`",
    tags: ["eq", "equalizer", "earrape","music"]
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
    let prefix = await client.db.get("guilds", message.guild.id, "prefix");
    let eqdb = await client.db.get("users", message.author.id, "equalizers");
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
    e.setTitle("🎚️ Equalizer");

    switch (args[0]) {
        case "-e":
        case "-h":
        case "-edit":
        case "-help":
            let embeda = new Discord.MessageEmbed();
            embeda.setColor(ce);
            embeda.setDescription(`
            Use \`${prefix}equalizer <value>\`
            **Save** (s)
            > --save <name lowercase without spaces> (saves current equalizer)
            **Delete** (d)
            > --delete <name lowercase without spaces> (deletes selected equalizer)
            **Update** (up)
            > --update <name lowercase without spaces> (edits selected equalizer with current one)
            **Use** (u)
            > --use <name lowercase without spaces> (uses selected equalizer)
            `);
            embeda.setTitle(`Equalizer Edit`);
            if (client.config.settings.subowners.length==0) {
                embeda.setFooter("© "+client.users.cache.get(client.config.settings.ownerid).username, client.users.cache.get(client.config.settings.ownerid).avatarURL());
            } else {
                let owners = client.users.cache.get(client.config.settings.ownerid).username
                client.config.settings.subowners.forEach(sub => {
                    owners+=` & ${client.users.cache.get(sub).username}`;
                });
                embeda.setFooter("© "+owners, client.user.avatarURL());
            }
            embeda.setTimestamp();
            message.channel.send(embeda);
            break;

        case "--save":
        case "-s":
            no = 0;
            client.config.settings.subowners.forEach(sub => {
                if (message.author.id != sub) {
                    no++;
                }
            });
            let sG = client.guilds.cache.get(client.config.settings.supportServer).members.cache.get(message.author.id).roles.cache;
            if (eqdb.length >= 1000000 && (client.config.settings.ownerid == message.author.id || no != client.config.settings.subowners.length)) {
                message.channel.send("You can only save up to 1000000 equalizer settings\nSorry you can't have more");
                return;
            } else if (eqdb.length >= 500 && sG.has(client.config.settings.betaroleid)) {
                message.channel.send("You can only save up to 500 equalizer settings\nJoin staff in support server to bump it even more.");
                return;
            // } else if (eqdb.length >= 1500 && sG.has(client.config.settings.betaroleid)) {
            //     message.channel.send("You can only save up to 500 equalizer settings\nJoin VIPs in support server to bump it even more.");
            //     return;
            } else if (eqdb.length >= 50 && client.guilds.cache.get(client.config.settings.supportServer).member(message.author)) {
                message.channel.send("You can only save up to 50 equalizer settings\nJoin betatesters in support server to bump it to 500.");
                return;
            } else if (eqdb.length >= 15 && !client.guilds.cache.get(client.config.settings.supportServer).member(message.author)) {
                message.channel.send("You can only save up to 15 equalizer settings\nJoin support server to bump it to 50. `" + prefix + "links`");
                return;
            }
            if (!isNaN(args[1].slice()[0])) {
                message.channel.send("Names can't start with numbers");
                return;
            }
            if (eqdb[args[1].toLowerCase()]) {
                message.channel.send("This equalizer settings already exists. Use `" + prefix + "equalizer --update " + args[1].toLowerCase() + "`");
                return;
            }
            eqdb[args[1].toLowerCase()] = eq.equalizer(player);
            await client.db.update('users', message.author.id, 'equalizers', eqdb);
            message.channel.send("Equalizer settings saved as `" + args[1].toLowerCase() + "`");
            break;

        case "--update":
        case "-up":
            if (!eqdb[args[1].toLowerCase()]) {
                message.channel.send("This equalizer settings doesn't exists. Use `" + prefix + "equalizer --save " + args[1].toLowerCase() + "`");
                return;
            }
            eqdb[args[1].toLowerCase()] = eq.equalizer(player);
            await client.db.update('users', message.author.id, 'equalizers', eqdb);
            message.channel.send("Equalizer settings edited");
            break;

        case "--delete":
        case "-d":
            if (!eqdb[args[1].toLowerCase()]) {
                message.channel.send("This equalizer setting doesn't exists.");
                return;
            }
            eqdb[args[1].toLowerCase()] = false;
            await client.db.update('users', message.author.id, 'equalizers', eqdb);
            message.channel.send("Equalizer settings deleted `" + args[1].toLowerCase() + "`");
            break;

        case "--use":
        case "-u":
            if (!eqdb[args[1].toLowerCase()]) {
                message.channel.send("This equalizer settings doesn't exists. Use `" + prefix + "equalizer --save " + args[1].toLowerCase() + "`");
                return;
            }
            player.bands = eqdb[args[1].toLowerCase()];
            player.setEqualizer(player.bands);
            message.channel.send("Using player settings `" + args[1].toLowerCase() + "`");
            break;

        default:
            if (!args[0]) {
                let equa = "";
                let eqdata = await eq.equalizer(player);
                eqdata.forEach((bands, i) => {
                    equa = equa + `${i+1}. \`${bandz[i]}\`: ${bands.gain}\n`;
                });
                e.setDescription(`${equa}`);
                e.addField(`To change use preset or choose band (\`1\` - \`15\`) and gain (\`-0.25\` - \`1\`)`, `Available presets \`${prefix}help equalizer\`\nUse \`${prefix}equalizer --edit\` if you want to save equalizer`);
                message.channel.send(e);
            } else if (!args[1]) {
                let re = eq.setEqualizer(player, null, null, args[0]);
                if (!re) {
                    e.setDescription(`Changed preset to ${args[0]}`);
                    message.channel.send(e);
                } else if (re == "PRDNE") return client.emit("uisae", "P02", message, "");
            } else {
                let a = Number(args[0]);
                let b = Number(args[1]);
                if (isNaN(a) || a > 15 || a < 1) return message.channel.send("You need to use preset or choose band (`1` - `15`)");
                if (isNaN(b) || b > 1 || b < -0.25) return message.channel.send("You need to choose gain (`-0.25` - `1`)");
                let re = eq.setEqualizer(player, a, b);
                if (!re) {
                    e.setDescription(`Changed \`${bandz[a-1]}\` band to \`${b}\``);
                    message.channel.send(e);
                }
            }
            break;
    }
}