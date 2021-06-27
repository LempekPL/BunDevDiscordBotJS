const Discord = require("discord.js");
const allowedformat = ['webp', 'png', 'jpg', 'jpeg', 'gif'];
const allowedsize = Array.from({
    length: 9
}, (e, i) => 2 ** (i + 4));
let img = {
    format: 'png',
    dynamic: true,
    size: 2048
}
let userselect = null;

module.exports.info = {
    name: "avatar",
    lang: {
        en: require("../../../lang/en.json").command.avatar.infoData,
        pl: require("../../../lang/pl.json").command.avatar.infoData
    },
    tags: ["picture", "avatar", "display", "basic"]
}


module.exports.run = async (client, message, args) => {

    // handled data for user input -u <user_id> -s <size>
    for (let dataNum = 0; dataNum < args.length / 2; dataNum++) {
        switch (args[dataNum]) {
            case `-${client.wordsCom.command.avatar.format[0]}`:
            case `--${client.wordsCom.command.avatar.format}`:
                if (allowedformat.includes(args[dataNum + 1])) {
                    img.format = args[dataNum + 1];
                }
                break;

            case `-${client.wordsCom.command.avatar.dynamic[0]}`:
            case `--${client.wordsCom.command.avatar.dynamic}`:
                img.dynamic = args[dataNum + 1] !== "false";
                break;

            case `-${client.wordsCom.command.avatar.size[0]}`:
            case `--${client.wordsCom.command.avatar.size}`:
                if (allowedsize.includes(Number(args[dataNum + 1]))) {
                    img.size = Number(args[dataNum + 1]);
                }
                break;

            case `-${client.wordsCom.command.avatar.user[0]}`:
            case `--${client.wordsCom.command.avatar.user}`:
                userselect = args[dataNum + 1];
                break;

            default:
                userselect = args[dataNum];
                break;
        }
    }

    let user = await client.util.searchUser(message, userselect).catch(() => {client.emit("uisae", "U04", message, "");});

    if (args[1] === "gif" || args[3] === "gif" || args[5] === "gif" || args[7] === "gif") {
        img.format = user.avatar.startsWith('a_') ? 'gif' : 'png';
    }

    let embed = new Discord.MessageEmbed;
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
    embed.addField("Use for more info", `${client.dbCache.guilds[message.guild.id].prefix}help avatar`)
    embed.setColor(client.util.randomColorConfig(client));
    client.util.setFooterOwner(client, embed);
    embed.setTimestamp();

    if (message.author.id === client.config.settings.ownerid) {
        let reportEmbed = new Discord.MessageEmbed;
        reportEmbed.setTitle(user.tag + " avatar");
        reportEmbed.setDescription(`\`${user.avatarURL({format: img.format, dynamic: img.dynamic, size: img.size})}\``);
        reportEmbed.setThumbnail(user.avatarURL(user.avatarURL({format: img.format, dynamic: img.dynamic, size: img.size})));
        reportEmbed.setColor('#ff0000');
        reportEmbed.addField("Server ID", message.guild + " (" + message.guild.id + ")");
        reportEmbed.addField("Channel ID", message.channel + " (" + message.channel.id + ")");
        reportEmbed.addField("Message ID", message.id);
        reportEmbed.addField("Message Created", message.createdAt);
        reportEmbed.addField("Message Owner", message.author.tag + " (" + message.author.id + ")");
        reportEmbed.setTimestamp();

        let whook = new Discord.WebhookClient(client.config.webhooks.image.split("/")[5], client.config.webhooks.image.split("/")[6]);
        let messageData = await message.channel.send(embed)
        reportEmbed.addField("Bot Message Link", "https://discordapp.com/channels/" + message.guild.id + "/" + message.channel.id + "/" + messageData.id);

        whook.send(reportEmbed)
    } else {
        message.channel.send(embed)
    }
}