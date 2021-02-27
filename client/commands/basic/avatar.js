let Discord = require("discord.js");
let db = require('../../../util/db');
let util = require("../../../util/util");
let config = require("../../../data/config.json");
let whook = new Discord.WebhookClient(config.webhooks.image.split("/")[5], config.webhooks.image.split("/")[6]);
let allowedformat = ['webp', 'png', 'jpg', 'jpeg', 'gif'];
let allowedsize = Array.from({
    length: 9
}, (e, i) => 2 ** (i + 4));
let spec;

module.exports.info = {
    name: "avatar",
    aliases: ["av"],
    example: "`#PREFIX##COMMAND# <userid/mention/username>` or `#PREFIX##COMMAND# -h` for more options",
    info: "Shows your or someone's else avatar",
    tags: ["picture","avatar","display","basic"]
}

module.exports.run = async (client, message, args) => {
    if (await util.blockCheck(util.codename(__dirname),message)) return;
    let i = Math.floor(Math.random() * config.c.length);
    let ce = config.c[i];
    let prefix = await db.get("guilds",message.guild.id,"prefix");
    let embed = new Discord.MessageEmbed;
    let img = {
        format: 'png',
        dynamic: true,
        size: 2048
    }
    let userselect = null;

    for (let dane = 0; dane < args.length/2; dane++) {
        switch (args[dane]) {
            case "-f":
            case "--format":
                if (allowedformat.includes(args[dane+1])) {
                    img.format = args[dane+1];
                }
                break;
            case "-d":
            case "--dynamic":
                if (args[dane+1] == "false") {
                    img.dynamic = false;
                } else {
                    img.dynamic = true;
                }
                break;
            case "-s":
            case "--size":
                if (allowedsize.includes(Number(args[dane+1]))) {
                    img.size = Number(args[dane+1]);
                }
                break;
    
            case "-u":
            case "--user":
                userselect = args[dane+1];
                break;
    
            case "-h":
            case "--help":
                embed.setTitle("Help avatar");
                embed.addField("You can use with command", `
                > -f or --format to define format (only allowed formats png, jpg, jpeg, webp, gif)
                > default: png\n
                > -s or --size to define size (only allowed sizes 16,32,64,128,256,512,1024,2048,4096)
                > default: 2048\n
                > -u or --user to define user (you can mention or use user id)
                > default: user using the command\n
                > -d or --dynamic if true then it will automaticly change format to gif if possible (only true or false; helpful when you want to use other format than gif)
                > default: true\n
                > -h or --help shows this info`)
                embed.setColor(ce)
                embed.setFooter("© "+client.users.cache.get(config.settings.ownerid).username, client.users.cache.get(config.settings.ownerid).avatarURL());
                embed.setTimestamp();
                return message.channel.send(embed);
    
            default:
                userselect = args[dane];
                break;
        }
    }

    util.searchUser(message, userselect).then(user => {
        if (args[1] == "gif") {
            img.format = user.avatar.startsWith('a_') ? 'gif' : 'png';
        };
        if (args[3] == "gif") {
            img.format = user.avatar.startsWith('a_') ? 'gif' : 'png';
        };
        if (args[5] == "gif") {
            img.format = user.avatar.startsWith('a_') ? 'gif' : 'png';
        };
        if (args[7] == "gif") {
            img.format = user.avatar.startsWith('a_') ? 'gif' : 'png';
        };
        embed.setTitle(user.tag + " avatar");
        embed.setDescription("[[LINK]](" + user.avatarURL({
            format: img.format,
            dynamic: img.dynamic,
            size: img.size
        }) + ")");
        embed.setImage(user.avatarURL({
            format: img.format,
            dynamic: img.dynamic,
            size: img.size
        }));
        embed.addField("Use for more info", `${prefix}avatar --help`)
        embed.setColor(ce)
        if (config.settings.subowners.length==0) {
            embed.setFooter("© "+client.users.cache.get(config.settings.ownerid).username, client.users.cache.get(config.settings.ownerid).avatarURL());
        } else {
            let owners = client.users.cache.get(config.settings.ownerid).username
            config.settings.subowners.forEach(sub => {
                owners+=` & ${client.users.cache.get(sub).username}`;
            });
            embed.setFooter("© "+owners, client.user.avatarURL());
        }
        embed.setTimestamp();
        let ema = new Discord.MessageEmbed;
        ema.setTitle(user.tag + " avatar");
        ema.setDescription("[[LINK]](" + user.avatarURL({
            format: img.format,
            dynamic: img.dynamic,
            size: img.size
        }) + ") \n\n `" + user.avatarURL({
            format: img.format,
            dynamic: img.dynamic,
            size: img.size
        }) + "`");
        ema.setThumbnail(user.avatarURL({
            format: img.format,
            dynamic: img.dynamic,
            size: img.size
        }));
        ema.setColor('#ff0000');
        ema.addField("Server ID", message.guild + " (" + message.guild.id + ")");
        ema.addField("Channel ID", message.channel + " (" + message.channel.id + ")");
        ema.addField("Message ID", message.id);
        ema.addField("Message Created", message.createdAt);
        ema.addField("Owner", message.author.tag + " (" + message.author.id + ")");
        if (config.settings.subowners.length==0) {
            ema.setFooter("© "+client.users.cache.get(config.settings.ownerid).username, client.users.cache.get(config.settings.ownerid).avatarURL());
        } else {
            let owners = client.users.cache.get(config.settings.ownerid).username
            config.settings.subowners.forEach(sub => {
                owners+=` & ${client.users.cache.get(sub).username}`;
            });
            ema.setFooter("© "+owners, client.user.avatarURL());
        }
        ema.setTimestamp();
        yes(embed, ema)



    }).catch((err) => {
        console.error(err)
        client.emit("uisae", "B04", message, "");
    });

    async function yes(embed, ema) {
        spec = await message.channel.send(embed)
        ema.addField("Bot Message Link", "https://discordapp.com/channels/" + message.guild.id + "/" + message.channel.id + "/" + spec.id);
        if (message.author.id != config.settings.ownerid) {
            whook.send(ema);
        }
    }
}