let Discord = require("discord.js");
let os = require("os");
let vers = require("../../../package.json").version;

module.exports.info = {
    name: "botinfo",
    lang: {
        en: {
            main: "botinfo",
            aliases: ["bi", "bot", "binfo"]
        },
        pl: {
            main: "infobot",
            aliases: ["informacjabota", "informacjaobocie"]
        }
    },
    tags: ["bot", "info", "botinfo", "basic"]
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client, __dirname, message)) return;
    let msg = await message.channel.send(`Botinfo`);
    let embed = new Discord.MessageEmbed();
    embed.setColor(client.util.randomColorConfig(client));
    embed.setTitle("Bot Info:");

    let sysuptime = client.util.dateFull(os.uptime * 1000);
    let botuptime = client.util.dateFull(client.uptime);
    let botcreated = client.util.dateFull(Date.now() - client.user.createdAt);
    let dformat = client.util.dateFormat(client.user.createdAt);

    embed.setThumbnail(client.user.avatarURL());
    embed.addField(`Users:`, client.users.cache.size, true);
    embed.addField(`Channels:`, client.channels.cache.size, true);
    embed.addField(`Servers:`, client.guilds.cache.size, true);
    embed.addField(`OS:`, os.type(), true);
    embed.addField(`Platform:`, os.platform(), true);
    embed.addField(`Overall usage:`, Math.round((Number(os.totalmem()) - Number(os.freemem())) / 1024 / 1024) + "/" + Math.round(Number(os.totalmem()) / 1024 / 1024) + " megabytes", true);
    embed.addField(`CPU:`, os.cpus()[0].model);
    embed.addField(`Node version`, process.version, true);
    embed.addField(`Bot version`, "v" + vers, true);
    embed.addField(`Bot owner:`, "`" + client.users.cache.get(client.config.settings.ownerid).tag + "` <@" + client.config.settings.ownerid + ">");
    embed.addField("Ping", msg.createdTimestamp - message.createdTimestamp, true);
    embed.addField("Gateway (API)", Math.floor(client.ws.ping), true);
    embed.addField('\u200b', '\u200b', true);
    embed.addField(`System uptime`, `**${sysuptime.years}y ${sysuptime.days}d ${sysuptime.hours}h ${sysuptime.mins}m ${sysuptime.secs}s**`, true);
    embed.addField(`Bot uptime`, `**${botuptime.years}y ${botuptime.days}d ${botuptime.hours}h ${botuptime.mins}m ${botuptime.secs}s**`, true);
    embed.addField(`Created`, dformat + `\n\`${botcreated.years} ${botcreated.ty}\` \`${botcreated.days} ${botcreated.td}\` \`${botcreated.hours} ${botcreated.th}\` \`${botcreated.mins} ${botcreated.tm}\` \`${botcreated.secs} ${botcreated.ts}\` ago`);
    client.util.setFooterOwner(client, embed);
    embed.setTimestamp();
    msg.delete();
    message.channel.send(embed);
}