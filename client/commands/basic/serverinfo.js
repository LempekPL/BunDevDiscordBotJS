const Discord = require("discord.js");

module.exports.info = {
    name: "serverinfo",
    tags: ["server", "serverinfo", "info", "basic"]
}

module.exports.run = async (client, message, args) => {
    const guildChan = message.guild.channels.cache;
    const AllChannels = guildChan.filter(chan => chan.type !== "GUILD_CATEGORY").size
    const CategoriesChannels = guildChan.filter(chan => chan.type === "GUILD_CATEGORY").size
    const TextChannels = guildChan.filter(chan => chan.type === "GUILD_TEXT").size;
    const VoiceChannels = guildChan.filter(chan => chan.type === "GUILD_VOICE").size;
    const NewsChannels = guildChan.filter(chan => chan.type === "GUILD_NEWS").size;
    const StageChannels = guildChan.filter(chan => chan.type === "GUILD_STAGE_VOICE").size;
    const ThreadChannels = guildChan.filter(chan => chan.type === "GUILD_PUBLIC_THREAD").size + guildChan.filter(chan => chan.type === "GUILD_PRIVATE_THREAD").size;
    const NonBots = message.guild.members.cache.filter(m => !m.user.bot)
    const Online = NonBots.filter(m => m.presence?.status === "online").size;
    const Dnd = NonBots.filter(m => m.presence?.status === "dnd").size;
    const Idle = NonBots.filter(m => m.presence?.status === "idle").size;
    const Offline = NonBots.size - (Online + Dnd + Idle);
    const Bots = message.guild.members.cache.filter(m => m.user.bot).size;
    const GuildCreated = (message.guild.createdAt / 1000).toFixed(0);

    let embed = new Discord.MessageEmbed()
    embed.setColor(client.util.randomColor());
    embed.setTitle(`${message.guild.name}`);
    embed.setThumbnail(message.guild.iconURL());
    embed.addField(`[${message.guild.memberCount}] users`, `<:onlineStatus:876900150025531442> Online: ${Online}\n<:idleStatus:876900149593505813> Idle: ${Idle}\n<:dndStatus:876900149656420383> Do Not Disturb: ${Dnd}\n<:invisibleStatus:876900150117802014> Offline: ${Offline}\n<:bot:815379078776619070> Bots: ${Bots}`, true);
    embed.addField(`[${AllChannels}] channels with [${CategoriesChannels}] categories`, `<:voiceChannel:876615740260761721> Voice channels: ${VoiceChannels}\n<:textChannel:876615740604686367> Text channels: ${TextChannels}\n<:newsChannel:876615740323680267> News channels: ${NewsChannels}\n<:stageChannel:876615740604686366> Stage channels: ${StageChannels}\n<:threadChannel:876623471877193809> Threads: ${ThreadChannels}`, true);
    embed.addField("\u200b", "\u200b", true);
    embed.addField(`Verification`, message.guild.verificationLevel, true);
    embed.addField(`NSFW level`, message.guild.nsfwLevel, true);
    embed.addField("\u200b", "\u200b", true);
    embed.addField(`Emoji amount`, `${message.guild.emojis.cache.size}`, true);
    embed.addField(`Stickers amount`, `${message.guild.stickers.cache.size}`, true);
    embed.addField("\u200b", "\u200b", true);
    embed.addField(`Role amount`, `${message.guild.roles.cache.size}`, true);
    const OwnerUser = await message.guild.fetchOwner();
    embed.addField(`Owner`, `\`${OwnerUser.user.tag}\``, true);
    embed.addField("\u200b", "\u200b", true);
    embed.addField(`Number of boosts`, `${message.guild.premiumSubscriptionCount}`, true);
    if (message.guild.features.length > 0) {
        embed.addField(`Enabled features`, `\`${message.guild.features.join("`, `")}\``);
    }
    embed.addField(`Created `, `<t:${GuildCreated}> (<t:${GuildCreated}:R>)`);

    client.util.footerEmbed(client, embed);
    message.channel.send({embeds: [embed]});
}