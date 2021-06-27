const Discord = require("discord.js");
const emo = {
    youtube: "Youtube <:yt:815379220137377792>",
    twitch: "Twitch <:twitch:815379239427375115>",
    twitter: "Twitter <:twitter:815379259128283156>",
    reddit: "Reddit <:reddit:815379278308573204>",
    github: "Github <:github:815379304766242867>",
    telegram: "Telegram <:telegram:858674664288944148>",
    steam: "Steam <:steam:815379325524115517>",
    ownwebsite: "Website <:web:815379350400270336>",
    spotify: "Spotify <:spotify:815379372609241138>",
    soundcloud: "Soundcloud <:soundcloud:815379393667923999>",
    instagram: "Instagram <:insta:815383957923168268>",
    newgrounds: "Newgrounds <:newgrounds:858671128544149505>",
    furaffinity: "Furaffinity <:fa:858671128452923425>",
    furmap: "Furmap <:furmap:858675131084570624>",
    itch: "Itch <:itchio:858671128452923422>",
    namemc: "Namemc <:namemc:858671128402460712>",
    lempek: "Lempek <:lempek:858671085502595082>"
}

module.exports.info = {
    name: "links",
    lang: {
        en: require("../../../lang/en.json").command.links.infoData
    },
        // pl: {
        //     main: "linki",
        //     aliases: ["dodaj", "aktualności", "dashboard", "strona"]
        // }
    tags: ["botinvite", "giveinvite", "invite", "support", "server","roadmap","updates","future","links","websites", "dashboard"]
}

module.exports.run = async (client, message, args) => {
    let embed = new Discord.MessageEmbed();
    embed.setColor(client.util.randomColorConfig(client));
    embed.setTitle(`${client.words.all.links.links}:`);
    embed.addField(`${client.words.all.links.supportServer}`, `[<:bot:815379078776619070> [DISCORD LINK]](https://discord.gg/e3uQ6aC)`);
    embed.addField(`${client.words.all.links.invite}`, `[<:bunbun_green_ear:815379123643088936> [BOT LINK]](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8&guild_id=${message.guild.id})`);
    embed.addField(`${client.words.all.links.website}`, `[<:bunbun_blue:815379165942382622> [WEBSITE LINK]](https://bunbun.lempek.tk)`);
    embed.addField(`${client.words.all.links.roadmap}`, `[<:bunbun_yellow:815379201536163851> [TRELLO LINK]](https://trello.com/b/0d15e7X7/bunbun)`);
    embed.addField(`${client.words.all.links.sourceCode}`, `[<:bunbun_red:815379923799375893> [GITHUB LINK]](https://github.com/LempekPL/BunBun)`);

    let links = "";
    let i = 0;
    for (let naz in client.config.socialLinks) {
        if (client.config.socialLinks[naz]) {
            if (!links) {
                links = `[${emo[naz]}](${client.config.socialLinks[naz]})`
            } else {
                if (i % 4 === 0) {
                    links += `\n[${emo[naz]}](${client.config.socialLinks[naz]})`
                } else {
                    links += ` | [${emo[naz]}](${client.config.socialLinks[naz]})`
                }
            }
            i++;
        }
    }

    embed.addField(`${client.words.all.links.socialLinks}`, `${links}`);
    client.util.setFooterOwner(client, embed);
    embed.setTimestamp();
    message.channel.send(embed);
}