let Discord = require("discord.js");
let codenames = ["basic", "mod", "txt", "img", "other", "lkapi", "beta", "music", "txtman", "imgman", "user"];
let rm = require('discord.js-reaction-menu');

module.exports.info = {
    name: "options",
    aliases: ["opt"],
    example: "`#PREFIX##COMMAND#` or `#PREFIX##COMMAND# -h` for more options",
    info: "Shows users options",
    tags: ["user", "modification", "settings", "options", "change"]
}

module.exports.run = async (client, message, args) => {
    let prefix = await client.db.get("guilds", message.guild.id, "prefix");
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    let eqdb = await client.db.get("users", message.author.id, "equalizers");
    let pldb = await client.db.get("users", message.author.id, "playlists");
    let discatuse = await client.db.get("users", message.author.id, "disabledCategory");
    let rhi = await client.db.get("users", message.author.id, "randomhelpinfo")
    let dis = await client.db.get("users", message.author.id, "display");
    let disabledCategory = "";
    discatuse.forEach(cat => {
        disabledCategory = !disabledCategory ? cat : disabledCategory + ", " + cat;
    });
    if (!disabledCategory) disabledCategory = "None";
    let embed = new Discord.MessageEmbed();
    embed.setColor(ce);
    if (client.config.settings.subowners.length == 0) {
        embed.setFooter("© " + client.users.cache.get(client.config.settings.ownerid).username, client.users.cache.get(client.config.settings.ownerid).avatarURL());
    } else {
        let owners = client.users.cache.get(client.config.settings.ownerid).username
        client.config.settings.subowners.forEach(sub => {
            owners += ` & ${client.users.cache.get(sub).username}`;
        });
        embed.setFooter("© " + owners, client.user.avatarURL());
    }
    embed.setTimestamp();
    embed.setTitle(`Options`);
    stop = false;
    switch (args[0]) {
        case "--edit":
        case "--help":
        case "-h":
        case "-e":
            embed.setDescription(`
            To change use \`${prefix}options <value>\`
            **Playlists** (pl)
            > --playlist delete <name or number> \n> --playlist create <name lowercase without spaces> (this creates empty playlist, to add songs you need to use \`${prefix}playlist -h\`)
            **Equalizer** (eq)
            > --equalizer delete <name or number> (to add you need to use ${prefix}equalizer -h)
            **Category** (c)
            > --category block/unblock <category codename> \n> (category name /codename/ is in help in brackets **Name (codename) [num of commands]**)
            **Random help info** (rhi)
            > --randomhelpinfo enable/disable
            **Display** (d)
            > --display --help allinone/pagesone/pagesexp \n> --display --settings allinone/pagesone/pagesexp \n> --display --options allinone/pagesone/pagesexp
            `);
            break;

        case "--category":
        case "-c":
            if (args[1] == "block") {
                let arf = false;
                codenames.forEach(code => {
                    if (code == args[2]) {
                        arf = true;
                    }
                });
                if (!arf) return message.channel.send("This category doesn't exist. Codenames are in round brackets in help");
                if (discatuse.includes(args[2])) return message.channel.send("This category is already blocked")
                discatuse.push(args[2]);
                await client.db.update('users', message.author.id, 'disabledCategory', discatuse);
                embed.setAuthor(`Category`, client.user.avatarURL());
                if (message.author.id == client.config.settings.ownerid) {
                    embed.setTitle(`Task Failed Successfully`);
                } else {
                    embed.setTitle(`OK B20`);
                }
                embed.setDescription(`**Category has been updated successfully**\n ${args[2]} category blocked`);
            } else if (args[1] == "unblock") {
                let arf = false;
                codenames.forEach(code => {
                    if (code == args[2]) {
                        arf = true;
                    }
                });
                if (!arf) return message.channel.send("This category doesn't exist. Codenames are in round brackets in help");
                if (!(discatuse.includes(args[2]))) return message.channel.send("This category isn't blocked")
                discatuse = discatuse.filter(e => e != args[2]);
                await client.db.update('users', message.author.id, 'disabledCategory', discatuse);
                embed.setAuthor(`Category`, client.user.avatarURL());
                if (message.author.id == client.config.settings.ownerid) {
                    embed.setTitle(`Task Failed Successfully`);
                } else {
                    embed.setTitle(`OK B20`);
                }
                embed.setDescription(`**Category has been updated successfully**\n ${args[2]} category unblocked`);
            } else {
                client.emit("uisae", "U05", message, "");
                return;
            }
            break;

        case "-eq":
        case "--equalizer":
            if (args[1] == "delete") {
                i = 1;
                if (isNaN(args[2])) {
                    if (!eqdb[args[2].toLowerCase()] || !eqdb[args[2].toLowerCase()]) {
                        message.channel.send("This equalizer setting doesn't exists.");
                        return;
                    }
                    eqdb[args[2].toLowerCase()] = false;
                    await client.db.update('users', message.author.id, 'equalizers', eqdb);
                    message.channel.send("Equalizer settings deleted `" + args[2].toLowerCase() + "`");
                    return;
                } else {
                    for (let prop in eqdb) {
                        if (i == 1 && eqdb[prop]) {
                            if (!eqdb[prop] || !eqdb[prop]) {
                                message.channel.send("This equalizer setting doesn't exists.");
                                return;
                            }
                            eqdb[prop] = false;
                            await client.db.update('users', message.author.id, 'equalizers', eqdb);
                            message.channel.send("Equalizer settings deleted `" + args[2].toLowerCase() + "`");
                            return;
                        }
                        if (eqdb[prop]) {
                            i++;
                        }
                    }
                }
            } else {
                message.channel.send("Use `" + prefix + "equalizer --edit` if you want to save,update,delete or use equalizer");
                return;
            }
            break;

        case "-pl":
        case "--playlist":
            if (args[1] == "delete") {
                i = 1;
                if (isNaN(args[2])) {
                    if (!pldb[args[2].toLowerCase()] || !pldb[args[2].toLowerCase()]) {
                        message.channel.send("This playlist doesn't exists.");
                        return;
                    }
                    pldb[args[2].toLowerCase()] = false;
                    await client.db.update('users', message.author.id, 'playlists', pldb);
                    message.channel.send("Playlist deleted `" + args[2].toLowerCase() + "`");
                    return;
                } else {
                    for (let prop in pldb) {
                        if (i == 1 && pldb[prop]) {
                            if (!pldb[prop] || !pldb[prop]) {
                                message.channel.send("This playlist doesn't exists.");
                                return;
                            }
                            pldb[prop] = false;
                            await client.db.update('users', message.author.id, 'playlists', pldb);
                            message.channel.send("Playlist deleted `" + args[2].toLowerCase() + "`");
                            return;
                        }
                        if (pldb[prop]) {
                            i++;
                        }
                    }
                }
            } else if (args[1] == "create") {
                no = 0;
                client.config.settings.subowners.forEach(sub => {
                    if (message.author.id != sub) {
                        no++;
                    }
                });
                let sG = client.guilds.cache.get(client.config.settings.supportServer).members.cache.get(message.author.id).roles.cache;
                if (pldb.length >= 1000 && (client.config.settings.ownerid == message.author.id || no != client.config.settings.subowners.length)) {
                    message.channel.send("You can only save up to 1000 playlists\nSorry you can't have more");
                    return;
                } else if (pldb.length >= 200 && sG.has(client.config.settings.betaroleid)) {
                    message.channel.send("You can only save up to 500 playlists\nJoin staff in support server to bump it even more.");
                    return;
                    // } else if (pldb.length >= 500 && sG.has(client.config.settings.betaroleid)) {
                    //     message.channel.send("You can only save up to 500 playlists\nJoin VIPs in support server to bump it even more.");
                    //     return;
                } else if (pldb.length >= 40 && client.guilds.cache.get(client.config.settings.supportServer).member(message.author)) {
                    message.channel.send("You can only save up to 40 playlists\nJoin betatesters in support server to bump it to 200.");
                    return;
                } else if (pldb.length >= 10 && !client.guilds.cache.get(client.config.settings.supportServer).member(message.author)) {
                    message.channel.send("You can only save up to 10 playlists\nJoin support server to bump it to 40. `" + prefix + "links`");
                    return;
                }
                if (!isNaN(args[2].slice()[0])) {
                    message.channel.send("Names can't start with numbers");
                    return;
                }
                if (pldb[args[2].toLowerCase()]) {
                    message.channel.send("This playlist already exists. Use `" + prefix + "playlist --update " + args[1].toLowerCase() + "` or `" + prefix + "playlist --add " + args[1].toLowerCase() + " all`");
                    return;
                }
                pldb[args[2].toLowerCase()] = [];
                await client.db.update('users', message.author.id, 'playlists', pldb);
                message.channel.send("Playlist `" + args[1].toLowerCase() + "` created");
                return;
            } else {
                message.channel.send("Use `" + prefix + "playlist --edit` if you want to save,update,delete,use... playlist");
                return;
            }
            break;

        case "--randomhelpinfo":
        case "-rhi":
            if (args[1] == "enable") {
                await client.db.update('users', message.author.id, 'randomhelpinfo', true);
                embed.setAuthor(`Random help info`, client.user.avatarURL());
                if (message.author.id == client.config.settings.ownerid) {
                    embed.setTitle(`Task Failed Successfully`);
                } else {
                    embed.setTitle(`OK B20`);
                }
                embed.setDescription(`**Random help info has been updated successfully**\n Random help info enabled`);
            } else if (args[1] == "disable") {
                await client.db.update('users', message.author.id, 'randomhelpinfo', false);
                embed.setAuthor(`Random help info`, client.user.avatarURL());
                if (message.author.id == client.config.settings.ownerid) {
                    embed.setTitle(`Task Failed Successfully`);
                } else {
                    embed.setTitle(`OK B20`);
                }
                embed.setDescription(`**Random help info has been updated successfully**\n Random help info disabled`);
            } else {
                client.emit("uisae", "U05", message, "");
                return;
            }
            break;

        case "--display":
        case "-d":
            if (args[2] == "allinone" || args[2] == "pagesone" || args[2] == "pagesexp") {
                switch (args[1]) {
                    case "--help":
                    case "-h":
                        dis.help = args[2];
                        await client.db.update('users', message.author.id, 'display', dis);
                        embed.setAuthor(`Display`, client.user.avatarURL());
                        if (message.author.id == client.config.settings.ownerid) {
                            embed.setTitle(`Task Failed Successfully`);
                        } else {
                            embed.setTitle(`OK B20`);
                        }
                        embed.setDescription(`**Display has been updated successfully**\n Help display changed to ${args[2]}`);
                        break;

                    case "--settings":
                    case "-s":
                        dis.settings = args[2];
                        await client.db.update('users', message.author.id, 'display', dis);
                        embed.setAuthor(`Display`, client.user.avatarURL());
                        if (message.author.id == client.config.settings.ownerid) {
                            embed.setTitle(`Task Failed Successfully`);
                        } else {
                            embed.setTitle(`OK B20`);
                        }
                        embed.setDescription(`**Display has been updated successfully**\n Settings display changed to ${args[2]}`);
                        break;

                    case "--options":
                    case "-o":
                        dis.options = args[2];
                        await client.db.update('users', message.author.id, 'display', dis);
                        embed.setAuthor(`Display`, client.user.avatarURL());
                        if (message.author.id == client.config.settings.ownerid) {
                            embed.setTitle(`Task Failed Successfully`);
                        } else {
                            embed.setTitle(`OK B20`);
                        }
                        embed.setDescription(`**Display has been updated successfully**\n Options display changed to ${args[2]}`);
                        break;

                    default:
                        client.emit("uisae", "U05", message, "");
                        break;
                }
            } else {
                client.emit("uisae", "U05", message, "");
            }
            break;

        default:
            let data = "";
            i = 1;
            for (let prop in eqdb) {
                if (eqdb[prop]) {
                    data += data ? `\n> ${i}. ${prop}` : `> ${i}. ${prop}`;
                    i++;
                }
            }
            if (i == 1) {
                data = "> none";
            }

            let datapl = "";
            ipl = 1;
            for (let prop in pldb) {
                if (pldb[prop]) {
                    datapl += datapl ? `\n> ${ipl}. ${prop}` : `> ${ipl}. ${prop}`;
                    ipl++;
                }
            }
            if (ipl == 1) {
                datapl = "> none";
            }
            if (!dis.help || dis.help == "") {
                hel = "allinone";
            } else {
                hel = dis.help;
            }
            if (!dis.settings || dis.settings == "") {
                set = "allinone";
            } else {
                set = dis.settings;
            }
            if (!dis.options || dis.options == "") {
                opt = "allinone";
            } else {
                opt = dis.options;
            }
            switch (opt) {
                case "allinone":
                    embed.setDescription(`
            **Playlists** (pl)
            ${datapl}
            **Equalizer** (eq)
            ${data}
            **Category** (c)
            > Blocked: \`${disabledCategory}\`
            **Random help info** (rhi)
            > Enabled: \`${rhi}\`
            **Display** (d)
            > help: \`${hel}\`
            > settings: \`${set}\`
            > options: \`${opt}\`
            
            Use \`${prefix}options --edit\` if you want to change options
                        `);
                    break;

                case "pagesone":
                    if (!isNaN(args[0])) {
                        args[0] = Math.abs(args[0]);
                    } else if (isNaN(args[0])) {
                        args[0] = 1;
                    }
                    leg = 5;
                    councat = 0;
                    if (!args[0]) {
                        args[0] = 1;
                    }
                    councat = Number(args[0] - 1);
                    if (councat > leg) {
                        councat = 0;
                    }
                    comalist = [];
                    for (i = 0; i < leg; i++) {
                        let embeda = new Discord.MessageEmbed();
                        comalist[i] = embeda;
                        comalist[i].setColor(ce);
                        comalist[i].setFooter(`Page ${i+1}/${leg}`);
                        comalist[i].setTimestamp();
                        switch (i) {
                            case 0:
                                comalist[i].setTitle("Playlists (pl)");
                                comalist[i].setDescription(`${datapl}`);
                                break;
                            case 1:
                                comalist[i].setTitle("Equalizer (eq)");
                                comalist[i].setDescription(`${data}`);
                                break;
                            case 2:
                                comalist[i].setTitle("Category (c)");
                                comalist[i].setDescription(`Blocked: \`${disabledCategory}\``);
                                break;
                            case 3:
                                comalist[i].setTitle("Random help info (rhi)");
                                comalist[i].setDescription(`Enabled: \`${rhi}\``);
                                break;
                            case 4:
                                comalist[i].setTitle("Display (d)");
                                comalist[i].setDescription(`help: \`${hel}\`\nsettings: \`${set}\`\noptions: \`${opt}\``);
                                break;
                            default:
                                break;
                        }
                        comalist[i].addField("\u200b", `Use \`${prefix}options --edit\` if you want to change options`)
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
                    if (!isNaN(args[0])) {
                        args[0] = Math.abs(args[0]);
                    } else if (isNaN(args[0])) {
                        args[0] = 1;
                    }
                    leg = 5;
                    councat = 0;
                    if (!args[0]) {
                        args[0] = 1;
                    }
                    councat = Number(args[0] - 1);
                    if (councat > leg) {
                        councat = 0;
                    }
                    comalist = [];
                    for (i = 0; i < leg; i++) {
                        let embeda = new Discord.MessageEmbed();
                        comalist[i] = embeda;
                        comalist[i].setColor(ce);
                        comalist[i].setFooter(`Page ${i+1}/${leg}`);
                        comalist[i].setTimestamp();
                        switch (i) {
                            case 0:
                                comalist[i].setTitle("Playlists (pl)");
                                comalist[i].setDescription(`${datapl}`);
                                comalist[i].addField("\u200b", `> \`${prefix}options --playlist delete <name or number>\` \n> \`${prefix}options --playlist create <name lowercase without spaces>\` (this creates empty playlist, to add songs you need to use \`${prefix}playlist -h\`)`);
                                break;
                            case 1:
                                comalist[i].setTitle("Equalizer (eq)");
                                comalist[i].setDescription(`${data}`);
                                comalist[i].addField("\u200b", `> \`${prefix}options --equalizer delete <name or number>\` (to add you need to use \`${prefix}equalizer -h\`)`);
                                break;
                            case 2:
                                comalist[i].setTitle("Category (c)");
                                comalist[i].setDescription(`Blocked: \`${disabledCategory}\``);
                                comalist[i].addField("\u200b", `> \`${prefix}options --category block/unblock <category codename>\` \n> (category name /codename/ is in help in brackets **Name (codename) [num of commands]**)`);
                                break;
                            case 3:
                                comalist[i].setTitle("Random help info (rhi)");
                                comalist[i].setDescription(`Enabled: \`${rhi}\``);
                                comalist[i].addField("\u200b", `> \`${prefix}options --randomhelpinfo enable/disable\``);
                                break;
                            case 4:
                                comalist[i].setTitle("Display (d)");
                                comalist[i].setDescription(`help: \`${hel}\`\nsettings: \`${set}\`\noptions: \`${opt}\``);
                                comalist[i].addField("\u200b", `> \`${prefix}options --display --help allinone/pagesone/pagesexp\` \n> \`${prefix}options --display --settings allinone/pagesone/pagesexp\` \n> \`${prefix}options --display --options allinone/pagesone/pagesexp\``);
                                break;
                            default:
                                break;
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
                    embed.setDescription(`
        **Playlists** (pl)
        ${datapl}
        **Equalizer** (eq)
        ${data}
        **Category** (c)
        > Blocked: \`${disabledCategory}\`
        **Random help info** (rhi)
        > Enabled: \`${rhi}\`
        **Display** (d)
        > help: \`${hel}\`
        > settings: \`${set}\`
        > options: \`${opt}\`
        
        Use \`${prefix}options --edit\` if you want to change options
                    `);
                    break;
            }
            break;
    }
    if (!stop) {
        message.channel.send(embed);
    }
}