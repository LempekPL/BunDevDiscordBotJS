let Discord = require("discord.js");
let equaliz = require("./player/eq");
let second = 1;
let minute = second * 60;
let hour = minute * 60;
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
    name: "nowplaying",
    aliases: ["np"],
    example: "`#PREFIX##COMMAND#`",
    info: "Shows now playing song",
    tags: ["song", "playing", "now", "music"]
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname),message)) return;
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    let player = client.shoukaku.getPlayer(message.guild.id);
    if (!player || player.track == null) return;
    if (message.member.voice.channel == null) return message.channel.send("You need to be in voice channel");
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

    e.addField("Title", s.title, true);
    e.addField("Channel name", s.channel, true);
    e.addField("Time", `${timeb}/${timea}`);
    e.addField("Loop", `${ans}`, true);
    e.addField("Volume", `${player.volume}`, true);

    let equa = "";
    let eqdata = equaliz.equalizer(player);
    eqdata.forEach((bands, i) => {
        equa = equa + `${i+1}. \`${bandz[i]}\`: ${bands.gain}\n`;
    });

    e.addField("Equalizer", `${equa}`);
    e.addField("Added", `${client.util.dateFormat(queue.np.date)}`, true);
    e.addField("Requested by", s.requester, true);
    if (player.paused) {
        e.setTitle("⏸️ Now playing");
    } else {
        e.setTitle("▶️ Now playing");
    }
    message.channel.send(e);

}