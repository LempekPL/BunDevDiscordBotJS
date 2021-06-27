let db = require("../../../util/db.js");

module.exports = async (member) => {
    await db.get("guilds", member.guild.id, "welcome").then(welcome => {
        if (welcome === undefined || !welcome) return;
        if (!welcome.enabled || welcome.msg === "" || welcome.channel === "") return;
        let channel = member.guild.channels.cache.get(welcome.channel);
        if (channel === undefined) return;
        let msg = welcome.msg.replace(new RegExp("#USER#", "g"), member.user.username).replace(new RegExp("#GUILD#", "g"), member.guild.name).replace(new RegExp("#MENTION#", "g"), `<@${member.user.id}>`).replace(new RegExp("#TAG#", "g"), member.user.discriminator).replace(new RegExp("#MEMBERCOUNT#", "g"), member.guild.memberCount).replace(new RegExp("#USERCOUNT#", "g"), member.guild.members.cache.filter(m => !m.user.bot).size);
        channel.send(msg);
    });

    await db.get("guilds", member.guild.id, "autorole").then(autorole => {
        if (autorole === undefined || autorole == null || !autorole) return;
        if (!autorole.enabled || autorole.role === "") return;
        let rola = member.guild.roles.cache.get(autorole.role);
        if (rola === undefined) return;
        try {
            member.roles.add(rola);
        } catch (error) {
            console.log(error);
        }
    });
}