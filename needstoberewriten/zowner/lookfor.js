let Discord = require("discord.js");

module.exports.info = {
    name: "lookfor",
    example: "`#PREFIX##COMMAND# <search term>`",
    info: "Searches commands if you can't find it in help",
    tags: ["search","command","commands","basic"]
}

module.exports.run = async (client, message, args) => {

    if (await client.util.blockCheck(client.util.codename(__dirname),message)) return;
    let sG = client.guilds.cache.get('533714236581478421').members.cache.get(message.author.id).roles.cache;
    if (!sG.has('671428142480490496') && !sG.has('533729028771676161')) return message.channel.send("You are not BETA TESTER");
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];

    
}