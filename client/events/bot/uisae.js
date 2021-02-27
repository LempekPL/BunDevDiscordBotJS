//universal information system about errors //? client.emit("uisae", "X##", message, "");
let Discord = require('discord.js');
let config = require("../../../data/config.json");
let db = require('../../../util/db.js');
let c = config.c;

module.exports = async (error = null, message, addinfo = null, client) => {
    let i = Math.floor(Math.random() * (c.length - 1) + 1);
    let ce = c[i];
    let prefix = await db.get("guilds", message.guild.id, "prefix");
    if (prefix == undefined || prefix == null || !prefix) prefix = config.settings.prefix;
    let embed = new Discord.MessageEmbed();
    embed.setColor(ce);
    switch (error) {
        case "B01":
            embed.setTitle(`Error B01`);
            embed.addField(`Unknown bot error:`, `${addinfo}`);
            break;

        case "B03":
            embed.setTitle(`Error B03`);
            embed.setDescription(`Not enough permissions. Bot doesn't have enough permissions.`);
            break;

        case "B04":
            embed.setTitle(`Error B04`);
            embed.setDescription(`User not found.`);
            break;

        case "B05":
            embed.setTitle(`Error B05`);
            switch (addinfo) {
                case "ban":
                    embed.setDescription(`Can't ban that user.`);
                    break;
                case "hackban":
                    embed.setDescription(`Can't hackban that user.`);
                    break;
                case "kick":
                    embed.setDescription(`Can't kick that user.`);
                    break;
                case "voicekick":
                    embed.setDescription(`Can't voice kick that user.`);
                    break;
                case "voiceban":
                    embed.setDescription(`Can't voice ban that user.`);
                    break;
                default:
                    embed.setDescription(`Can't modify that user.`);
                    break;
            }
            break;

        case "B99":
            embed.setTitle(`Error B99`);
            embed.setDescription(`Command reserved only for owner${config.settings.subowners.length>0?`s`:``}`);
            break;

        case "U01":
            embed.setTitle(`Error U01`);
            embed.addField(`Unknown user error:`, `${addinfo}`);
            break;

        case "U03":
            embed.setTitle(`Error U03`);
            embed.setDescription(`Not enough permissions. You don't have enough permissions. See permissions \`${prefix}help <command>\``);
            break;

        case "U04":
            embed.setTitle(`Error U04`);
            embed.setDescription(`Not enough arguments. See proper use \`${prefix}help <command>\``);
            break;

        case "U05":
            embed.setTitle(`Error U05`);
            embed.setDescription(`Wrong arguments. See proper use \`${prefix}help <command>\``);
            break;

        case "U06":
            embed.setTitle(`Error U06`);
            embed.setDescription(`Wrong numbers. Number should be bewteen \`${addinfo[0]}\` and \`${addinfo[1]}\``);
            break;

        case "U11":
            embed.setTitle(`Error U11`);
            embed.setDescription(`You are not a BETA TESTER`);
            break;

        case "U686578":
            embed.setTitle(`Error U686578`);
            embed.setDescription(`Only #hex will work. For example \`#66c33c\`. See proper use \`${prefix}help <command>\``);
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

        case "P02":
            embed.setTitle(`Error P02`);
            embed.setDescription(`Preset does not exist. See proper use \`${prefix}help <command>\``);
            break;

        case "P04":
            embed.setTitle(`Error P04`);
            embed.setDescription(`Can't find`);
            break;

        case "P14":
            embed.setTitle(`Error P14`);
            embed.setDescription(`Wrong spotify link. Spotify links need to start with \`https://open.spotify.com\``);
            break;

        case "P15":
            embed.setTitle(`Error P15`);
            embed.setDescription(`Couldn't load \`${addinfo[0]}\` ${addinfo[0] > 1 ? "songs" : "song"}.`);
            embed.addField(`List of songs that couldn't been loaded:`, `${addinfo[1]}`);
            break;

        default:
            embed.setAuthor(`ERROR`);
            embed.setTitle(`<a:error1:662820530617057312> Error!!!!`);
            embed.addField(`Bot doesn't know what error is it. Additonal info:`, addinfo);
            break;
    }
    if (config.settings.subowners.length == 0) {
        embed.setFooter("© " + client.users.cache.get(config.settings.ownerid).username, client.users.cache.get(config.settings.ownerid).avatarURL());
    } else {
        let owners = client.users.cache.get(config.settings.ownerid).username
        config.settings.subowners.forEach(sub => {
            owners += ` & ${client.users.cache.get(sub).username}`;
        });
        embed.setFooter("© " + owners, client.user.avatarURL());
    }
    embed.setTimestamp();
    message.channel.send(embed);
};