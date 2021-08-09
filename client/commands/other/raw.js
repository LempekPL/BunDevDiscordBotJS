const Discord = require("discord.js");
const fs = require('fs');

module.exports.info = {
    name: "raw",
    tags: ["dev", "discord"]
}

module.exports.run = async (client, message, args) => {
    let embed = new Discord.MessageEmbed;
    let rawData = {};
    let discordFileName = "file";
    switch (args[0]) {
        case "user":
            if (!args[1]) return client.emit("uisae", "U04", message, "No user id provided");
            if (isNaN(args[1])) return client.emit("uisae", "U04", message, "Wrong user id");
            rawData = client.users.cache.get(args[1]);
            if (!rawData) return client.emit("uisae", "U04", message, "User not found");
            break;

        case "member":
            if (!args[1]) return client.emit("uisae", "U04", message, "No guild member id provided");
            if (isNaN(args[1])) return client.emit("uisae", "U04", message, "Wrong guild member id");
            rawData = message.guild.members.cache.get(args[1]);
            if (!rawData) return client.emit("uisae", "U04", message, "Guild member not found");
            break;

        case "guild":
            if (!args[1]) return client.emit("uisae", "U04", message, "No guild id provided");
            if (isNaN(args[1])) return client.emit("uisae", "U04", message, "Wrong guild id");
            rawData = client.guilds.cache.get(args[1]);
            if (!rawData) return client.emit("uisae", "U04", message, "Guild not found");
            break;

        case "message":
            if (args[1].match(/https:\/\/(|canary\.|ptb\.)discord\.com\/channels\//)) {
                let choppedLink = args[1].split("/");
                rawData = message.guild.channels.cache.get(choppedLink[5]).messages.cache.get(choppedLink[6]);
            } else {
                if (!args[1]) return client.emit("uisae", "U24", message, `No channel id provided. \`${client.dbData.guilds.prefix}raw message <channel id> <message id>\` or \`${client.dbData.guilds.prefix}raw message <message link>\``);
                if (isNaN(args[1])) return client.emit("uisae", "U24", message, "Wrong channel id");
                if (!args[2]) return client.emit("uisae", "U34", message, `No message id provided. \`${client.dbData.guilds.prefix}raw message <channel id> <message id>\` or \`${client.dbData.guilds.prefix}raw message <message link>\``);
                if (isNaN(args[2])) return client.emit("uisae", "U34", message, "Wrong message id");
                rawData = message.guild.channels.cache.get(args[1]).messages.cache.get(args[2]);
            }
            if (!rawData) return client.emit("uisae", "U34", message, "Message not found or it hadn't been cached");
            break;

        case "channel":
            if (!args[1]) return client.emit("uisae", "U24", message, "No channel id provided");
            if (isNaN(args[1])) return client.emit("uisae", "U24", message, "Wrong channel id");
            rawData = message.guild.channels.cache.get(args[1]);
            if (!rawData) return client.emit("uisae", "U24", message, "Channel not found");
            break;

        case "thread":
            if (!args[1]) return client.emit("uisae", "U24", message, `No channel id provided. \`${client.dbData.guilds.prefix}raw thread <channel id> <thread id>\``);
            if (isNaN(args[1])) return client.emit("uisae", "U24", message, "Wrong channel id");
            if (!args[2]) return client.emit("uisae", "U54", message, `No thread id provided. \`${client.dbData.guilds.prefix}raw thread <channel id> <thread id>\``);
            if (isNaN(args[2])) return client.emit("uisae", "U54", message, "Wrong thread id");
            rawData = message.guild.channels.cache.get(args[1]).threads.cache.get(args[2]);
            if (!rawData) return client.emit("uisae", "U54", message, "Thread not found");
            break;

        case "emoji":
            if (!args[1]) return client.emit("uisae", "U44", message, "No emoji id provided");
            if (isNaN(args[1])) return client.emit("uisae", "U44", message, "Wrong emoji id");
            rawData = message.guild.emojis.cache.get(args[1]);
            if (!rawData) return client.emit("uisae", "U44", message, "Emoji not found");
            break;

        default:
            return client.emit("uisae", "U23", message, "Available raw data: `user`, `member`, `guild`, `channel`, `message`, `thread`, `emoji`");
    }
    if (JSON.stringify(rawData, null, '\t').length < 3500) {
        embed.setTitle(`${rawData.id} ${args[0]} raw data`);
        embed.setDescription(`\`\`\`json\n ${JSON.stringify(rawData, null, '\t')}\`\`\``);
        embed.setColor(client.util.randomColor());
        client.util.footerEmbed(client, embed);
        message.channel.send({embeds: [embed]});
    } else {
        await fs.writeFileSync(`tempFile.json`, JSON.stringify(rawData, null, '\t'));
        discordFileName = rawData?.id ?? "file";
        await message.channel.send({
            files: [{
                attachment: `./tempFile.json`,
                name: `${discordFileName}.json`
            }]
        });
        await fs.unlinkSync(`tempFile.json`);
    }
}