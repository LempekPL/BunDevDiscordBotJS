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
    let jj = Math.floor(Math.random() * randomhelpinfo.length);
    let helpinfo = randomhelpinfo[jj];
    let embed = new Discord.MessageEmbed();
    embed.setColor(client.util.randomColorConfig(client));
    let prefix = await client.db.get("guilds", message.guild.id, "prefix");
    let discatgui = await client.db.get("guilds", message.guild.id, "disabledCategory");
    let discatuse = await client.db.get("users", message.author.id, "disabledCategory");
    let randoin = await client.db.get("users",message.author.id,"randomhelpinfo");
    let dis = await client.db.get("users", message.author.id, "display");
    let timesused = await client.db.get("bot", client.user.id, "commands");
    let stop = false;
    /*allinone - (default) every command with category
    pages - reduced number of categories to make pages (maybe in the future)
    pagesone - one category per page
    pagesexp - one category per page with info/explanation*/
    if (!args[0] || !isNaN(Number(args[0])) || naming.codes.includes(args[0])) {
        if (!isNaN(args[0])) {
            args[0] = Math.abs(args[0]);
        }
        let cl = [];
        let baz = false,
            muse = false,
            moder = false;
        let cat = [];
        let councat = 0;
        switch (dis.help) {
            case "allinone":
            case false:
                embed.setAuthor(client.config.settings.botname + ' commands', client.user.avatarURL());
                let allcom = 0;
                client.commands.forEach(c => {
                    if (cl.includes(c)) return;
                    if (args[0] && isNaN(args[0]) && naming.codename[c.category] != args[0]) return;
                    let co = "";
                    var ci = 0;
                    if (c.category == "zowner" && message.author.id != client.config.settings.ownerid && !client.config.settings.subowners.includes(message.author.id)) return;
                    if ((!client.guilds.cache.get(client.config.settings.supportServer).members.cache.get(message.author.id) && c.category == "beta") || (c.category == "beta" && message.author.id != client.config.settings.ownerid && !client.config.settings.subowners.includes(message.author.id) && !client.guilds.cache.get(client.config.settings.supportServer).members.cache.get(message.author.id).roles.cache.has(client.config.settings.betaroleid))) return;
                    if (discatgui.includes(naming.codename[c.category]) || discatuse.includes(naming.codename[c.category])) {
                        switch (c.category) {
                            case "basic":
                                if (!baz) {
                                    embed.addField(`${naming.category[c.category]} [1]`, `\`help\``);
                                    allcom++;
                                    baz = true;
                                }
                                break;
                            case "muser":
                                if (!muse) {
                                    embed.addField(`${naming.category[c.category]} [1]`, `\`options\``);
                                    allcom++;
                                    muse = true;
                                }
                                break;
                            case "moderation":
                                if (!moder) {
                                    embed.addField(`${naming.category[c.category]} [1]`, `\`settings\``);
                                    allcom++;
                                    moder = true;
                                }
                                break;
                            default:
                                break;
                        }
                        cl.push(c);
                        return;
                    }
                    client.commands.filter(cc => cc.category == c.category).forEach(cm => {
                        cl.push(cm);

                        if (co.includes(`\`${cm.info.name}\``)) return;
                        ci++;
                        if (co == "") {
                            co = `\`${cm.info.name}\``;
                        } else {
                            co = co + `, \`${cm.info.name}\``;
                        }

                    });
                    embed.addField(`${naming.category[c.category]} [${ci}]`, co);
                    allcom += ci;
                });
                embed.setDescription(`Commands List: [${allcom}]` + ` | Prefix: \`${prefix}\` | Bot version: \`v${vers}\``);
                if (randoin) {
                    embed.addField('\u200b', '\u200b');
                    embed.addField(`Random info`, `${helpinfo.replace(/#PREFIX#/g,prefix).replace(/#BOT_USED#/g,timesused)}`);
                }
                break;

            // case "pages":
                
            //     break;

            case "pagesone":
                client.commands.forEach(ca => {
                    if (cat.includes(ca.category)) return;
                    if (ca.category == "zowner" && message.author.id != client.config.settings.ownerid && !client.config.settings.subowners.includes(message.author.id)) return;
                    if ((!client.guilds.cache.get(client.config.settings.supportServer).members.cache.get(message.author.id) && ca.category == "beta") || (ca.category == "beta" && message.author.id != client.config.settings.ownerid && !client.config.settings.subowners.includes(message.author.id) && !client.guilds.cache.get(client.config.settings.supportServer).members.cache.get(message.author.id).roles.cache.has(client.config.settings.betaroleid))) return;
                    if ((discatgui.includes(naming.codename[ca.category]) || discatuse.includes(naming.codename[ca.category])) && ca.category != "basic" && ca.category != "muser" && ca.category != "moderation") return;
                    cat.push(ca.category);
                });
                if (!args[0]) {
                    args[0] = 1;
                }
                tru = true;
                if (isNaN(args[0])) {
                    cat.forEach(cate => {
                        if (naming.codename[cate] == args[0]) tru = false;
                        if (tru) {
                            councat++;
                        }
                    });
                } else {
                    councat = Number(args[0] - 1);
                }
                if (councat > cat.length || !tru) {
                    councat = 0;
                }
                comalist = [];
                for (i = 0; i < cat.length; i++) {
                    let embeda = new Discord.MessageEmbed();
                    comalist[i] = embeda;
                    comalist[i].setColor(client.util.randomColorConfig(client));
                    comalist[i].setFooter(`Page ${i+1}/${cat.length}`);
                    comalist[i].setTimestamp();
                }
                for (i = 0; i < cat.length; i++) {
                    client.commands.forEach(c => {
                        if (c.category == cat[i]) {
                            if (cl.includes(c)) return;
                            let co = "";
                            var ci = 0;
                            if (c.category == "zowner" && message.author.id != client.config.settings.ownerid && !client.config.settings.subowners.includes(message.author.id)) return;
                            if ((!client.guilds.cache.get(client.config.settings.supportServer).members.cache.get(message.author.id) && c.category == "beta") || (c.category == "beta" && message.author.id != client.config.settings.ownerid && !client.config.settings.subowners.includes(message.author.id) && !client.guilds.cache.get(client.config.settings.supportServer).members.cache.get(message.author.id).roles.cache.has(client.config.settings.betaroleid))) return;
                            if (discatgui.includes(naming.codename[c.category]) || discatuse.includes(naming.codename[c.category])) {
                                switch (c.category) {
                                    case "basic":
                                        if (!baz) {
                                            co = `\`help\``;
                                            comalist[i].setAuthor(`${naming.category[c.category]} [1]`, client.user.avatarURL());
                                            comalist[i].setDescription(co);
                                            baz = true;
                                        }
                                        break;

                                    case "muser":
                                        if (!muse) {
                                            co = `\`options\``;
                                            comalist[i].setAuthor(`${naming.category[c.category]} [1]`, client.user.avatarURL());
                                            comalist[i].setDescription(co);
                                            muse = true;
                                        }
                                        break;

                                    case "moderation":
                                        if (!moder) {
                                            co = `\`settings\``;
                                            comalist[i].setAuthor(`${naming.category[c.category]} [1]`, client.user.avatarURL());
                                            comalist[i].setDescription(co);
                                            moder = true;
                                        }
                                        break;

                                    default:
                                        break;
                                }
                                cl.push(c);
                                return;
                            }
                            client.commands.filter(cc => cc.category == c.category).forEach(cm => {
                                cl.push(cm);
                                if (co.includes(`\`${cm.info.name}\``)) return;
                                ci++;
                                if (co == "") {
                                    co = `\`${cm.info.name}\``;
                                } else {
                                    co = co + `, \`${cm.info.name}\``;
                                }
                            });
                            comalist[i].setAuthor(`${naming.category[c.category]} [${ci}]`, client.user.avatarURL());
                            comalist[i].setDescription(co);
                        }
                    });
                    comalist[i].addField('\u200b', `Prefix: \`${prefix}\` | Bot version: \`v${vers}\``);
                    if (randoin) {
                        comalist[i].addField(`Random info`, `${helpinfo.replace(/#PREFIX#/g,prefix).replace(/#BOT_USED#/g,timesused)}`);
                    }
                }

                new rm.menu({
                    channel: message.channel,
                    userID: message.author.id,
                    page: councat,
                    pages: comalist
                });
                stop = true;
                break;

            case "pagesexp":
                client.commands.forEach(ca => {
                    if (cat.includes(ca.category)) return;
                    if (ca.category == "zowner" && message.author.id != client.config.settings.ownerid && !client.config.settings.subowners.includes(message.author.id)) return;
                    if ((!client.guilds.cache.get(client.config.settings.supportServer).members.cache.get(message.author.id) && ca.category == "beta") || (ca.category == "beta" && message.author.id != client.config.settings.ownerid && !client.config.settings.subowners.includes(message.author.id) && !client.guilds.cache.get(client.config.settings.supportServer).members.cache.get(message.author.id).roles.cache.has(client.config.settings.betaroleid))) return;
                    if ((discatgui.includes(naming.codename[ca.category]) || discatuse.includes(naming.codename[ca.category])) && ca.category != "basic" && ca.category != "muser" && ca.category != "moderation") return;
                    cat.push(ca.category);
                });
                if (!args[0]) {
                    args[0] = 1;
                }
                tru = true;
                if (isNaN(args[0])) {
                    cat.forEach(cate => {
                        if (naming.codename[cate] == args[0]) tru = false;
                        if (tru) {
                            councat++;
                        }
                    });
                } else {
                    councat = Number(args[0] - 1);
                }
                if (councat > cat.length || !tru) {
                    councat = 0;
                }
                comalist = [];
                for (i = 0; i < cat.length; i++) {
                    let embeda = new Discord.MessageEmbed();
                    comalist[i] = embeda;
                    comalist[i].setColor(client.util.randomColorConfig(client));
                    comalist[i].setFooter(`Page ${i+1}/${cat.length}`);
                    comalist[i].setTimestamp();
                }
                for (i = 0; i < cat.length; i++) {
                    client.commands.forEach(c => {
                        if (c.category == cat[i]) {
                            if (cl.includes(c)) return;
                            var co = "";
                            var ci = 0;
                            if (c.category == "zowner" && message.author.id != client.config.settings.ownerid && !client.config.settings.subowners.includes(message.author.id)) return;
                            if ((!client.guilds.cache.get(client.config.settings.supportServer).members.cache.get(message.author.id) && c.category == "beta") || (c.category == "beta" && message.author.id != client.config.settings.ownerid && !client.config.settings.subowners.includes(message.author.id) && !client.guilds.cache.get(client.config.settings.supportServer).members.cache.get(message.author.id).roles.cache.has(client.config.settings.betaroleid))) return;
                            if (discatgui.includes(naming.codename[c.category]) || discatuse.includes(naming.codename[c.category])) {
                                switch (c.category) {
                                    case "basic":
                                        if (!baz) {
                                            co = `\`help\` - ${c.info.info.replace(/`/g,"**").replace(/#PREFIX#/g, prefix).replace(/#COMMAND#/g, c.info.name)}\n`;
                                            comalist[i].setAuthor(`${naming.category[c.category]} [1]`, client.user.avatarURL());
                                            comalist[i].setDescription(co);
                                            baz = true;
                                        }
                                        break;

                                    case "muser":
                                        if (!muse) {
                                            co = `\`options\` - ${c.info.info.replace(/`/g,"**").replace(/#PREFIX#/g, prefix).replace(/#COMMAND#/g, c.info.name)}\n`;
                                            comalist[i].setAuthor(`${naming.category[c.category]} [1]`, client.user.avatarURL());
                                            comalist[i].setDescription(co);
                                            muse = true;
                                        }
                                        break;

                                    case "moderation":
                                        if (!moder) {
                                            co = `\`settings\` - ${c.info.info.replace(/`/g,"**").replace(/#PREFIX#/g, prefix).replace(/#COMMAND#/g, c.info.name)}\n`;
                                            comalist[i].setAuthor(`${naming.category[c.category]} [1]`, client.user.avatarURL());
                                            comalist[i].setDescription(co);
                                            moder = true;
                                        }
                                        break;

                                    default:
                                        break;
                                }
                                cl.push(c);
                                return;
                            }
                            client.commands.filter(cc => cc.category == c.category).forEach(cm => {
                                cl.push(cm);
                                if (co.includes(`\`${cm.info.name}\``)) return;
                                ci++;
                                if (co == "") {
                                    co = `\`${cm.info.name}\` - ${cm.info.info.replace(/`/g,"**").replace(/#PREFIX#/g, prefix).replace(/#COMMAND#/g, c.info.name)}\n`;
                                } else {
                                    co = co + `\`${cm.info.name}\` - ${cm.info.info.replace(/`/g,"**").replace(/#PREFIX#/g, prefix).replace(/#COMMAND#/g, c.info.name)}\n`;
                                }
                            });
                            comalist[i].setAuthor(`${naming.category[c.category]} [${ci}]`, client.user.avatarURL());
                            comalist[i].setDescription(co);
                        }
                    });
                    comalist[i].addField('\u200b', `Prefix: \`${prefix}\` | Bot version: \`v${vers}\``);
                    if (randoin) {
                        comalist[i].addField(`Random info`, `${helpinfo.replace(/#PREFIX#/g,prefix)}`);
                    }
                }
                new rm.menu({
                    channel: message.channel,
                    userID: message.author.id,
                    page: councat,
                    pages: comalist
                });
                stop = true;
                break;

            default:
                client.emit("uisae", "U05", message, "");
                break;
        }
    } else {
        //* help info part
        let c = client.commands.get(args[0]);
        if (!c) {
            embed.setTitle(`Command not found`);
            return;
        }
        embed.setAuthor(`Command Info - ${client.wordsCom.command[c.info.name][c.info.name]}`, client.user.avatarURL());
        embed.addField("Category", `${naming.category[c.category]}`,true);
        embed.addField(`Blocked`, `Server: ${discatgui.includes(naming.codename[c.category])} User: ${discatuse.includes(naming.codename[c.category])}`,true);
        embed.addField("Usage", client.words.info[c.info.name].exp.replace(/#PREFIX#/g, prefix).replace(/#COMMAND#/g, client.wordsCom.command[c.info.name][c.info.name]));
        embed.addField("Description", client.words.info[c.info.name].info.replace(/#PREFIX#/g, prefix).replace(/#COMMAND#/g, client.wordsCom.command[c.info.name][c.info.name]));
        //if (c.info.lang[client.wordsCom.lang].aliases) embed.addField(`Aliases`, c.info.lang[client.wordsCom.lang].aliases.join(", "));
        if (c.info.perms) embed.addField(`Permissions`, c.info.perms);
        
    }
    client.util.setFooterOwner(client, embed);
    embed.setTimestamp();
    if (!stop) {
        message.channel.send(embed);
    }
}