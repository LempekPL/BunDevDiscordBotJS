let Discord = require('discord.js');
let config = require('../../../data/config.json');

module.exports = async (guild) => {
    let whook = new Discord.WebhookClient(config.webhooks.guilds.split("/")[5], config.webhooks.guilds.split("/")[6]);
    let embed = new Discord.MessageEmbed;
    embed.setColor("#cc0000");
    embed.setTitle(`Left the server: ${guild.name} (${guild.id})`);
    embed.setDescription(`Owner: ${guild.owner.user.tag} (${guild.owner.user.id}) | Members: ${guild.members.cache.size} | Bots: ${guild.members.cache.filter(m=>m.user.bot).size}`);
    embed.setThumbnail(guild.iconURL());
    whook.send(embed);
}