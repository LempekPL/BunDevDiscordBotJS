const Discord = require("discord.js");
const DefChanges = require("../../../langs/en/changelog.json");
const ReactionMenu = require("discord.js-reaction-menu");

module.exports.info = {
    name: "changelog",
    tags: ["test"]
}

module.exports.run = async (client, message, args) => {
    const SetChanges = client.dbData.guilds.language.force ? require(`../../../langs/${client.dbData.guilds.language.commands}/changelog.json`) : require(`../../../langs/${client.dbData.users.language.commands}/changelog.json`);
    let pages = [];
    let i = 0;
    for (let k = 0; k < SetChanges.length / 10; k++) {
        let embed = new Discord.MessageEmbed();
        embed.setTitle(`Changelog - page ${k + 1}/${Math.floor(SetChanges.length / 10)+1}`)
        embed.setColor(client.util.randomColor());
        client.util.footerEmbed(client, embed);
        let j = 0;
        for (const change of SetChanges.slice(k * 10)) {
            if (change.changes) {
                embed.addField(`v${change.version} - <t:${DefChanges[i].dateTimestamp}>`, ` - ` + change.changes.join("\n - "));
            } else {
                embed.addField(`v${DefChanges[i].version} - <t:${DefChanges[i].dateTimestamp}>`, ` - ` + DefChanges[i].changes.join("\n - "));
            }
            j++;
            i++;
            if (j >= 10) {
                break;
            }
        }
        pages.push(embed);
    }
    new ReactionMenu.menu({
        channel: message.channel,
        userID: message.author.id,
        pages
    });
}