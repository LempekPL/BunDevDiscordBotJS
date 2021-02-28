let Discord = require("discord.js");

module.exports.info = {
    name: "userinfo",
    aliases: ["ui", "user", "uinfo"],
    example: "`#PREFIX##COMMAND# <userid/mention/username>`",
    info: "Shows information about user",
    tags: ["user", "info", "userinfo", "basic"]
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname),message)) return;
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    let gra = `The user isn't playing anything.`;
    client.util.searchUser(message, args[0]).then(async member => {
        let memberb = await message.guild.member(member);
        let pseudo = member.nickname;
        try {
            gra = member.presence.game.name;
        } catch (err) {}

        if (pseudo == null) {
            pseudo = member.username;
        }

        let ucreated = client.util.dateFull(Date.now() - new Date(member.createdAt));
        let ujoined = client.util.dateFull(Date.now() - new Date(memberb.joinedAt));
        let dformat = client.util.dateFormat(member.createdAt);
        let dformat2 = client.util.dateFormat(memberb.joinedAt);

        let emo;
        let emoja = member.presence.status;
        if (emoja == "online") {
            emo = "<:onlinediscord:620240031553945634>";
        } else if (emoja == "idle") {
            emo = "<:idlediscord:620240031486967827>";
        } else if (emoja == "dnd") {
            emo = "<:dnddiscord:620240031067406357>";
        } else {
            emo = "<:invisiblediscord:620240031461802004>";
        }

        let relation = "";
        if (client.guilds.cache.get(client.config.settings.supportServer).member(member)) {
            relation = "Known user";
            if (client.guilds.cache.get(client.config.settings.supportServer).members.cache.get(member.id).roles.cache.has(client.config.settings.betaroleid)) {
                relation = "Beta Tester";
            }
            no = 0;
            client.config.settings.subowners.forEach(sub => {
                if (member.id == sub) {
                    relation = "Co-owner";
                }
            });
            if (client.config.settings.subowners.length > 0 && member.id == client.config.settings.ownerid) {
                relation = "Co-owner";
            } else if (member.id == client.config.settings.ownerid) {
                relation = "Owner";
            }
        } else {
            relation = "None";
        }

        let fav = await client.db.get("users", member.id, "favCommands");
        let com = "";
        let coun = 0;
        let total = 0;
        for (let comm in fav) {
            if (fav[comm] > coun) {
                com = comm;
                coun = fav[comm];
            }
            total += fav[comm];
        }
        if (!fav || Object.keys(fav).length == 0) {
            com = 'none';
        }

        let embed = new Discord.MessageEmbed;
        embed.setColor(ce)
        embed.setAuthor(member.tag, member.avatarURL);
        embed.addField("Username:", member.username, true);
        embed.addField("Tag:", "#" + member.discriminator, true);
        embed.addField(`Nickname:`, pseudo, true);
        embed.addField(`Game:`, "`" + gra + "`", true);
        embed.addField("ID:", member.id, true);
        embed.addField("Status:", emo + " " + member.presence.status, true);
        embed.addField("Relation:", relation, true);
        embed.addField("Commands sent:", total, true);
        embed.addField("Favourite command:", com, true);
        embed.addField(`Created at`, dformat + `\n(Created: \`${ucreated.years} ${ucreated.ty}\` \`${ucreated.days} ${ucreated.td}\` \`${ucreated.hours} ${ucreated.th}\` \`${ucreated.mins} ${ucreated.tm}\` \`${ucreated.secs} ${ucreated.ts}\` ago)`);
        embed.addField(`Joined at`, dformat2 + `\n(Joined: \`${ujoined.years} ${ujoined.ty}\` \`${ujoined.days} ${ujoined.td}\` \`${ujoined.hours} ${ujoined.th}\` \`${ujoined.mins} ${ujoined.tm}\` \`${ujoined.secs} ${ujoined.ts}\` ago)`);
        embed.setThumbnail(member.avatarURL);
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
    }).catch((err) => {
        client.emit("uisae", "B04", message, "");
        console.log(err);
    });
}