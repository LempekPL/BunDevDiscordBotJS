const Discord = require("discord.js");

module.exports = (client, error) => {
    console.log("Crash:");
    console.log(error);
    let embed = new Discord.MessageEmbed();
    embed.setColor("#ff0000");
    embed.setDescription(`Crash\n\`${error}\``);
    embed.addField(error.path, error.method);
    client.users.cache.get(client.config.settings.ownerId).send(embed);
    if (client.config.settings.subOwnersIds.length !== 0) {
        client.config.settings.subOwnersIds.forEach(ownerID => {
            client.users.cache.get(ownerID).send(embed);
        })
    }
}