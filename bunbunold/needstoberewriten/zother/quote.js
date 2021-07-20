let Discord = require("discord.js");

module.exports.info = {
    name: "quote",
    aliases: ["qt"],
    example: "`#PREFIX##COMMAND# <link>` or `#PREFIX##COMMAND# <messageid> <channelid> <serverid>`",
    info: "Quotes message. The best is just using message link. If using link you need to add `--full` at the end to give full info about the quoted message WARNING! Bot can't quote message from server that this bot isn't on",
    tags: ["quote", "message", "other"]
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname),message)) return;
    let mc = message.channel;
    let mcon = args[0];
    let i = Math.floor(Math.random() * (client.config.c.length - 1) + 1);
    let ce = client.config.c[i];
    if (!args[0]) {
        message.reply(`Error`);
        return;
    }
    let c = new Discord.MessageEmbed();
    let img;
    c.setTitle("Quote");
    c.setColor(ce);
    if (client.config.settings.subowners.length==0) {
        c.setFooter("© "+client.users.cache.get(client.config.settings.ownerid).username, client.users.cache.get(client.config.settings.ownerid).avatarURL());
    } else {
        let owners = client.users.cache.get(client.config.settings.ownerid).username
        client.config.settings.subowners.forEach(sub => {
            owners+=` & ${client.users.cache.get(sub).username}`;
        });
        c.setFooter("© "+owners, client.user.avatarURL());
    }
    c.setTimestamp();
    try {
        if (args[2] && args[1] && args[1] != "-f" && args[1] != "--full") {
            if (client.guilds.cache.get(args[2]).members.cache.get(message.author.id) == undefined) return message.channel.send("You are not on this server");
            client.guilds.cache.get(args[2]).channels.cache.get(args[1]).messages.fetch(args[0]).then(message => {
                let a = message.author;
                if (message.attachments.array()[0] != undefined) img = message.attachments.array()[0].url
                if (!img && !message.content) {
                    mc.send(`Message doesn't have content`);
                    return;
                }
                if (message.content == null) {
                    message.content = "";
                }
                c.setImage(img);
                c.setDescription("[[Message Link]](https://discordapp.com/channels/" + message.guild.id + "/" + message.channel.id + "/" + args[0] + ")");
                c.addField("Message Created", message.createdAt);
                c.addField("Server (id:`" + message.guild.id + "`)", message.guild.name);
                c.addField("Channel (id:`" + message.channel.id + "`)", message.channel.name);
                c.addField("Message (id:`" + args[0] + "`)", 'sent by ' + a.tag);
                if (message.content) {
                    c.addField('Message:', message.content);
                } else {
                    c.addField("ONLY IMAGE", "[[Image Link]](" + img + ")");
                }
                mc.send(c)
            })
        } else if (!args[2] && args[1] && args[1] != "-f" && args[1] != "--full") {
            client.guilds.cache.get(message.guild.id).channels.cache.get(args[1]).messages.fetch(args[0]).then(message => {
                let a = message.author;
                if (message.attachments.array()[0] != undefined) img = message.attachments.array()[0].url
                if (!img && !message.content) {
                    mc.send(`Message doesn't have content`);
                    return;
                }
                if (message.content == null) {
                    message.content = "";
                }
                c.setImage(img);
                c.setDescription("[[Message Link]](https://discordapp.com/channels/" + message.guild.id + "/" + message.channel.id + "/" + args[0] + ")");
                c.addField("Message Created", message.createdAt);
                c.addField("Server (id:`" + message.guild.id + "`)", message.guild.name);
                c.addField("Channel (id:`" + message.channel.id + "`)", message.channel.name);
                c.addField("Message (id:`" + args[0] + "`)", 'sent by ' + a.tag);
                if (message.content) {
                    c.addField('Message:', message.content);
                } else {
                    c.addField("ONLY IMAGE", "[[Image Link]](" + img + ")");
                }
                mc.send(c)
            })
        } else if (!args[2] && !args[1] && !(args[0].startsWith("https://"))) {
            client.guilds.cache.get(message.guild.id).channels.cache.get(message.channel.id).messages.fetch(args[0]).then(message => {
                let a = message.author;
                if (message.attachments.array()[0] != undefined) img = message.attachments.array()[0].url
                if (!img && !message.content) {
                    mc.send(`Message doesn't have content`);
                    return;
                }
                if (message.content == null) {
                    message.content = "";
                }
                c.setImage(img);
                c.setDescription("[[Message Link]](https://discordapp.com/channels/" + message.guild.id + "/" + message.channel.id + "/" + args[0] + ")");
                c.addField("Message Created", message.createdAt);
                c.addField("Server (id:`" + message.guild.id + "`)", message.guild.name);
                c.addField("Channel (id:`" + message.channel.id + "`)", message.channel.name);
                c.addField("Message (id:`" + args[0] + "`)", 'sent by ' + a.tag);
                if (message.content) {
                    c.addField('Message:', message.content);
                } else {
                    c.addField("ONLY IMAGE", "[[Image Link]](" + img + ")");
                }
                mc.send(c)
            })
        } else if (args[0].startsWith("https://")) {
            let link = mcon.split("/");
            if (client.guilds.cache.get(link[4]).members.cache.get(message.author.id) == undefined) return message.channel.send("You are not on this server");
            client.guilds.cache.get(link[4]).channels.cache.get(link[5]).messages.fetch(link[6]).then(message => {
                let a = message.author;
                if (message.attachments.array()[0] != undefined) img = message.attachments.array()[0].url
                if (!img && !message.content) {
                    mc.send(`Message doesn't have content`);
                    return;
                }
                c.setImage(img);
                if (args[1] == "-f" || args[1] == "--full") {
                    c.setDescription("[[Message Link]](" + args[0] + ")");
                    c.addField("Message Created", message.createdAt);
                    c.addField("Server (id:`" + message.guild.id + "`)", message.guild.name);
                    c.addField("Channel (id:`" + message.channel.id + "`)", message.channel.name);
                    c.addField("Message (id:`" + link[6] + "`)", 'sent by ' + a.tag);
                    if (message.content) {
                        c.addField('Message:', message.content);
                    } else {
                        c.addField("ONLY IMAGE", "[[Image Link]](" + img + ")");
                    }
                } else {
                    c.addField("Sent by "+a.tag, "[[Message Link]](" + args[0] + ")");
                    c.setFooter("To display full info use `--full` at the end")
                    if (message.content) {
                        c.setDescription(message.content);
                    } else {
                        c.addField("ONLY IMAGE", "[[Image Link]](" + img + ")");
                    }
                }
                mc.send(c)
            })
        } else {
            message.channel.send(`Can't find message`)
        }

    } catch (e) {
        message.channel.send(`Error`)
        console.log(e)
    }

}