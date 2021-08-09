//universal information system about errors //? client.emit("uisae", "X##", message, "");
const Discord = require('discord.js');

module.exports = async (client, error = null, message, addinfo = "none") => {
    let embed = new Discord.MessageEmbed();
    embed.setColor(client.util.randomColor());
    switch (error) {
        case "B01":
            embed.setTitle(`Error B01`);
            embed.addField(`Unknown bot error. Additional info:`, `${addinfo}`);
            break;

        case "B99":
            embed.setTitle(`Error B99`);
            embed.setDescription(`Command reserved only for owner${client.config.settings.subowners.length>0?`s`:``}`);
            break;

        case "U01":
            embed.setTitle(`Error U01`);
            embed.addField(`Unknown user error. Additional info:`, `${addinfo}`);
            break;

        case "U04":
            embed.setTitle(`Error U04`);
            embed.addField(`Wrong user. Additional info:`, `${addinfo}`);
            break;

        case "U14":
            embed.setTitle(`Error U14`);
            embed.addField(`Wrong guild. Additional info:`, `${addinfo}`);
            break;

        case "U24":
            embed.setTitle(`Error U24`);
            embed.addField(`Wrong channel. Additional info:`, `${addinfo}`);
            break;

        case "U34":
            embed.setTitle(`Error U34`);
            embed.addField(`Wrong message. Additional info:`, `${addinfo}`);
            break;

        case "U44":
            embed.setTitle(`Error U44`);
            embed.addField(`Wrong emoji. Additional info:`, `${addinfo}`);
            break;

        case "U54":
            embed.setTitle(`Error U54`);
            embed.addField(`Wrong thread. Additional info:`, `${addinfo}`);
            break;

        case "U94":
            embed.setTitle(`Error U94`);
            embed.addField(`Wrong link. Additional info:`, `${addinfo}`);
            break;

        case "U23":
            embed.setTitle(`Error U23`);
            embed.addField(`User error. Please look at \`${client.dbData.guilds.prefix}help <command>\` before using this command. Additional info:`, `${addinfo}`);
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
            embed.addField(`Unknown music error. Additional info:`, `${addinfo}`);
            break;

        default:
            embed.setAuthor(`ERROR`);
            embed.setTitle(`<a:error1:662820530617057312> Error!!!!`);
            embed.addField(`Bot doesn't know what error it is. Additonal info:`, addinfo);
            break;
    }
    client.util.footerEmbed(client, embed);
    message.channel.send({embeds:[embed]});
};