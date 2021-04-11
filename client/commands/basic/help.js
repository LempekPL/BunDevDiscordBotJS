let Discord = require("discord.js");
let naming = require("../../../data/codenames.json");
let vers = require("../../../package.json").version;
let rm = require('discord.js-reaction-menu');
let randomhelpinfo = require("../../../data/randomhelpinfo.json");

module.exports.info = {
    name: "help",
    lang: {
        en: {
            main: "help",
            aliases: ["h", "?", "info"]
        },
        pl: {
            main: "pomoc",
            aliases: ["p", "?"]
        }
    },
    tags: ["help", "?", "how", "how to", "info", "basic"]
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client, __dirname, message)) return;
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
                if (catego == command.category) {
                    coms.push(command.info.lang[client.wordsCom.lang].main);
                }
                comcount++;
            });
            embed.addField(`${naming.category[catego]} [${comcount}]`, `\`${coms.join(", ")}\``);
            allcom += comcount;
        });
        embed.setDescription(`Commands List: [${allcom}]` + ` | Prefix: \`${prefix}\` | Bot version: \`v${vers}\``);
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