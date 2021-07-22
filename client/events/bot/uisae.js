//universal information system about errors //? client.emit("uisae", "X##", message, "");
const Discord = require('discord.js');

module.exports = async (client, error = null, message, addinfo = "IDK") => {
    let embed = new Discord.MessageEmbed();
    embed.setColor(client.util.randomColor());
    switch (error) {
        case "B01":
            embed.setTitle(`Error B01`);
            embed.addField(`Unknown bot error:`, `${addinfo}`);
            break;

        case "B99":
            embed.setTitle(`Error B99`);
            embed.setDescription(`Command reserved only for owner${client.config.settings.subowners.length>0?`s`:``}`);
            break;

        case "U01":
            embed.setTitle(`Error U01`);
            embed.addField(`Unknown user error:`, `${addinfo}`);
            break;

        case "D02":
            embed.setTitle(`Error D02`);
            embed.setDescription(`Too old. Discord API don't allow to delete messages that are over 14 days old.`);
            break;

        case "D03":
            embed.setTitle(`Error D03`);
            embed.setDescription(`Too much. Discord API don't allow more than 100 messages to delete.`);
            break;

        case "P01":
            embed.setTitle(`Error P01`);
            embed.addField(`Unknown music error:`, `${addinfo}`);
            break;

        default:
            embed.setAuthor(`ERROR`);
            embed.setTitle(`<a:error1:662820530617057312> Error!!!!`);
            embed.addField(`Bot doesn't know what error is it. Additonal info:`, addinfo);
            break;
    }
    client.util.footerEmbed(client, embed);
    message.channel.send(embed);
};