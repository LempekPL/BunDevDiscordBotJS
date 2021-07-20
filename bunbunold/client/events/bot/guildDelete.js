let Discord = require('discord.js');

module.exports = async (client, guild) => {
    let whook = new Discord.WebhookClient(client.config.webhooks.guilds.split("/")[5], client.config.webhooks.guilds.split("/")[6]);
    let embed = new Discord.MessageEmbed;
    embed.setColor("#cc0000");
    embed.setTitle(`Left the server: ${guild.name} (${guild.id})`);
    embed.setDescription(`Owner: ${guild.owner.user.tag} (${guild.owner.user.id}) | Members: ${guild.members.cache.size} | Bots: ${guild.members.cache.filter(m=>m.user.bot).size} \n\n\`${guild.iconURL()}\``);
    embed.setThumbnail(guild.iconURL());
    whook.send(embed);
}