let Discord = require("discord.js");

module.exports.info = {
    name: "warn",
    example: "`#PREFIX##COMMAND#`",
    info: "info",
    tags: ["test"]
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname), message)) return;
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    let user = await client.util.searchUser(message, args[0]);
    let warn = await client.db.get("guilds", message.guild.id, "warn");
    if (!args[0] || !user || user.id == message.author.id) {
        if (!warn || !warn.users) {
            return message.channel.send('No warns')
        }
        let embed = new Discord.MessageEmbed;
        embed.setTitle("Warns");
        embed.setColor(ce);
        for (const usr in warn.users) {
            if (object.hasOwnProperty(usr)) {
                let numb = warn.users[usr];
                users += `${client.users.cache.get(usr).tag}: ${numb}\n`
            }
        }
        embed.setDescription(users);
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
    if (!warn.enabled) {
        return message.channel.send(`Warn is disabled`);
    }
    if (args[1] == '--reset' || args[1] == '-r') {
        warn.users[user.id] = 0;
        message.channel.send(`${user.tag} has been blessed. Reseted warns`);
    } else {
        warn.users[user.id] = !warn.users[user.id] ? 1 : warn.users[user.id]++;
        if (warn.users[user.id]>=warn.limit) {
            warn.users[user.id] = 0;
            message.channel.send(`${user.tag} got kicked. Too many warns`);
            message.guild.member(user.id).kick();
        } else {
            message.channel.send(`${user.tag} got warned. They need ${warn.limit - warn.users[user.id]} more warns to get kicked`);
        }
    }
    await client.db.update('guilds', message.guild.id, 'warn', warn);
}