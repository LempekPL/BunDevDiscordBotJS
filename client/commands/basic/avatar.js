const Discord = require("discord.js");
const Allowed = {
    format: ["webp", "png", "jpg", "jpeg", "gif"],
    size: [16, 32, 64, 128, 256, 512, 1024, 2048, 4096]
}

module.exports.info = {
    name: "avatar",
    tags: ["picture", "avatar", "display", "basic"]
}

module.exports.run = async (client, message, args) => {
    let imageOptions = {size: 2048}
    let userSelect = null;
    if (args.length === 1) {
        userSelect = args[0];
    } else if (args.length > 1) {
        for (let i = 0; i <= 4 && args[i]?.includes("-"); i += 2) {
            let dataType = args[i].split("-");
            switch (dataType[1]) {
                case client.langCom.avatar.args.user:
                    if (i === 4 && args.length > 5) {
                        userSelect = [...args]
                        userSelect.splice(0, 5)
                        userSelect.splice(5)
                        break;
                    }
                    userSelect = args[i + 1];
                    break;
                case client.langCom.avatar.args.format:
                    if (Allowed.format.includes(args[i + 1])) {
                        imageOptions.format = args[i + 1];
                    }
                    break;
                case client.langCom.avatar.args.size:
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
        let avatarUrl = user.avatarURL(imageOptions) ?? user.defaultAvatarURL;
        let messageData = await sendEmbed(client, message, user, avatarUrl);
        await client.util.logger("command", process.env.WEBHOOK_IMAGE_COMMANDS, {
            client,
            user,
            message,
            messageData,
            title: `${user.tag} used \`${module.exports.info.name}\` command`,
            description: `\`${avatarUrl}\``,
            thumbnail: avatarUrl
        });
    } else {
        for (const user1 of users) {
            let userOption = {...imageOptions};
            if (userOption.format === "gif" && !user1.avatar.startsWith("a_")) {
                userOption.format = "png";
            }
            let avatarUrl = user1.avatarURL(userOption) ?? user1.defaultAvatarURL;
            let messageData = await sendEmbed(client, message, user1, avatarUrl);
            await client.util.logger("command", process.env.WEBHOOK_IMAGE_COMMANDS, {
                client,
                user: user1,
                message,
                messageData,
                title: `${user1.tag} used \`${module.exports.info.name}\` command`,
                description: `\`${avatarUrl}\``,
                thumbnail: avatarUrl
            });
        }
    }
}

async function sendEmbed(client, message, user, avatarUrl) {
    let embed = new Discord.MessageEmbed;
    embed.setTitle(`${user.tag} ${client.lang.avatar}`);
    embed.setDescription(`[[LINK]](${avatarUrl})`);
    embed.setImage(avatarUrl);
    embed.addField(client.lang.useForMoreInfo, `${client.dbData.guilds.prefix}help avatar`);
    embed.setColor(client.util.randomColor());
    client.util.footerEmbed(client, embed);
    return await message.channel.send({embeds: [embed]});
}