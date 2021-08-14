const Discord = require("discord.js");
const emojiLinks = {
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
    tags: ["botinvite", "giveinvite", "invite", "support", "server","roadmap","updates","future","links","websites", "dashboard"]
}

module.exports.run = async (client, message, args) => {
    let links = "";
    let i = 0;
    for (const name in client.config.socialLinks) {
        if (client.config.socialLinks[name]) {
            if (!links) {
                links = `[${emojiLinks[name]}](${client.config.socialLinks[name]})`
            } else {
                if (i % 4 === 0) {
                    links += `\n[${emojiLinks[name]}](${client.config.socialLinks[name]})`
                } else {
                    links += ` | [${emojiLinks[name]}](${client.config.socialLinks[name]})`
                }
            }
            i++;
        }
    }

    let embed = new Discord.MessageEmbed();
    embed.setColor(client.util.randomColor());
    embed.setAuthor(`${client.user.tag} ${client.lang.links}`, client.user.avatarURL());
    embed.addField(`${client.lang.supportServer}`, `[<:bot:815379078776619070> [DISCORD LINK]](https://discord.gg/e3uQ6aC)`,true);
    embed.addField(`${client.lang.website}`, `[<:bunBlue:815379165942382622> [WEBSITE LINK]](https://bunbun.lempek.tk)`,true);
    embed.addField(`${client.lang.inviteFull}`, `[<:bunGreenEar:815379123643088936> [BOT LINK]](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8&guild_id=${message.guild.id})`);
    embed.addField(`${client.lang.inviteNeed}`, `[<:bunGreen:815380019257933826> [BOT LINK]](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8&guild_id=${message.guild.id})`);
    embed.addField(`${client.lang.roadmap}`, `[<:bunRed:815379923799375893> [TRELLO LINK]](https://trello.com/b/0d15e7X7/bunbun)`,true);
    embed.addField(`${client.lang.sourceCode}`, `[<:bunYellow:815379201536163851> [GITHUB LINK]](https://github.com/LempekPL/BunBun)`,true);
    embed.addField(`${client.lang.socialLinks}`, `${links}`);
    client.util.footerEmbed(client, embed);
    message.channel.send({embeds:[embed]});
}