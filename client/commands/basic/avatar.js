let Discord = require("discord.js");
let allowedformat = ['webp', 'png', 'jpg', 'jpeg', 'gif'];
let allowedsize = Array.from({
    length: 9
}, (e, i) => 2 ** (i + 4));

module.exports.info = {
    name: "avatar",
    aliases: ["av"],
    tags: ["picture","avatar","display","basic"]
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname),message)) return;
    let whook = new Discord.WebhookClient(client.config.webhooks.image.split("/")[5], client.config.webhooks.image.split("/")[6]);
    let prefix = await client.db.get("guilds",message.guild.id,"prefix");
    let embed = new Discord.MessageEmbed;
    let img = {
        format: 'png',
        dynamic: true,
        size: 2048
    }
    let userselect = null;

    for (let dane = 0; dane < args.length/2; dane++) {
        switch (args[dane]) {
            case `-${client.wordsCom.command.avatar.format[0]}`:
            case `--${client.wordsCom.command.avatar.format}`:
                if (allowedformat.includes(args[dane+1])) {
                    img.format = args[dane+1];
                }
                break;

            case "-d":
            case "--dynamic":
            case `-${client.wordsCom.command.avatar.dynamic[0]}`:
            case `--${client.wordsCom.command.avatar.dynamic}`:
                if (args[dane+1] == "false") {
                    img.dynamic = false;
                } else {
                    img.dynamic = true;
                }
                break;

            case "-s":
            case "--size":
            case `-${client.wordsCom.command.avatar.size[0]}`:
            case `--${client.wordsCom.command.avatar.size}`:
                if (allowedsize.includes(Number(args[dane+1]))) {
                    img.size = Number(args[dane+1]);
                }
                break;
    
            case `-${client.wordsCom.command.avatar.user[0]}`:
            case `--${client.wordsCom.command.avatar.user}`:
                userselect = args[dane+1];
                break;
    
            case `-${client.wordsCom.command.avatar.help[0]}`:
            case `--${client.wordsCom.command.avatar.help}`:
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
                embed.setColor(client.util.randomColorConfig(client));
                embed.setFooter("© "+client.users.cache.get(client.config.settings.ownerid).username, client.users.cache.get(client.config.settings.ownerid).avatarURL());
                embed.setTimestamp();
                return message.channel.send(embed);
    
            default:
                userselect = args[dane];
                break;
        }
    }

    client.util.searchUser(message, userselect).then(user => {
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
        embed.setColor(client.util.randomColorConfig(client));
        if (client.config.settings.subowners.length==0) {
            embed.setFooter("© "+client.users.cache.get(client.config.settings.ownerid).username, client.users.cache.get(client.config.settings.ownerid).avatarURL());
        } else {
            let owners = client.users.cache.get(client.config.settings.ownerid).username
            client.config.settings.subowners.forEach(sub => {
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
        if (client.config.settings.subowners.length==0) {
            ema.setFooter("© "+client.users.cache.get(client.config.settings.ownerid).username, client.users.cache.get(client.config.settings.ownerid).avatarURL());
        } else {
            let owners = client.users.cache.get(client.config.settings.ownerid).username
            client.config.settings.subowners.forEach(sub => {
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
        if (message.author.id != client.config.settings.ownerid) {
            whook.send(ema);
        }
    }
}