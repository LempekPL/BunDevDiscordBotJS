const Discord = require("discord.js");

module.exports = (client, error) => {
    console.log("Crash:");
    console.log(error);
    let embed = new Discord.MessageEmbed();
    embed.setColor("#ff0000");
    embed.setDescription(`Crash\n\`${error}\``);
    embed.addField(error.path, error.method);
    client.users.cache.get(client.config.settings.ownerid).send(embed);
    if (client.config.settings.subowners.length !== 0) {
        client.config.settings.subowners.forEach(ownerID => {
            client.users.cache.get(ownerID).send(embed);
        })
    }
}