let Discord = require("discord.js");

module.exports.info = {
    name: "serverinfo",
    aliases: ["si"],
    tags: ["server","serverinfo","info","basic"]
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname),message)) return;
    let guild = message.guild;
    let textChannels = guild.channels.cache.filter(c => c.type === 'text');
    let voiceChannels = guild.channels.cache.filter(c => c.type === 'voice');
    let online = guild.members.cache.filter(m => m.user.presence.status === "online").filter(m => !m.user.bot).size
    let dnd = guild.members.cache.filter(m => m.user.presence.status === "dnd").filter(m => !m.user.bot).size
    let idle = guild.members.cache.filter(m => m.user.presence.status === "idle").filter(m => !m.user.bot).size
    let offline = guild.members.cache.filter(m => m.user.presence.status === "offline").filter(m => !m.user.bot).size
    let bots = guild.members.cache.filter(m => m.user.bot).size
    let icon = guild.iconURL();
    
    let embed = new Discord.MessageEmbed()
    embed.setColor(client.util.randomColorConfig(client));
    embed.setAuthor(`ServerInfo ${guild.name}`, client.user.avatarURL());
    embed.setThumbnail(icon);
    embed.setDescription("");
    embed.addField(`Users [${guild.memberCount}]:`, `<:online:620240031553945634> Online: ${online}\n<:idle:620240031486967827> Idle: ${idle}\n<:dnd:620240031067406357> Do Not Disturb: ${dnd}\n<:invisible:620240031461802004> Offline: ${offline}\n<:bot:620240031545688064> Bots: ${bots}`);
    embed.addField(`Channels [${guild.channels.cache.size}]:`, `<:Vchanneldiscord:620298701075906580> Voice Channels: ${voiceChannels.size}\n<:channeldiscord:620298701113393152> Text Channels: ${textChannels.size}`);
    embed.addField(`Verification:`, message.guild.verificationLevel, true);
    embed.addField(`Region:`, guild.region, true);
    embed.addField(`Role Amount:`, `${message.guild.roles.cache.size}`, true);
    embed.addField(`Owner:`, guild.owner, true);

    let guildcreated = client.util.daten(Date.now() - new Date(message.guild.createdAt));
    let dformat = client.util.dateFormat(message.guild.createdAt);

    embed.addField(`Created: `, dformat + `\n (Created: \`${guildcreated.years} ${guildcreated.ty}\` \`${guildcreated.days} ${guildcreated.td}\` \`${guildcreated.hours} ${guildcreated.th}\` \`${guildcreated.mins} ${guildcreated.tm}\` \`${guildcreated.secs} ${guildcreated.ts}\` ago)`);
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
    message.channel.send(embed);
}