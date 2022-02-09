let db = require("../../../util/db.js");

module.exports = async (member) => {
    let conn = await db.Conn().connect();

    let goodbye = await conn.getKey("guilds", member.guild.id, "goodbye")
    if (goodbye === undefined || !goodbye) return;
    if (!goodbye.enabled || goodbye.msg === "" || goodbye.channel === "") return;
    let channel = await member.guild.channels.cache.get(goodbye.channel);
    if (channel === undefined) return;
    let msg = goodbye.msg.replace(new RegExp("#USER#", "g"), member.user.username).replace(new RegExp("#GUILD#", "g"), member.guild.name).replace(new RegExp("#MENTION#", "g"), `<@${member.user.id}>`).replace(new RegExp("#TAG#", "g"), member.user.discriminator).replace(new RegExp("#MEMBERCOUNT#", "g"), member.guild.memberCount).replace(new RegExp("#USERCOUNT#", "g"), member.guild.members.cache.filter(m => !m.user.bot).size);
    await channel.send(msg);

    await conn.close();
}