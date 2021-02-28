let Discord = require("discord.js");

module.exports.info = {
    name: "warn",
    example: "`#PREFIX##COMMAND#`",
    info: "info",
    tags: ["test"]
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname),message)) return;
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    let user = await client.util.searchUser(message, args[0]);
    if (user.id == message.author.id) return;
    let warn = await client.db.get("guilds", message.guild.id, "warn");
    if (!warn.enabled) {
        return message.channel.send(`Warn is disabled`);
    }
    if (!warn.voteLimit) {
        return message.channel.send(`Vote warn is disabled`);
    }
    if (warn.voteUsers[user.id] && warn.voteUsers[user.id].includes(message.author.id)) return message.channel.send(`You have already voted`);
    if (!warn.voteUsers[user.id] || warn.voteUsers[user.id].length == 0) {
        warn.voteUsers[user.id] = [message.author.id];
    } else {
        warn.voteUsers[user.id].push(message.author.id);
    }
    let repe = setTimeout(async () => {
        warn.voteUsers[user.id] = [];
        await client.db.update('guilds', message.guild.id, 'warn', warn);
        if (!message.guild.members.cache.get(user.id)) {
            return;
        }
        message.channel.send(`Votes to give warn to ${user.tag} have been reseted`)
        clearTimeout(repe);
    }, 120000);
    if (warn.voteUsers[user.id].length >= warn.voteLimit) {
        warn.voteUsers[user.id] = [];
        warn.users[user.id] = !warn.users[user.id] ? 1 : warn.users[user.id]++;
        if (warn.users[user.id]>=warn.limit) {
            warn.users[user.id] = 0;
            message.channel.send(`${user.tag} got kicked.`);
            message.guild.member(user.id).kick();
        } else {
            message.channel.send(`${user.tag} got warn from votes`);
        }
        clearTimeout(repe);
    } else {
        let prefix = await client.db.get("guilds", message.guild.id, "prefix");
        message.channel.send(`**${warn.voteUsers[user.id].length}** user${warn.voteUsers[user.id].length>1?'s':''} voted to give warn to ${user.tag}. **${warn.voteLimit-warn.voteUsers[user.id].length}** more user${warn.voteLimit-warn.voteUsers[user.id].length>1?'s':''} needs to send \`${prefix}warn ${user.id}\` to give warn this user.\nVotes reset in 2 minutes`)
    }
    await client.db.update('guilds', message.guild.id, 'warn', warn);
}