const Discord = require("discord.js");
const Allowed = {
    format: ["webp", "png", "jpg", "jpeg", "gif"],
    size: [16, 32, 64, 128, 256, 512, 1024, 2048, 4096]
}
let imageOptions = {size: 2048}
let userSelect = null;

module.exports.info = {
    name: "avatar",
    tags: ["picture", "avatar", "display", "basic"]
}

module.exports.run = async (client, message, args) => {
    const CommandStrings = client.dbData.guilds.language.force ? require(`../../../langs/${client.dbData.guilds.language.commands}/commands.json`) : require(`../../../langs/${client.dbData.users.language.commands}/commands.json`);

    if (args.length === 1) {
        userSelect = args[0];
    } else if (args.length > 1) {
        for (let i = 0; i <= 4 && args[i]?.includes("-"); i += 2) {
            let dataType = args[i].split("-");
            switch (dataType[1]) {
                case CommandStrings.avatar.args.user:
                    if (i === 4 && args.length > 5) {
                        userSelect = [...args]
                        userSelect.splice(0, 5)
                        userSelect.splice(5)
                        break;
                    }
                    userSelect = args[i + 1];
                    break;
                case CommandStrings.avatar.args.format:
                    if (Allowed.format.includes(args[i + 1])) {
                        imageOptions.format = args[i + 1];
                    }
                    break;
                case CommandStrings.avatar.args.size:
                    if (Allowed.size.includes(Number(args[i + 1]))) {
                        imageOptions.size = Number(args[i + 1]);
                    }
                    break;
                default:
                    break;
            }
        }
    } else {
        userSelect = message.author.id
    }

    let users = [];
    let user = null;
    if (typeof userSelect === "string") {
        user = await client.util.searchUser(client, message, userSelect, {
            returnAuthor: true,
            ignoreBots: false,
            multiServerSearch: true,
            allowChoose: true
        });
        if (!user) return;
    } else if (userSelect != null) {
        console.log(userSelect)
        for (const userSelectElement of userSelect) {
            let tempUser = await client.util.searchUser(client, message, userSelectElement, {
                returnAuthor: false,
                ignoreBots: false,
                multiServerSearch: true,
                allowChoose: true
            });
            if (!tempUser) continue;
            users.push(tempUser);
        }
    }

    if (user != null) {
        if (imageOptions.format === "gif" && !user.avatar.startsWith("a_")) {
            imageOptions.format = "png";
        }
        let messageData = sendEmbed(client, message, user, imageOptions);
    } else {
        users.forEach(user => {
            let userOption = {...imageOptions};
            if (userOption.format === "gif" && !user.avatar.startsWith("a_")) {
                userOption.format = "png";
            }
            let messageData = sendEmbed(client, message, user, userOption);
            //client.util.
        });
    }
}

async function sendEmbed(client, message, user, imageOptions) {
    let embed = new Discord.MessageEmbed;
    let avatarUrl = user.avatarURL(imageOptions) ?? user.defaultAvatarURL;
    embed.setTitle(`${user.tag} ${client.lang.avatar.commandsDefaults.avatar}`);
    embed.setDescription(`[[LINK]](${avatarUrl})`);
    embed.setImage(avatarUrl);
    embed.addField(client.lang.avatar.commandsDefaults.useForMoreInfo, `${client.dbData.guilds.prefix}help avatar`);
    embed.setColor(client.util.randomColor());
    client.util.footerEmbed(client, embed);
    let messageData = await message.channel.send({embeds: [embed]});
    return messageData;
}


// if (message.author.id === client.config.settings.ownerid) {
//     let reportEmbed = new Discord.MessageEmbed;
// reportEmbed.setTitle(user.tag + " avatar");
// reportEmbed.setDescription(`\`${user.avatarURL({format: img.format, dynamic: img.dynamic, size: img.size})}\``);
// reportEmbed.setThumbnail(user.avatarURL(user.avatarURL({
//     format: img.format,
//     dynamic: img.dynamic,
//     size: img.size
// })));
// reportEmbed.setColor('#ff0000');
// reportEmbed.addField("Server ID", message.guild + " (" + message.guild.id + ")");
// reportEmbed.addField("Channel ID", message.channel + " (" + message.channel.id + ")");
// reportEmbed.addField("Message ID", message.id);
// reportEmbed.addField("Message Created", message.createdAt);
// reportEmbed.addField("Message Owner", message.author.tag + " (" + message.author.id + ")");
// reportEmbed.setTimestamp();

// let whook = new Discord.WebhookClient(client.config.webhooks.image.split("/")[5], client.config.webhooks.image.split("/")[6]);
// let messageData = await message.channel.send(embed)
// reportEmbed.addField("Bot Message Link", "https://discordapp.com/channels/" + message.guild.id + "/" + message.channel.id + "/" + messageData.id);
//
// whook.send(reportEmbed)
// } else {