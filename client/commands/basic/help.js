let Discord = require("discord.js");
let naming = require("../../../data/codenames.json");
let vers = require("../../../package.json").version;
let rm = require('discord.js-reaction-menu');
let randomhelpinfo = require("../../../data/randomhelpinfo.json");


module.exports.info = {
    name: "help",
    lang: {
        en: require("../../../lang/en.json").command.help.infoData
    },
        // pl: {
        //     main: "pomoc",
        //     aliases: ["p", "?"]
        // }
    tags: ["help", "?", "how", "how to", "info", "basic"]
}

module.exports.run = async (client, message, args) => {
    let helpinfo = randomhelpinfo[Math.floor(Math.random() * randomhelpinfo.length)];
    let prefix = client.dbCache.guilds[message.guild.id].prefix;
    // let discatgui = await client.db.get("guilds", message.guild.id, "disabledCategory");
    // let discatuse = await client.db.get("users", message.author.id, "disabledCategory");
    // let randoin = await client.db.get("users", message.author.id, "randomhelpinfo");
    // let dis = await client.db.get("users", message.author.id, "display");
    let timesused = client.dbCache.bot[client.user.id].commands;
    let stop = false;
    /*allinone - (default) every command with category
    pages - reduced number of categories to make pages (maybe in the future)
    pagesone - one category per page
    pagesexp - one category per page with info/explanation*/
    let embed = new Discord.MessageEmbed();
    embed.setColor(client.util.randomColorConfig(client));
    if (!args[0] || !isNaN(Number(args[0])) || naming.codes.includes(args[0])) {
        embed.setAuthor(client.config.settings.botname + ' commands', client.user.avatarURL());
        allcom = 0;
        naming.codes.forEach(catego => {
            comcount = 0;
            coms = [];
            client.commands.forEach(command => {
                if (catego === command.category) {
                    coms.push(command.info.lang[client.wordsCom.lang].main);
                }
                comcount++;
            });
            embed.addField(`${naming.category[catego]} [${comcount}]`, `\`${coms.join(", ")}\``);
            allcom += comcount;
        });
        embed.setDescription(`Commands List: [${allcom}] | Prefix: \`${prefix}\` | Bot version: \`v${vers}\``);
        //if (randoin) {
            embed.addField('\u200b', '\u200b');
            embed.addField(`Random info`, `${helpinfo.replace(/#PREFIX#/g,prefix).replace(/#BOT_USED#/g,timesused)}`);
        //}


    } else {

    }
    client.util.setFooterOwner(client, embed);
    embed.setTimestamp();
    if (!stop) {
        message.channel.send(embed);
    }
}


// case `-${client.wordsCom.command.avatar.help[0]}`:
// case `--${client.wordsCom.command.avatar.help}`:
//     embed.setTitle(client.words.all.avatar.hAvatar);
//     embed.addField("You can use with command ` <>`", `
//     > -f or --format to define format (only allowed formats png, jpg, jpeg, webp, gif)
//     > default: png\n
//     > -s or --size to define size (only allowed sizes 16,32,64,128,256,512,1024,2048,4096)
//     > default: 2048\n
//     > -u or --user to define user (you can mention or use user id)
//     > default: user using the command\n
//     > -d or --dynamic if true then it will automaticly change format to gif if possible (only true or false; helpful when you want to use other format than gif)
//     > default: true\n
//     > -h or --help shows this info`)
//     embed.setColor(client.util.randomColorConfig(client));
//     client.util.setFooterOwner(client, embed)
//     embed.setTimestamp();
//     return message.channel.send(embed);