const Discord = require("discord.js");

module.exports.info = {
    name: "userinfo",
    tags: ["user", "info", "userinfo", "basic"]
}

module.exports.run = async (client, message, args) => {
    let user = await client.util.searchUser(client, message, args[0], {
        returnAuthor: true,
        ignoreBots: false,
        allowChoose: true
    });
    if (!user) return;
    let member = await message.guild.members.cache.get(user.id);
    if (member.deleted) return;

    const CreatedAt = (user.createdTimestamp / 1000).toFixed(0);
    const JoinedAt = (member.joinedTimestamp / 1000).toFixed(0);
    const RelationWithBot = getRelation(client, user);
    const Status = getStatus(client, member);
    let Available = "nowhere";
    if (member.presence && member.presence?.status !== "offline") {
        Available = Object.keys(member.presence?.clientStatus).join(", ").replace("web", client.lang.web).replace("desktop", client.lang.desktop).replace("mobile", client.lang.mobile)
    }
    let userData;
    if (!user.bot) {
        userData = await client.dbConn.get("users", user.id);
    }
    const [FavouriteCommand, CommandsSent] = getCommandDatas(client, userData?.favouriteCommands);

    let embed = new Discord.MessageEmbed();
    embed.setColor(client.util.randomColor());
    embed.setTitle(user.tag);
    embed.addField("Username", user.username, true);
    embed.addField("Tag", "#" + user.discriminator, true);
    if (member.nickname) {
        embed.addField(`Nickname`, member.nickname, true);
    } else {
        embed.addField("\u200b", "\u200b", true);
    }
    embed.addField("User Id", `${member.id}`, true);
    embed.addField("Is a bot?", `${user.bot ? client.lang.yes : client.lang.no}`, true);
    embed.addField("Relation", RelationWithBot, true);
    if (FavouriteCommand) {
        embed.addField("Favourite command", FavouriteCommand, true);
        embed.addField("Commands sent", `${CommandsSent}`, true);
        embed.addField("\u200b", "\u200b", true);
    }
    embed.addField("Status", Status, true)
    embed.addField("Available in", Available, true);
    if (member.presence?.status) {
        let activities = "";
        member.presence?.activities?.forEach(activity => {
            const TimestampFixed = (activity.createdTimestamp / 1000).toFixed(0);
            const ActivityName = activity.type === "CUSTOM" ? activity.state : activity.name;
            activities += activities === "" ? `${client.lang[activity.type]} **${ActivityName}** ${client.lang.since} <t:${TimestampFixed}:d><t:${TimestampFixed}:T>` : `\n${client.lang[activity.type]} **${ActivityName}** ${client.lang.since} <t:${TimestampFixed}:d><t:${TimestampFixed}:T>`
        });
        if (activities) {
            embed.addField("Activities", activities);
        }
    }
    embed.addField(`Joined at`, `<t:${JoinedAt}> (<t:${JoinedAt}:R>)`);
    embed.addField(`Created at`, `<t:${CreatedAt}> (<t:${CreatedAt}:R>)`);
    embed.setThumbnail(user.avatarURL());
    client.util.footerEmbed(client, embed);
    message.channel.send({embeds: [embed]});
}

function getRelation(client, user) {
    let mainServer = client.guilds.cache.get(client.config.settings.supportServerId);
    if (user.id === client.config.settings.ownerId) return client.lang.owner;
    if (client.config.settings.subOwnersIds.includes(user.id)) return client.lang.coowner;
    if (mainServer.members.cache.get(user.id)?.roles.cache.has(client.config.settings.betaRoleId)) return client.lang.betaTester;
    if (mainServer.members.cache.get(user.id)?.roles.cache.has(client.config.settings.translatorRoleId)) return client.lang.translator;
    if (mainServer.members.cache.get(user.id)) return client.lang.knownUser;
    return client.lang.none;
}

function getStatus(client, member) {
    if (member.presence?.status === "online") return `<:onlineStatus:876900150025531442> ${client.lang.online}`;
    if (member.presence?.status === "idle") return `<:idleStatus:876900149593505813> ${client.lang.idle}`;
    if (member.presence?.status === "dnd") return `<:dndStatus:876900149656420383> ${client.lang.dnd}`;
    return `<:invisibleStatus:876900150117802014> ${client.lang.invisible}`;
}

function getCommandDatas(client, favCommands) {
    let max = -Infinity;
    let favCom;
    let total = 0;
    for (const Command in favCommands) {
        if (favCommands[Command] > max) {
            max = favCommands[Command];
            favCom = Command;
        }
        total += favCommands[Command];
    }
    return total === 0 ? [false, false] : [`[${max}] ${favCom}`, total];
}