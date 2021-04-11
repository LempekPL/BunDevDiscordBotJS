let Discord = require("discord.js");
let d, second, minute, mins, secs;
let codenames = ["basic", "mod", "txt", "img", "other", "lkapi", "beta", "music", "txtman", "imgman", "user"];
let rm = require('discord.js-reaction-menu');

module.exports.info = {
    name: "settings",
    aliases: ["set"],
    example: "`#PREFIX##COMMAND#` or `#PREFIX##COMMAND# -h` for more options",
    info: "Shows server settings",
    tags: ["how to", "change", "server", "moderation", "settings", "options"],
    perms: "Administrator"
}

module.exports.run = async (client, message, args) => {
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    let nie = 0;
    let prefix = await client.db.get("guilds", message.guild.id, "prefix");
    if (message.member.hasPermission("ADMINISTRATOR") == false) return client.emit("uisae", "U03", message, "");
    let discatgui = await client.db.get("guilds", message.guild.id, "disabledCategory");
    let welcome = await client.db.get("guilds", message.guild.id, "welcome");
    let goodbye = await client.db.get("guilds", message.guild.id, "goodbye");
    let autorole = await client.db.get("guilds", message.guild.id, "autorole");
    let slowmode = await client.db.get("guilds", message.guild.id, "slowmode");
    let player = await client.db.get("guilds", message.guild.id, "player");
    let warn = await client.db.get("guilds", message.guild.id, "warn");
    let voteVK = await client.db.get("guilds", message.guild.id, "voteVoiceKick");
    let dis = await client.db.get("users", message.author.id, "display");
    let disabledCategory = "";
    discatgui.forEach(cat => {
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

    switch (args[0]) {
        case "--edit":
        case "--help":
        case "-h":
        case "-e":
            embed.setDescription(``)
            // embed.setDescription(`
            // To change use \`${prefix}settings <value>\`
            // **Prefix** (pr)
            // > --prefix <new prefix>
            // **Slowmode** (s)
            // > --slowmode <new slowmode in seconds>
            // **Autorole** (a)
            // > --autorole <@role or role id>\n> --autorole disable
            // **Category** (c)
            // > --category block/unblock <category codename> \n> (category name /codename/ is in help in brackets **Name (codename) [num of commands]**)
            // **Music Player** (pl)
            // > --player --djrole <@role or role id> (use \`disable\` to disable, allows only people with this role to manage player/songs)\n> --player --nextsong enable/disable\n> --player --skipvote enable/disable\n> --player --skiptovote enable/disable\n> --player --previousvote enable/disable
            // **Vote voice kick** (vvk) /*DON'T WORK*/
            // > --votevoicekick <number of votes to activate>\n> --votevoicekick disable
            // **Warn** (wa) /*DON'T WORK*/
            // > --warn --limit <number of warns to kick>\n> --warn enable/disable\n> --warn --vote <number of votes to give> (optional, use false or 0 to disable)
            // **Welcome** (w)
            // > --welcome --channel <#channel or channel id>\n> --welcome --message <welcome message>\n> --welcome enable/disable
            // **Goodbye** (g)
            // > --goodbye --channel <#channel or channel id>\n> --goodbye --message <goodbye message>\n> --goodbye enable/disable
            // **Language**
            // > --language --bot en/pl\n> --language --commands en/pl\n> --language --force true/false
            // \n
            // You can add to welcome/goodbye message:
            // > #USER# - username\n> #MENTION# - mention\n> #TAG# - user tag, e. g. #1234\n> #GUILD# - guild name\n> #MEMBERCOUNT# - count of all members with counting bots\n> #USERCOUNT# - count of all members without counting bots
            // If you want to test how the message would look then use \`${prefix}settings --welcome --messagetest\`\nIf you had already set channel then it will send message on that channel if not then on the message channel.
            // `);
            embed.setTitle(`Settings Edit`);
            break;

        case "--prefix":
        case "-pr":
            if (args[1] == null) {
                client.emit("uisae", "U04", message, "");
                return;
            } else {
                if (args[1].length >= 7) return message.reply(`prefix maximum length is 6 characters.`);
                await client.db.update('guilds', message.guild.id, 'prefix', args[1]);
                embed.setAuthor(`Prefix`, client.user.avatarURL());
                if (message.author.id == client.config.settings.ownerid) {
                    embed.setTitle(`Task Failed Successfully`);
                } else {
                    embed.setTitle(`OK B20`);
                }
                embed.setDescription(`**Prefix has been updated successfully**\n New Prefix is \`${args[1]}\``);
            }
            break;

        case "--slowmode":
        case "-s":
            let newsm = args[1];
            if (args[1] == null) {
                client.emit("uisae", "U04", message, "");
                return;
            } else if (isNaN(newsm)) {
                client.emit("uisae", "U05", message, "");
                return;
            } else {
                if (newsm >= 1801 || newsm <= 0) {
                    client.emit("uisae", "U06", message, ["1", "1800"]);
                } else {
                    let second = 1;
                    let minute = second * 60;
                    let mins = Math.floor(newsm / (minute));
                    let secs = Math.floor((newsm % (minute)) / (second));
                    await client.db.update('guilds', message.guild.id, 'slowmode', Math.abs(args[1]));
                    embed.setAuthor(`Slowmode`, client.user.avatarURL());
                    if (message.author.id == client.config.settings.ownerid) {
                        embed.setTitle(`Task Failed Successfully`);
                        embed.setDescription(`**Slowmode has been updated successfully**\n New Slowmode is \`${mins}\`m \`${secs}\`s`);
                    } else if (newsm >= 181) {
                        embed.setTitle(`OK B20 but why?`);
                        embed.setDescription(`**Slowmode has been updated successfully**\n New Slowmode is \`${mins}\`m \`${secs}\`s\n**WHY?**`);
                    } else {
                        embed.setTitle(`OK B20`);
                        embed.setDescription(`**Slowmode has been updated successfully**\n New Slowmode is \`${mins}\`m \`${secs}\`s`);
                    }
                }
            }
            break;

        case "--autorole":
        case "-a":
            if (args[1] == "disable") {
                autorole.enabled = false;
                await client.db.update('guilds', message.guild.id, 'autorole', autorole);
                embed.setAuthor(`Autorole`, client.user.avatarURL());
                if (message.author.id == client.config.settings.ownerid) {
                    embed.setTitle(`Task Failed Successfully`);
                } else {
                    embed.setTitle(`OK B20`);
                }
                embed.setDescription(`**Autorole has been updated successfully**\n Autorole disabled`);
            } else if (args[1] != null) {
                let rola;
                if (message.guild.roles.cache.get(args[1])) {
                    rola = message.guild.roles.cache.get(args[1]).id;
                } else if (args[1].startsWith("<@&") && args[1].endsWith(">")) {
                    let id = args[1].replace(/[<@&>]/g, "");
                    if (message.guild.roles.cache.get(id)) {
                        rola = message.guild.roles.cache.get(id).id;
                    } else {
                        rola = message.guild.roles.cache.get(args[1]).id;
                    }
                } else if (!rola) {
                    client.emit("uisae", "U05", message, "");
                    return;
                }
                autorole.role = rola;
                autorole.enabled = true;
                await client.db.update('guilds', message.guild.id, 'autorole', autorole);
                embed.setAuthor(`Autorole`, client.user.avatarURL());
                if (message.author.id == client.config.settings.ownerid) {
                    embed.setTitle(`Task Failed Successfully`);
                } else {
                    embed.setTitle(`OK B20`);
                }
                embed.setDescription(`**Autorole has been updated successfully**\n New Autorole: <@&${rola}>`);
            } else {
                client.emit("uisae", "U04", message, "");
                return;
            }
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
                if (discatgui.includes(args[2])) return message.channel.send("This category is already blocked")
                discatgui.push(args[2]);
                await client.db.update('guilds', message.guild.id, 'disabledCategory', discatgui);
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
                if (!(discatgui.includes(args[2]))) return message.channel.send("This category isn't blocked")
                discatgui = discatgui.filter(e => e != args[2]);
                await client.db.update('guilds', message.guild.id, 'disabledCategory', discatgui);
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

        case "--player":
        case "-pl":
            switch (args[1]) {
                case "--nextsong":
                case "-ns":
                    if (args[2] == "enable") {
                        player.nextSong = true;
                        await client.db.update('guilds', message.guild.id, 'player', player);
                        embed.setAuthor(`Next song info`, client.user.avatarURL());
                        if (message.author.id == client.config.settings.ownerid) {
                            embed.setTitle(`Task Failed Successfully`);
                        } else {
                            embed.setTitle(`OK B20`);
                        }
                        embed.setDescription(`**Next song info has been updated successfully**\n Next song info is enabled`);
                    } else if (args[2] == "disable") {
                        player.nextSong = false;
                        await client.db.update('guilds', message.guild.id, 'player', player);
                        embed.setAuthor(`Next song info`, client.user.avatarURL());
                        if (message.author.id == client.config.settings.ownerid) {
                            embed.setTitle(`Task Failed Successfully`);
                        } else {
                            embed.setTitle(`OK B20`);
                        }
                        embed.setDescription(`**Next song info has been updated successfully**\n Next song info is disabled`);
                    } else {
                        client.emit("uisae", "U05", message, "");
                        return;
                    }
                    break;

                case "--skipvote":
                case "-sv":
                    if (args[2] == "enable") {
                        player.voteSkip = true;
                        await client.db.update('guilds', message.guild.id, 'player', player);
                        embed.setAuthor(`Skip vote`, client.user.avatarURL());
                        if (message.author.id == client.config.settings.ownerid) {
                            embed.setTitle(`Task Failed Successfully`);
                        } else {
                            embed.setTitle(`OK B20`);
                        }
                        embed.setDescription(`**Skip vote has been updated successfully**\n Skip vote is enabled`);
                    } else if (args[2] == "disable") {
                        player.voteSkip = false;
                        await client.db.update('guilds', message.guild.id, 'player', player);
                        embed.setAuthor(`Skip vote`, client.user.avatarURL());
                        if (message.author.id == client.config.settings.ownerid) {
                            embed.setTitle(`Task Failed Successfully`);
                        } else {
                            embed.setTitle(`OK B20`);
                        }
                        embed.setDescription(`**Skip vote has been updated successfully**\n Skip vote is disabled`);
                    } else {
                        client.emit("uisae", "U05", message, "");
                        return;
                    }
                    break;

                case "--skiptovote":
                case "-stv":
                    if (args[2] == "enable") {
                        player.voteSkipTo = true;
                        await client.db.update('guilds', message.guild.id, 'player', player);
                        embed.setAuthor(`Skipto vote`, client.user.avatarURL());
                        if (message.author.id == client.config.settings.ownerid) {
                            embed.setTitle(`Task Failed Successfully`);
                        } else {
                            embed.setTitle(`OK B20`);
                        }
                        embed.setDescription(`**Skipto vote has been updated successfully**\n Skipto vote is enabled`);
                    } else if (args[2] == "disable") {
                        player.voteSkipTo = false;
                        await client.db.update('guilds', message.guild.id, 'player', player);
                        embed.setAuthor(`Skipto vote`, client.user.avatarURL());
                        if (message.author.id == client.config.settings.ownerid) {
                            embed.setTitle(`Task Failed Successfully`);
                        } else {
                            embed.setTitle(`OK B20`);
                        }
                        embed.setDescription(`**Skipto vote has been updated successfully**\n Skipto vote is disabled`);
                    } else {
                        client.emit("uisae", "U05", message, "");
                        return;
                    }
                    break;

                case "--previousvote":
                case "-pv":
                case "--prevv":
                case "-prevvote":
                    if (args[2] == "enable") {
                        player.votePrev = true;
                        await client.db.update('guilds', message.guild.id, 'player', player);
                        embed.setAuthor(`Prev vote`, client.user.avatarURL());
                        if (message.author.id == client.config.settings.ownerid) {
                            embed.setTitle(`Task Failed Successfully`);
                        } else {
                            embed.setTitle(`OK B20`);
                        }
                        embed.setDescription(`**Prev vote has been updated successfully**\n Prev vote is enabled`);
                    } else if (args[2] == "disable") {
                        player.votePrev = false;
                        await client.db.update('guilds', message.guild.id, 'player', player);
                        embed.setAuthor(`Prev vote`, client.user.avatarURL());
                        if (message.author.id == client.config.settings.ownerid) {
                            embed.setTitle(`Task Failed Successfully`);
                        } else {
                            embed.setTitle(`OK B20`);
                        }
                        embed.setDescription(`**Prev vote has been updated successfully**\n Prev vote is disabled`);
                    } else {
                        client.emit("uisae", "U05", message, "");
                        return;
                    }
                    break;

                case "--djrole":
                case "-dr":
                    if (args[2] == "disable") {
                        player.djrole = "";
                        await client.db.update('guilds', message.guild.id, 'player', player);
                        embed.setAuthor(`DJ role`, client.user.avatarURL());
                        if (message.author.id == client.config.settings.ownerid) {
                            embed.setTitle(`Task Failed Successfully`);
                        } else {
                            embed.setTitle(`OK B20`);
                        }
                        embed.setDescription(`**DJ role has been updated successfully**\n DJ role disabled`);
                    } else if (args[2] != null) {
                        let rola;
                        if (message.guild.roles.cache.get(args[2])) {
                            rola = message.guild.roles.cache.get(args[2]).id;
                        } else if (args[2].startsWith("<@&") && args[2].endsWith(">")) {
                            let id = args[2].replace(/[<@&>]/g, "");
                            if (message.guild.roles.cache.get(id)) {
                                rola = message.guild.roles.cache.get(id).id;
                            } else {
                                rola = message.guild.roles.cache.get(args[2]).id;
                            }
                        } else if (!rola) {
                            client.emit("uisae", "U05", message, "");
                            return;
                        }
                        player.djrole = rola;
                        await client.db.update('guilds', message.guild.id, 'player', player);
                        embed.setAuthor(`DJ role`, client.user.avatarURL());
                        if (message.author.id == client.config.settings.ownerid) {
                            embed.setTitle(`Task Failed Successfully`);
                        } else {
                            embed.setTitle(`OK B20`);
                        }
                        embed.setDescription(`**DJ role has been updated successfully**\n New DJ role: <@&${rola}>`);
                    } else {
                        client.emit("uisae", "U04", message, "");
                        return;
                    }
                    break;

                default:
                    nie = 1;
                    break;
            }
            break;

        case "-vvk":
        case "--votevoicekick":
            if (args[1] == "disable") {
                voteVK.limit = false;
                await client.db.update('guilds', message.guild.id, 'voteVoiceKick', voteVK);
                embed.setAuthor(`Warn`, client.user.avatarURL());
                if (message.author.id == client.config.settings.ownerid) {
                    embed.setTitle(`Task Failed Successfully`);
                } else {
                    embed.setTitle(`OK B20`);
                }
                embed.setDescription(`**Vote Voice Kick has been updated successfully**\n Vote Voice Kick Disabled`);
            } else {
                if (args[1] == null) {
                    client.emit("uisae", "U04", message, "");
                    return;
                } else if (isNaN(args[1])) {
                    client.emit("uisae", "U05", message, "");
                    return;
                } else {
                    voteVK.limit = args[1];
                    await client.db.update('guilds', message.guild.id, 'voteVoiceKick', voteVK);
                    embed.setAuthor(`VoteVoiceKick`, client.user.avatarURL());
                    if (message.author.id == client.config.settings.ownerid) {
                        embed.setTitle(`Task Failed Successfully`);
                    } else {
                        embed.setTitle(`OK B20`);
                    }
                    embed.setDescription(`**Vote Voice Kick has been updated successfully**\n Vote Voice Kick limit set to ${args[1]}`);
                }
            }
            break;

            /*case "-wa":
            case "--warn":
                switch (args[1]) {
                    case "--limit":
                    case "--l":
                        if (args[2] == null) {
                            client.emit("uisae", "U04", message, "");
                            return;
                        } else if (isNaN(args[2])) {
                            client.emit("uisae", "U05", message, "");
                            return;
                        } else {
                            warn.limit = args[2];
                            await client.db.update('guilds', message.guild.id, 'warn', warn);
                            embed.setAuthor(`Warn`, client.user.avatarURL());
                            if (message.author.id == client.config.settings.ownerid) {
                                embed.setTitle(`Task Failed Successfully`);
                            } else {
                                embed.setTitle(`OK B20`);
                            }
                            embed.setDescription(`**Warn has been updated successfully**\n Warn limit set to ${args[2]}`);
                        }
                        break;

                    case "--vote":
                    case "--v":
                        if (args[2] == null) {
                            client.emit("uisae", "U04", message, "");
                            return;
                        } else if (isNaN(args[2])) {
                            if (args[2] == 0) {
                                warn.votelimit = false;
                                await client.db.update('guilds', message.guild.id, 'warn', warn);
                                embed.setAuthor(`Warn`, client.user.avatarURL());
                                if (message.author.id == client.config.settings.ownerid) {
                                    embed.setTitle(`Task Failed Successfully`);
                                } else {
                                    embed.setTitle(`OK B20`);
                                }
                                embed.setDescription(`**Warn has been updated successfully**\n Vote warn has been disabled`);
                            } else {
                                client.emit("uisae", "U05", message, "");
                            }
                            return;
                        } else {
                            if (args[2] == false) {
                                warn.votelimit = false;
                                await client.db.update('guilds', message.guild.id, 'warn', warn);
                                embed.setAuthor(`Warn`, client.user.avatarURL());
                                if (message.author.id == client.config.settings.ownerid) {
                                    embed.setTitle(`Task Failed Successfully`);
                                } else {
                                    embed.setTitle(`OK B20`);
                                }
                                embed.setDescription(`**Warn has been updated successfully**\n Vote warn has been disabled`);
                                return;
                            }
                            if (args[2] > message.guild.members.cache.filter(m => !m.user.bot).size || args[2] <= 0) {
                                client.emit("uisae", "U06", message, ["1", message.guild.members.cache.filter(m => !m.user.bot).size]);
                            } else {
                                warn.votelimit = args[2];
                                await client.db.update('guilds', message.guild.id, 'warn', warn);
                                embed.setAuthor(`Warn`, client.user.avatarURL());
                                if (message.author.id == client.config.settings.ownerid) {
                                    embed.setTitle(`Task Failed Successfully`);
                                } else {
                                    embed.setTitle(`OK B20`);
                                }
                                embed.setDescription(`**Warn has been updated successfully**\n Vote warn limit set to ${args[2]}`);
                            }
                        }
                        break;

                    case "enable":
                        warn.enabled = true;
                        await client.db.update('guilds', message.guild.id, 'warn', warn);
                        embed.setAuthor(`Warn`, client.user.avatarURL());
                        if (message.author.id == client.config.settings.ownerid) {
                            embed.setTitle(`Task Failed Successfully`);
                        } else {
                            embed.setTitle(`OK B20`);
                        }
                        embed.setDescription(`**Warn has been updated successfully**\n Warn Enabled`);
                        break;

                    case "disable":
                        warn.enabled = false;
                        await client.db.update('guilds', message.guild.id, 'warn', warn);
                        embed.setAuthor(`Warn`, client.user.avatarURL());
                        if (message.author.id == client.config.settings.ownerid) {
                            embed.setTitle(`Task Failed Successfully`);
                        } else {
                            embed.setTitle(`OK B20`);
                        }
                        embed.setDescription(`**Warn has been updated successfully**\n Warn Disabled`);
                        break;

                    default:
                        client.emit("uisae", "U04", message, "");
                        return;
                }
                break;
                */
        case "--welcome":
        case "-w":
            switch (args[1]) {
                case null:
                    client.emit("uisae", "U04", message, "");
                    return;

                case "enable":
                    if (welcome.channel == "" || welcome.msg == "") return message.reply(`You need to set channel and message first`);
                    welcome.enabled = true;
                    await client.db.update('guilds', message.guild.id, 'welcome', welcome);
                    embed.setAuthor(`Welcome`, client.user.avatarURL());
                    if (message.author.id == client.config.settings.ownerid) {
                        embed.setTitle(`Task Failed Successfully`);
                    } else {
                        embed.setTitle(`OK B20`);
                    }
                    embed.setDescription(`**Welcome has been updated successfully**\n Welcome Enabled`);
                    break;

                case "disable":
                    welcome.enabled = false;
                    await client.db.update('guilds', message.guild.id, 'welcome', welcome);
                    embed.setAuthor(`Welcome`, client.user.avatarURL());
                    if (message.author.id == client.config.settings.ownerid) {
                        embed.setTitle(`Task Failed Successfully`);
                    } else {
                        embed.setTitle(`OK B20`);
                    }
                    embed.setDescription(`**Welcome has been updated successfully**\n Welcome Disabled`);
                    break;

                case "--channel":
                case "-c":
                    let channel;
                    if (!args[2]) {
                        channel = message.channel.id;
                    } else if (message.guild.channels.cache.get(args[2])) {
                        channel = message.guild.channels.cache.get(args[2]).id;
                    } else if (args[2].startsWith("<#") && args[2].endsWith(">")) {
                        let id = args[2].replace(/[<#>]/g, "");
                        if (message.guild.channels.cache.get(id)) {
                            channel = message.guild.channels.cache.get(id).id;
                        } else {
                            channel = message.guild.channels.cache.get(args[2]).id;
                        }
                    } else if (!channel) {
                        client.emit("uisae", "U05", message, "");
                        return;
                    }
                    welcome.channel = channel;
                    await client.db.update('guilds', message.guild.id, 'welcome', welcome);
                    embed.setAuthor(`Welcome`, client.user.avatarURL());
                    if (message.author.id == client.config.settings.ownerid) {
                        embed.setTitle(`Task Failed Successfully`);
                    } else {
                        embed.setTitle(`OK B20`);
                    }
                    embed.setDescription(`**Welcome has been updated successfully**\n New Welcome Channel: <#${channel}>`);
                    break;

                case "--message":
                case "-m":
                    msg = args.slice(2).join(' ');
                    if (message.author.id == client.config.settings.ownerid && message.content.endsWith("ownerabuse")) {
                        msg = msg.replace(new RegExp("ownerabuse", "g"), "")
                    };
                    if (!msg) return client.emit("uisae", "U04", message, "");
                    welcome.msg = msg;
                    await client.db.update('guilds', message.guild.id, 'welcome', welcome);
                    embed.setAuthor(`Welcome`, client.user.avatarURL());
                    if (msg.length >= 900) {
                        msg = "`Too long to display`\n> Use `" + prefix + "settings welcome msgshow` to display the message"
                    }
                    if (message.author.id == client.config.settings.ownerid) {
                        embed.setTitle(`Task Failed Successfully`);
                    } else {
                        embed.setTitle(`OK B20`);
                    }
                    embed.setDescription(`**Welcome has been updated successfully**\n New Welcome Message:\n${msg}`);
                    break;

                case "--messageshow":
                case "-ms":
                    nie = 1;
                    if (!welcome.msg) {
                        return message.channel.send("No welcome message");
                    }
                    message.channel.send(welcome.msg);
                    break;

                case "--messagetest":
                case "-mt":
                    nie = 1;
                    if (!welcome.msg) {
                        return message.channel.send("No welcome message");
                    }
                    member = message.member
                    channela = member.guild.channels.cache.get(welcome.channel);
                    if (channela == undefined) {
                        channela = message.channel.id
                    };
                    msg = welcome.msg.replace(new RegExp("#USER#", "g"), message.author.username).replace(new RegExp("#GUILD#", "g"), member.guild.name).replace(new RegExp("#MENTION#", "g"), `<@${member.id}>`).replace(new RegExp("#TAG#", "g"), message.author.discriminator).replace(new RegExp("#MEMBERCOUNT#", "g"), member.guild.memberCount).replace(new RegExp("#USERCOUNT#", "g"), member.guild.members.cache.filter(m => !m.user.bot).size);
                    channela.send("`TEST`\n" + msg);
                    break;

                default:
                    nie = 1;
                    break;
            }
            break;

        case "--goodbye":
        case "-g":
            switch (args[1]) {
                case null:
                    client.emit("uisae", "U04", message, "");
                    return;

                case "enable":
                    if (goodbye.channel == "" || goodbye.msg == "") return message.reply(`You need to set channel and message first`);
                    goodbye.enabled = true;
                    await client.db.update('guilds', message.guild.id, 'goodbye', goodbye);
                    embed.setAuthor(`Goodbye`, client.user.avatarURL());
                    if (message.author.id == client.config.settings.ownerid) {
                        embed.setTitle(`Task Failed Successfully`);
                    } else {
                        embed.setTitle(`OK B20`);
                    }
                    embed.setDescription(`**Goodbye has been updated successfully**\n Goodbye Enabled`);
                    break;

                case "disable":
                    goodbye.enabled = false;
                    await client.db.update('guilds', message.guild.id, 'goodbye', goodbye);
                    embed.setAuthor(`Goodbye`, client.user.avatarURL());
                    if (message.author.id == client.config.settings.ownerid) {
                        embed.setTitle(`Task Failed Successfully`);
                    } else {
                        embed.setTitle(`OK B20`);
                    }
                    embed.setDescription(`**Goodbye has been updated successfully**\n Goodbye Disabled`);
                    break;

                case "--channel":
                case "-c":
                    let channel;
                    if (!args[2]) {
                        channel = message.channel.id;
                    } else if (message.guild.channels.cache.get(args[2])) {
                        channel = message.guild.channels.cache.get(args[2]).id;
                    } else if (args[2].startsWith("<#") && args[2].endsWith(">")) {
                        let id = args[2].replace(/[<#>]/g, "");
                        if (message.guild.channels.cache.get(id)) {
                            channel = message.guild.channels.cache.get(id).id;
                        } else {
                            channel = message.guild.channels.cache.get(args[2]).id;
                        }
                    } else if (!channel) {
                        client.emit("uisae", "U05", message, "");
                        return;
                    }
                    goodbye.channel = channel;
                    await client.db.update('guilds', message.guild.id, 'goodbye', goodbye);
                    embed.setAuthor(`Goodbye`, client.user.avatarURL());
                    if (message.author.id == client.config.settings.ownerid) {
                        embed.setTitle(`Task Failed Successfully`);
                    } else {
                        embed.setTitle(`OK B20`);
                    }
                    embed.setDescription(`**Goodbye has been updated successfully**\n New Goodbye Channel: <#${channel}>`);
                    break;

                case "--message":
                case "-m":
                    msg = args.slice(2).join(' ');
                    if (message.author.id == client.config.settings.ownerid && message.content.endsWith("ownerabuse")) {
                        msg = msg.replace(new RegExp("ownerabuse", "g"), "")
                    };
                    if (!msg) return client.emit("uisae", "U04", message, "");
                    goodbye.msg = msg;
                    await client.db.update('guilds', message.guild.id, 'goodbye', goodbye);
                    embed.setAuthor(`Goodbye`, client.user.avatarURL());
                    if (msg.length >= 900) {
                        msg = "`Too long to display`\n> Use `" + prefix + "settings goodbye msgshow` to display the message"
                    }
                    if (message.author.id == client.config.settings.ownerid) {
                        embed.setTitle(`Task Failed Successfully`);
                    } else {
                        embed.setTitle(`OK B20`);
                    }
                    embed.setDescription(`**Goodbye has been updated successfully**\n New Goodbye Message:\n${msg}`);
                    break;

                case "--messageshow":
                case "-ms":
                    nie = 1;
                    if (!goodbye.msg) {
                        return message.channel.send("No goodbye message");
                    }
                    message.channel.send(welcome.msg);
                    break;

                case "--messagetest":
                case "-mt":
                    nie = 1;
                    if (!goodbye.msg) {
                        return message.channel.send("No goodbye message");
                    }
                    member = message.member
                    channelb = member.guild.channels.cache.get(goodbye.channel);
                    if (channelb == undefined) {
                        channelb = message.channel.id
                    };
                    msg = goodbye.msg.replace(new RegExp("#USER#", "g"), message.author.username).replace(new RegExp("#GUILD#", "g"), member.guild.name).replace(new RegExp("#MENTION#", "g"), `<@${member.id}>`).replace(new RegExp("#TAG#", "g"), message.author.discriminator).replace(new RegExp("#MEMBERCOUNT#", "g"), member.guild.memberCount).replace(new RegExp("#USERCOUNT#", "g"), member.guild.members.cache.filter(m => !m.user.bot).size);
                    channelb.send("`TEST`\n" + msg);
                    break;

                default:
                    nie = 1;
                    break;
            }
            break;

        default:
            d = slowmode
            second = 1;
            minute = second * 60;
            mins = Math.floor(d / (minute));
            secs = Math.floor((d % (minute)) / (second));
            leg = 8;
            switch (dis.settings) {
                case "allinone":
                    if (welcome.msg.length >= 381) {
                        welcome.msg = "`Too long to display`\n> Use `" + prefix + "settings --welcome --messageshow` to display the message"
                    }
                    if (goodbye.msg.length >= 381) {
                        goodbye.msg = "`Too long to display`\n> Use `" + prefix + "settings --goodbye --messageshow` to display the message"
                    }
                    embed.setDescription(`
                    **Prefix** (pr)
                    > Prefix: \`${prefix}\`
                    **Slowmode** (s)
                    > Slowmode: \`${mins}\`m \`${secs}\`s
                    **Autorole** (a)
                    > Enabled: \`${autorole.enabled}\`\n> Role: ${autorole.enabled ? autorole.role == "" ? "none" : `<@&${autorole.role}>` : "none"}
                    **Disabled Category** (c)
                    > Blocked: \`${disabledCategory}\`
                    **Music Player** (pl)
                    > DJ role: ${player.djrole == "" ? "none" : `<#${player.djrole}>`}\n> Next song info: \`${player.nextSong}\`\n> Skip vote: \`${player.voteSkip}\`\n> Skipto vote: \`${player.voteSkipTo}\`\n> Prev vote: \`${player.votePrev}\`
                    **Vote Voice Kick** (vvk)
                    > Votes to voicekick: \`${voteVK.limit==false?'disabled':voteVK.limit}\`
                    **Welcome** (w)
                    > Enabled: \`${welcome.enabled}\`\n> Channel: ${welcome.channel == "" ? "none" : `<#${welcome.channel}>`}\n> Message:\n${welcome.msg}\n
                    **Goodbye** (g)
                    > Enabled: \`${goodbye.enabled}\`\n> Channel: ${goodbye.channel == "" ? "none" : `<#${goodbye.channel}>`}\n> Message:\n${goodbye.msg}
                    
                    Use \`${prefix}settings --edit\` if you want to change settings
                    `);
                    embed.setTitle(`Settings`);
                    break;

                case "pagesone":
                    if (!isNaN(args[0])) {
                        args[0] = Math.abs(args[0]);
                    } else if (isNaN(args[0])) {
                        args[0] = 1;
                    }
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
                                comalist[i].setTitle("Prefix (pr)");
                                comalist[i].setDescription(`\`${prefix}\``);
                                break;
                            case 1:
                                comalist[i].setTitle("Slowmode (s)");
                                comalist[i].setDescription(`\`${mins}\`m \`${secs}\`s`);
                                break;
                            case 2:
                                comalist[i].setTitle("Autorole (a)");
                                comalist[i].setDescription(`Enabled: \`${autorole.enabled}\`\n Role: ${autorole.enabled ? autorole.role == "" ? "none" : `<@&${autorole.role}>` : "none"}`);
                                break;
                            case 3:
                                comalist[i].setTitle("Disabled Category (c)");
                                comalist[i].setDescription(`Blocked: \`${disabledCategory}\``);
                                break;
                            case 4:
                                comalist[i].setTitle("Music Player (pl)");
                                comalist[i].setDescription(`DJ role: ${player.djrole == "" ? "none" : `<#${player.djrole}>`}\n Next song info: \`${player.nextSong}\`\n Skip vote: \`${player.voteSkip}\`\n Skipto vote: \`${player.voteSkipTo}\`\n Prev vote: \`${player.votePrev}\``);
                                break;
                            case 5:
                                comalist[i].setTitle("Vote Voice Kick (vvk)");
                                comalist[i].setDescription(`Votes to voicekick: \`${voteVK.limit==false?'disabled':voteVK.limit}\``);
                                break;
                            case 6:
                                comalist[i].setTitle("Welcome (w)");
                                comalist[i].setDescription(`Enabled: \`${welcome.enabled}\`\n Channel: ${welcome.channel == "" ? "none" : `<#${welcome.channel}>`}\n Message:\n${welcome.msg}`);
                                break;
                            case 7:
                                comalist[i].setTitle("Goodbye (g)");
                                comalist[i].setDescription(`Enabled: \`${goodbye.enabled}\`\n Channel: ${goodbye.channel == "" ? "none" : `<#${goodbye.channel}>`}\n Message:\n${goodbye.msg}`);
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
                    nie = true;
                    break;

                case "pagesexp":
                    if (!isNaN(args[0])) {
                        args[0] = Math.abs(args[0]);
                    } else if (isNaN(args[0])) {
                        args[0] = 1;
                    }
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
                                comalist[i].setTitle("Prefix (pr)");
                                comalist[i].setDescription(`\`${prefix}\``);
                                comalist[i].addField("\u200b", `> \`${prefix}settings --prefix <new prefix>\``);
                                break;
                            case 1:
                                comalist[i].setTitle("Slowmode (s)");
                                comalist[i].setDescription(`\`${mins}\`m \`${secs}\`s`);
                                comalist[i].addField("\u200b", `> \`${prefix}settings --slowmode <new slowmode in seconds>\``);
                                break;
                            case 2:
                                comalist[i].setTitle("Autorole (a)");
                                comalist[i].setDescription(`Enabled: \`${autorole.enabled}\`\n Role: ${autorole.enabled ? autorole.role == "" ? "none" : `<@&${autorole.role}>` : "none"}`);
                                comalist[i].addField("\u200b", `> \`${prefix}settings --autorole <@role or role id>\`\n> \`${prefix}settings --autorole disable\``);
                                break;
                            case 3:
                                comalist[i].setTitle("Disabled Category (c)");
                                comalist[i].setDescription(`Blocked: \`${disabledCategory}\``);
                                comalist[i].addField("\u200b", `> \`${prefix}settings --category block/unblock <category codename>\` (category name /codename/ is in help in brackets **Name (codename) [num of commands]**)`);
                                break;
                            case 4:
                                comalist[i].setTitle("Music Player (pl)");
                                comalist[i].setDescription(`DJ role: ${player.djrole == "" ? "none" : `<#${player.djrole}>`}\n Next song info: \`${player.nextSong}\`\n Skip vote: \`${player.voteSkip}\`\n Skipto vote: \`${player.voteSkipTo}\`\n Prev vote: \`${player.votePrev}\``);
                                comalist[i].addField("\u200b", `> \`${prefix}settings --player --djrole <@role or role id>\` (use \`disable\` to disable, allows only people with this role to manage player/songs)\n> \`${prefix}settings --player --nextsong enable/disable\`\n> \`${prefix}settings --player --skipvote enable/disable\`\n> \`${prefix}settings --player --skiptovote enable/disable\`\n> \`${prefix}settings --player --previousvote enable/disable\``);
                                break;
                            case 5:
                                comalist[i].setTitle("Vote Voice Kick (vvk)");
                                comalist[i].setDescription(`Votes to voicekick: \`${voteVK.limit==false?'disabled':voteVK.limit}\``);
                                comalist[i].addField("\u200b", `> \`${prefix}settings --votevoicekick <number of votes to activate>\`\n> \`${prefix}settings --votevoicekick disable\``);
                                break;
                            case 6:
                                comalist[i].setTitle("Welcome (w)");
                                comalist[i].setDescription(`Enabled: \`${welcome.enabled}\`\n Channel: ${welcome.channel == "" ? "none" : `<#${welcome.channel}>`}\n Message:\n${welcome.msg}`);
                                comalist[i].addField("\u200b", `> \`${prefix}settings --welcome --channel <#channel or channel id>\`\n> \`${prefix}settings --welcome --message <welcome message>\`\n> \`${prefix}settings --welcome enable/disable\``);
                                comalist[i].addField("You can add to welcome message:", `> #USER# - username\n> #MENTION# - mention\n> #TAG# - user tag, e. g. #1234\n> #GUILD# - guild name\n> #MEMBERCOUNT# - count of all members with counting bots\n> #USERCOUNT# - count of all members without counting bots
                                If you want to test how the message would look then use \`${prefix}settings --welcome --messagetest\`\nIf you had already set channel then it will send message on that channel if not then on the message channel.`);
                                break;
                            case 7:
                                comalist[i].setTitle("Goodbye (g)");
                                comalist[i].setDescription(`Enabled: \`${goodbye.enabled}\`\n Channel: ${goodbye.channel == "" ? "none" : `<#${goodbye.channel}>`}\n Message:\n${goodbye.msg}`);
                                comalist[i].addField("\u200b", `> \`${prefix}settings --goodbye --channel <#channel or channel id>\`\n> \`${prefix}settings --goodbye --message <goodbye message>\`\n> \`${prefix}settings --goodbye enable/disable\``);
                                comalist[i].addField("You can add to goodbye message:", `> #USER# - username\n> #MENTION# - mention\n> #TAG# - user tag, e. g. #1234\n> #GUILD# - guild name\n> #MEMBERCOUNT# - count of all members with counting bots\n> #USERCOUNT# - count of all members without counting bots
                                If you want to test how the message would look then use \`${prefix}settings --goodbye --messagetest\`\nIf you had already set channel then it will send message on that channel if not then on the message channel.`);
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
                    nie = true;
                    break;

                default:
                    if (welcome.msg.length >= 381) {
                        welcome.msg = "`Too long to display`\n> Use `" + prefix + "settings --welcome --messageshow` to display the message"
                    }
                    if (goodbye.msg.length >= 381) {
                        goodbye.msg = "`Too long to display`\n> Use `" + prefix + "settings --goodbye --messageshow` to display the message"
                    }
                    embed.setDescription(`
                    **Prefix** (pr)
                    > Prefix: \`${prefix}\`
                    **Slowmode** (s)
                    > Slowmode: \`${mins}\`m \`${secs}\`s
                    **Autorole** (a)
                    > Enabled: \`${autorole.enabled}\`\n> Role: ${autorole.enabled ? autorole.role == "" ? "none" : `<@&${autorole.role}>` : "none"}
                    **Disabled Category** (c)
                    > Blocked: \`${disabledCategory}\`
                    **Music Player** (pl)
                    > DJ role: ${player.djrole == "" ? "none" : `<#${player.djrole}>`}\n> Next song info: \`${player.nextSong}\`\n> Skip vote: \`${player.voteSkip}\`\n> Skipto vote: \`${player.voteSkipTo}\`\n> Prev vote: \`${player.votePrev}\`
                    **Vote Voice Kick** (vvk)
                    > Votes to voicekick: \`${voteVK.limit==false?'disabled':voteVK.limit}\`
                    **Welcome** (w)
                    > Enabled: \`${welcome.enabled}\`\n> Channel: ${welcome.channel == "" ? "none" : `<#${welcome.channel}>`}\n> Message:\n${welcome.msg}\n
                    **Goodbye** (g)
                    > Enabled: \`${goodbye.enabled}\`\n> Channel: ${goodbye.channel == "" ? "none" : `<#${goodbye.channel}>`}\n> Message:\n${goodbye.msg}
                    
                    Use \`${prefix}settings --edit\` if you want to change settings
                    `);
                    embed.setTitle(`Settings`);
                    break;
            }
            break;
    }
    if (!nie) {
        message.channel.send(embed);
    }
}