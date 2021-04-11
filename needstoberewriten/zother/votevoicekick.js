let Discord = require("discord.js");

module.exports.info = {
    name: "votevoicekick",
    aliases: ["vvk"],
    example: "`#PREFIX##COMMAND# <userid/mention/username>`",
    info: "info",
    tags: ["test"]
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname), message)) return;
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    let user = await client.util.searchUser(message, args[0]);
    if (user.id == message.author.id) return;
    let voteVK = await client.db.get("guilds", message.guild.id, "voteVoiceKick");
    if (!voteVK.limit) {
        return message.channel.send(`Vote Voice Kick is disabled`);
    }
    if (!message.guild.members.cache.get(user.id).voice.channel) return message.channel.send(`User isn't in voice channel`);
    if (voteVK.users[user.id] && voteVK.users[user.id].includes(message.author.id)) return message.channel.send(`You have already voted`);
    if (!voteVK.users[user.id] || voteVK.users[user.id].length == 0) {
        voteVK.users[user.id] = [message.author.id];
    } else {
        voteVK.users[user.id].push(message.author.id);
    }
    let repe = setTimeout(async () => {
        voteVK.users[user.id] = [];
        await client.db.update('guilds', message.guild.id, 'voteVoiceKick', voteVK);
        if (!message.guild.members.cache.get(user.id).voice.channel) {
            return;
        }
        message.channel.send(`Votes to kick ${user.tag} have been reseted`)
        clearTimeout(repe);
    }, 120000);
    if (voteVK.users[user.id].length >= voteVK.limit) {
        voteVK.users[user.id] = [];
        message.guild.member(user.id).voice.kick();
        message.channel.send(`${user.tag} voicekicked`);
        clearTimeout(repe);
    } else {
        let prefix = await client.db.get("guilds", message.guild.id, "prefix");
        message.channel.send(`**${voteVK.users[user.id].length}** user${voteVK.users[user.id].length>1?'s':''} voted to kick ${user.tag} from voice channel. **${voteVK.limit-voteVK.users[user.id].length}** more user${voteVK.limit-voteVK.users[user.id].length>1?'s':''} needs to send \`${prefix}votevoicekick ${user.id}\` to kick this user.\nVotes reset in 2 minutes`)
    }
    await client.db.update('guilds', message.guild.id, 'voteVoiceKick', voteVK);
}