let Discord = require("discord.js");
let emo = {
    youtube: "<:yt:815379220137377792>",
    twitch: "<:twitch:815379239427375115>",
    twitter: "<:twitter:815379259128283156>",
    reddit: "<:reddit:815379278308573204>",
    github: "<:github:815379304766242867>",
    steam: "<:steam:815379325524115517>",
    ownwebsite: "<:web:815379350400270336>",
    spotify: "<:spotify:815379372609241138>",
    soundcloud: "<:soundcloud:815379393667923999>",
    instagram: "<:insta:815383957923168268>",
    facebook: "<:facebook:815383971495673917>"
}

module.exports.info = {
    name: "links",
    lang: {
        en: {
            main: "links",
            aliases: ["invite", "botinvite", "giveinvite", "updates", "trello", "roadmap", "dashboard", "website"]
        },
        pl: {
            main: "linki",
            aliases: ["dodaj", "aktualności", "dashboard", "strona"]
        }
    },
    tags: ["botinvite", "giveinvite", "invite", "support", "server","roadmap","updates","future","links","websites", "dashboard"]
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client, __dirname, message)) return;
    let embed = new Discord.MessageEmbed();
    embed.setColor(client.util.randomColorConfig(client));
    embed.setTitle(`${client.words.all.links.links}:`);
    embed.addField(`${client.words.all.links.supportServer}`, `[<:bot:815379078776619070> [DISCORD LINK]](https://discord.gg/e3uQ6aC)`);
    embed.addField(`${client.words.all.links.invite}`, `[<:bunbun_green_ear:815379123643088936> [BOT LINK]](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8&guild_id=${message.guild.id})`);
    embed.addField(`${client.words.all.links.website}`, `[<:bunbun_blue:815379165942382622> [WEBSITE LINK]](https://bunbun.lempek.tk)`);
    embed.addField(`${client.words.all.links.roadmap}`, `[<:bunbun_yellow:815379201536163851> [TRELLO LINK]](https://trello.com/b/0d15e7X7/bunbun)`);
    embed.addField(`${client.words.all.links.sourceCode}`, `[<:bunbun_red:815379923799375893> [GITHUB LINK]](https://github.com/LempekPL/BunBun)`);

    let links = "";
    for (let naz in client.config.socialLinks) {
        if (client.config.socialLinks[naz]) {
            if (!links) {
                links = `[${emo[naz]}](${client.config.socialLinks[naz]})`
            } else {
                links += ` | [${emo[naz]}](${client.config.socialLinks[naz]})`
            }
        }
    }

    embed.addField(`${client.words.all.links.socialLinks}`, `${links}`);
    client.util.setFooterOwner(client, embed);
    embed.setTimestamp();
    message.channel.send(embed);
}