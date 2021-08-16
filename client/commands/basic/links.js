const Discord = require("discord.js");
const emojiLinks = {
    youtube: "<:yt:815379220137377792> [Youtube",
    twitch: "<:twitch:815379239427375115> [Twitch",
    twitter: "<:twitter:815379259128283156> [Twitter",
    reddit: "<:reddit:815379278308573204> [Reddit",
    github: "<:github:815379304766242867> [Github",
    telegram: "<:telegram:858674664288944148> [Telegram",
    steam: "<:steam:815379325524115517> [Steam",
    ownwebsite: "<:web:815379350400270336> [Website",
    spotify: "<:spotify:815379372609241138> [Spotify",
    soundcloud: "<:soundcloud:815379393667923999> [Soundcloud",
    instagram: "<:insta:815383957923168268> [Instagram",
    newgrounds: "<:newgrounds:858671128544149505> [Newgrounds",
    furaffinity: "<:fa:858671128452923425> [Furaffinity",
    furmap: "<:furmap:858675131084570624> [Furmap",
    itch: "<:itchio:858671128452923422> [Itch",
    namemc: "<:namemc:858671128402460712> [Namemc",
    lempek: "<:lempek:858671085502595082> [Lempek"
}
const necessaryPermsId = 8;

module.exports.info = {
    name: "links",
    tags: ["botinvite", "giveinvite", "invite", "support", "server","roadmap","updates","future","links","websites", "dashboard"]
}

module.exports.run = async (client, message, args) => {
    let links = "";
    let i = 0;
    for (const name in client.config.socialLinks) if (client.config?.socialLinks) {
        if (client.config.socialLinks[name]) {
            links = !links ? `${emojiLinks[name]}](${client.config.socialLinks[name]})` : links += i % 4 === 0 ? `\n${emojiLinks[name]}](${client.config.socialLinks[name]})` : ` | ${emojiLinks[name]}](${client.config.socialLinks[name]})`;
            i++;
        }
    }

    let embed = new Discord.MessageEmbed();
    embed.setColor(client.util.randomColor());
    embed.setAuthor(`${client.user.tag} ${client.lang.links}`, client.user.avatarURL());
    embed.addField(`<:bot:815379078776619070> ${client.lang.supportServer}`, `[[DISCORD LINK]](https://discord.gg/e3uQ6aC)`,true);
    embed.addField(`<:bunBlue:815379165942382622> ${client.lang.website}`, `[[WEBSITE LINK]](https://bunbun.lempek.tk)`,true);
    embed.addField("\u200b", "\u200b", true);
    embed.addField(`<:bunGreenEar:815379123643088936> ${client.lang.invite}`, `[[${client.lang.inviteFull}]](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8&guild_id=${message.guild.id}) or [[${client.lang.inviteNeed}]](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=${necessaryPermsId}&guild_id=${message.guild.id})`);
    embed.addField(`<:bunRed:815379923799375893> ${client.lang.roadmap}`, `[[TRELLO LINK]](https://trello.com/b/0d15e7X7/bunbun)`,true);
    embed.addField(`<:bunYellow:815379201536163851> ${client.lang.sourceCode}`, `[[GITHUB LINK]](https://github.com/LempekPL/BunBun)`,true);
    embed.addField("\u200b", "\u200b", true);
    embed.addField(`${client.lang.socialLinks}`, `${links}`);
    client.util.footerEmbed(client, embed);
    message.channel.send({embeds:[embed]});
}