let Discord = require("discord.js");

module.exports = (err) => {
    console.log("Crash:");
    console.log(err);
    let embed = new Discord.MessageEmbed();
    embed.setColor("#ff0000");
    embed.setDescription(`Crash\n\`${err}\``);
    embed.addField(err.path, err.method);
    client.users.cache.get(config.settings.ownerid).send(embed);
}