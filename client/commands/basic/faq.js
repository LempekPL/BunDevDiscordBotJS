const Discord = require("discord.js");
const DefQuestions = require(`../../../langs/en/faq.json`);

module.exports.info = {
    name: "faq",
    tags: ["faq", "questions"]
}

module.exports.run = async (client, message, args) => {
    const SetQuestions = client.dbData.guilds.language.force ? require(`../../../langs/${client.dbData.guilds.language.commands}/faq.json`) : require(`../../../langs/${client.dbData.users.language.commands}/faq.json`);
    const Questions = {...DefQuestions, ...SetQuestions};
    let embed = new Discord.MessageEmbed();
    embed.setColor(client.util.randomColor());
    embed.setAuthor(`Frequently asked Questions`, client.user.avatarURL());
    for (const questionKey in Questions) {
        embed.addField(`${questionKey}. ${Questions[questionKey].question}`, Questions[questionKey].answer);
    }
    client.util.footerEmbed(client, embed);
    message.channel.send({embeds: [embed]})
}