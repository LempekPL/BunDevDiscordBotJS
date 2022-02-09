let db = require("../../../util/db.js");

module.exports = async (member) => {
    let conn = await db.Conn().connect();

    let welcome = await conn.getKey("guilds", member.guild.id, "welcome")
    if (welcome === undefined || !welcome) return;
    if (!welcome.enabled || welcome.msg === "" || welcome.channel === "") return;
    let channel = await member.guild.channels.cache.get(welcome.channel);
    if (channel === undefined) return;
    let msg = welcome.msg.replace(new RegExp("#USER#", "g"), member.user.username).replace(new RegExp("#GUILD#", "g"), member.guild.name).replace(new RegExp("#MENTION#", "g"), `<@${member.user.id}>`).replace(new RegExp("#TAG#", "g"), member.user.discriminator).replace(new RegExp("#MEMBERCOUNT#", "g"), member.guild.memberCount).replace(new RegExp("#USERCOUNT#", "g"), member.guild.members.cache.filter(m => !m.user.bot).size);
    await channel.send(msg);

    let autorole = await conn.getKey("guilds", member.guild.id, "autorole");
    if (autorole === undefined || autorole == null || !autorole) return;
    if (!autorole.enabled || autorole.role === "") return;
    let rola = await member.guild.roles.cache.get(autorole.role);
    if (rola === undefined) return;
    try {
        await member.roles.add(rola);
    } catch (error) {
        console.log(error);
    }

    await conn.close();
}