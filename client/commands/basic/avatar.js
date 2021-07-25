const Discord = require("discord.js");
const AllowedFormat = ['webp', 'png', 'jpg', 'jpeg', 'gif'];
// const Allowedsize = Array.from({
//     length: 9
// }, (e, i) => 2 ** (i + 4));
const AllowedSize = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096];
let imageOptions = {
    format: 'png',
    dynamic: false,
    size: 2048
}
let userselect = null;
const CommandKeys =

module.exports.info = {
    name: "avatar",
    tags: ["picture", "avatar", "display", "basic"]
}

module.exports.run = async (client, message, args) => {

}

module.exports.run = async (client, message, args) => {

    // handled data for user input -u <user_id> -s <size>
    for (let dataNum = 0; dataNum < args.length / 2; dataNum++) {
        switch (args[dataNum]) {
            case `-${client.wordsCom.command.avatar.format[0]}`:
            case `--${client.wordsCom.command.avatar.format}`:
                if (AllowedFormat.includes(args[dataNum + 1])) {
                    imageOptions.format = args[dataNum + 1];
                }
                break;

            case `-${client.wordsCom.command.avatar.size[0]}`:
            case `--${client.wordsCom.command.avatar.size}`:
                if (AllowedSize.includes(Number(args[dataNum + 1]))) {
                    imageOptions.size = Number(args[dataNum + 1]);
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

    let user = await client.util.searchUser(client, message, userselect, false, true, false);
    //let user = await client.util.searchUser(message, userselect).catch(() => {});

    if ((args[1] === "gif" || args[3] === "gif" || args[5] === "gif" || args[7] === "gif") && user.avatar.startsWith("a_")) {
        imageOptions.dynamic = true;
    } else {
        imageOptions.dynamic = false;
        imageOptions.format = "png";
    }

    // here done

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