let Discord = require("discord.js");
let cooldown = new Set();

module.exports.info = {
    name: "blurple",
    example: "`#PREFIX##COMMAND# <userid/mention/username/link (that starts with https://)>`",
    info: "Gives changed profile picture",
    tags: ["api", "badosz", "picture", "fun", "avatar"]
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname),message)) return;
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    let whook = new Discord.WebhookClient(client.config.webhooks.image.split("/")[5], client.config.webhooks.image.split("/")[6]);
    if (cooldown.has(message.author.id)) {
        message.channel.send(`Wait 5 seconds`);
    } else {
        let limk = "";
        let user = await client.util.searchUser(message, args[0]);
        let fal = !args[0] ? false : true;
        if (fal && args[0].startsWith("https://")) {
            limk = args[0];
        } else {
            limk = user.avatarURL({
                format: 'png',
                dynamic: false,
                size: 2048
            });
        }
        let response = await client.util.requester(`https://obrazium.com/v1/blurple?url=${limk}`, client.config.tokens.badosz, "buffer");
        let embed = new Discord.MessageEmbed();
        embed.attachFiles([{
            attachment: response,
            name: "blurple.png"
        }]);
        embed.setImage("attachment://blurple.png");
        embed.setColor(ce);
        embed.setDescription(`${user.tag} (${user.id})`);
        embed.setFooter("obrazium.com");
        let ema = new Discord.MessageEmbed;
        ema.setTitle(user.tag + " avatar");
        ema.setDescription("[[LINK]](" + limk + ") \n\n `" + limk + "`");
        ema.setThumbnail(limk);
        ema.setColor('#ff0000');
        ema.addField("Server ID", message.guild + " (" + message.guild.id + ")");
        ema.addField("Channel ID", message.channel + " (" + message.channel.id + ")");
        ema.addField("Message ID", message.id);
        ema.addField("Message Created", message.createdAt);
        ema.addField("Owner", message.author.tag + " (" + message.author.id + ")");
        ema.setFooter("© " + client.users.cache.get(client.config.settings.ownerid).username, client.users.cache.get(client.config.settings.ownerid).avatarURL());
        ema.setTimestamp();
        yes(embed, ema)
        cooldown.add(message.author.id);
        setTimeout(() => {
            cooldown.delete(message.author.id);
        }, 5000);
    }

    async function yes(embed, ema) {
        spec = await message.channel.send(embed)
        ema.addField("Bot Message Link", "https://discordapp.com/channels/" + message.guild.id + "/" + message.channel.id + "/" + spec.id);
        if (message.author.id != client.config.settings.ownerid) {
            whook.send(ema);
        }
    }
}