const Discord = require("discord.js");
const os = require("os");
const vers = require("../../../package.json").version;

module.exports.info = {
    name: "botinfo",
    tags: ["bot", "info", "botinfo", "basic"]
}

module.exports.run = async (client, message, args) => {
    let pingMessage = await message.channel.send(`Botinfo PingCheck`);
    let embed = new Discord.MessageEmbed();
    embed.setColor(client.util.randomColor());
    embed.setTitle(`${client.user.tag}`);

    const systemUptime = ((Date.now() - os.uptime*1000)/1000).toFixed(0);
    const botUptime = ((Date.now() - client.uptime)/1000).toFixed(0);
    const botCreated = (client.user.createdAt/1000).toFixed(0);

    embed.setThumbnail(client.user.avatarURL());
    embed.addField(`Users`, `${client.users.cache.size}`, true);
    embed.addField(`Servers`, `${client.guilds.cache.size}`, true);
    embed.addField(`Commands send`, `${client.dbData.bot.commands}`, true);
    embed.addField(`OS`, os.type(), true);
    embed.addField(`Platform`, os.platform(), true);
    embed.addField(`Overall usage`, Math.round((Number(os.totalmem()) - Number(os.freemem())) / 1024 / 1024) + "/" + Math.round(Number(os.totalmem()) / 1024 / 1024) + " megabytes", true);
    embed.addField(`CPU`, os.cpus()[0].model);
    embed.addField(`Node version`, process.version, true);
    embed.addField(`Bot version`, `v${require("../../../package.json").version}`, true);
    embed.addField(`Bot owners`, client.util.ownerString(client));
    embed.addField("Ping", `${pingMessage.createdTimestamp - message.createdTimestamp}`, true);
    embed.addField("Gateway (API)", `${Math.floor(client.ws.ping)}`, true);
    embed.addField("\u200b", "\u200b", true);
    embed.addField(`System uptime`, `<t:${systemUptime}> \n(<t:${systemUptime}:R>)`, true);
    embed.addField(`Bot uptime`, `<t:${botUptime}> \n(<t:${botUptime}:R>)`, true);
    embed.addField(`Created`, `<t:${botCreated}> (<t:${botCreated}:R>)`);
    client.util.footerEmbed(client, embed);
    await pingMessage.edit({content: "\u200b", embeds: [embed]});
}