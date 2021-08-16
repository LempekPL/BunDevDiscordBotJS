const Discord = require("discord.js");
const ReactionMenu = require('discord.js-reaction-menu');
const DefQuestions = require(`../../../langs/en/faq.json`);

module.exports.info = {
    name: "faq",
    tags: ["faq", "questions"]
}

module.exports.run = async (client, message, args) => {
    const SetQuestions = client.dbData.guilds.language.force ? require(`../../../langs/${client.dbData.guilds.language.commands}/faq.json`) : require(`../../../langs/${client.dbData.users.language.commands}/faq.json`);
    let pages = [];
    for (const faqKey in DefQuestions) {
        const Questions = {...DefQuestions[faqKey], ...SetQuestions[faqKey]};
        let embed = new Discord.MessageEmbed();
        embed.setColor(client.util.randomColor());
        embed.setAuthor(`${client.lang.faq} - ${client.lang[faqKey]}`, client.user.avatarURL());
        for (const questionKey in Questions) {
            embed.addField(`${questionKey}. ${Questions[questionKey].question}`, Questions[questionKey].answer);
        }
        client.util.footerEmbed(client, embed);
        pages.push(embed)
    }
    new ReactionMenu.menu({
        channel: message.channel,
        userID: message.author.id,
        pages
    })
    // message.channel.send({embeds: [embed]})
}