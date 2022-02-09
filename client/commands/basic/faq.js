const Discord = require("discord.js");
const ReactionMenu = require('discord.js-reaction-menu');
const DefQuestions = require(`../../../web/public/lang/en/faq.json`);

module.exports.info = {
    name: "faq",
    tags: ["faq", "questions"]
}

module.exports.run = async (client, message, args) => {
    const SetQuestions = client.dbData.guilds.language.force ? require(`../../../web/public/lang/${client.dbData.guilds.language.commands}/faq.json`) : require(`../../../web/public/lang/${client.dbData.users.language.commands}/faq.json`);
    let pages = [];
    for (const faqKey in DefQuestions) {
        const Questions = {...DefQuestions[faqKey], ...SetQuestions[faqKey]};
        let embed = new Discord.MessageEmbed();
        embed.setColor(client.util.randomColor());
        embed.setAuthor(`${client.lang.faq} - ${client.lang[faqKey]}`, client.user.avatarURL());
        for (const questionKey in Questions) {
            console.log(`${questionKey}. ${Questions[questionKey].question}`, Questions[questionKey].answer)
            embed.addField(`${questionKey}. ${Questions[questionKey].question}`, Questions[questionKey].answer);
        }
        client.util.footerEmbed(client, embed);
        pages.push(embed)
    }
    new ReactionMenu.menu({
        channel: message.channel,
        userID: message.author.id,
        pages
    });
}