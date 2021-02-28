let Discord = require("discord.js");
let second = 1;
let minute = second * 60;
let hour = minute * 60;

module.exports.info = {
    name: "queue",
    aliases: ["q"],
    example: "`#PREFIX##COMMAND#`",
    info: "info",
    tags: ["play","song","music","queue"]
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname),message)) return;
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    let player = client.shoukaku.getPlayer(message.guild.id);
    if (!player || player.track == null) return;
    if (message.member.voice.channel == null) return message.channel.send("You need to be in voice channel");
    let prefix = await client.db.get("guilds",message.guild.id,"prefix");
    let queue = client.queue[message.guild.id];
    let s = queue.np;

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

    let lonk = s.length / 1000;
    let hoursa = Math.floor(lonk / (hour));
    if (hoursa < 10) {
        hoursa = "0" + String(hoursa)
    }
    let minsa = Math.floor((lonk % (hour)) / (minute));
    if (minsa < 10) {
        minsa = "0" + String(minsa)
    }
    let secsa = Math.floor((lonk % (minute)) / (second));
    if (secsa < 10) {
        secsa = "0" + String(secsa)
    }

    let lonm = player.position / 1000
    let hoursb = Math.floor(lonm / (hour));
    if (hoursb < 10) {
        hoursb = "0" + String(hoursb)
    }
    let minsb = Math.floor((lonm % (hour)) / (minute));
    if (minsb < 10) {
        minsb = "0" + String(minsb)
    }
    let secsb = Math.floor((lonm % (minute)) / (second));
    if (secsb < 10) {
        secsb = "0" + String(secsb)
    }

    if (hoursa <= 0) {
        timea = `${minsa}:${secsa}`;
        timeb = `${minsb}:${secsb}`;
    } else {
        timea = `${hoursa}:${minsa}:${secsa}`;
        timeb = `${hoursb}:${minsb}:${secsb}`;
    }

    let ans;
    if (queue.loop && !queue.loopqueue && !queue.shuffle) {
        ans = "🔂 One";
    } else if (!queue.loop && queue.loopqueue && !queue.shuffle) {
        ans = "🔁 All";
    } else if (!queue.loop && !queue.loopqueue && queue.shuffle) {
        ans = "🔀 Shuffle";
    } else if (!queue.loop && queue.loopqueue && queue.shuffle) {
        ans = "🔀🔁 Shuffle Loop";
    } else {
        ans = "↩️ None";
    }

    e.addField(`\`${s.channel}\` - ${s.title}`, `${s.requester} | ${client.util.dateFormat(queue.np.date)}`);
    e.addField("Time", `${timeb}/${timea}`, true);
    e.addField("Loop", `${ans}`, true);
    e.addField("Volume", `${player.volume}`, true);
    let il;
    let longm = 0;
    if (!args[0] || args[0]* 20>queue.songs.length+19 || args[0] <= 0) {
        args[0] = 1;
    }
    if (!isNaN(args[0])) {
        for (il = args[0] > 1 ? (args[0] - 1) * 20 : 0; il < queue.songs.length; il++) {
            song = queue.songs[il];
            longm = 0;
            longm = longm + queue.np.length;
            for (let inda = 0; inda < il; inda++) {
                longm = longm + queue.songs[inda].length;
            }
            if (!(il >= 20 * args[0])) {
                let lonma = (longm-player.position)/ 1000;
                let lonmb = song.length / 1000

                e.addField(`${il+1}. \`${song.channel}\` - ${song.title} | ${client.util.time(lonmb)}`, `${song.requester} | ${client.util.dateFormat(song.date)} | ${client.util.time(lonma)}`);
            }
        }
    }
    let keq = 0;
    for (keq = 0; keq*20 < queue.songs.length; keq++) {}
    if (il - (20 * args[0]) > 0) {
        e.addField(`And ${il-(20*args[0])} more...`, `Use ${prefix}queue <number> to get another page | ${args[0]} of ${keq}`);
    } else {
        e.addField('\u200b', `Use ${prefix}queue <number> to get another page | ${args[0]} of ${keq}`);
    }
    if (player.paused) {
        e.setTitle("⏸️ Queue");
    } else {
        e.setTitle("▶️ Queue");
    }
    message.channel.send(e);

}