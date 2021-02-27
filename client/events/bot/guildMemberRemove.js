let db = require("../../../util/db.js");

module.exports = async member => {
    await db.get("guilds",member.guild.id,"goodbye").then(goodbye => {
        if(goodbye == undefined || goodbye == null || !goodbye) return;
        if(!goodbye.enabled || goodbye.msg == "" || goodbye.channel == "") return;
        let channel = member.guild.channels.cache.get(goodbye.channel);
        if(channel == undefined) return;
        let msg = goodbye.msg.replace(new RegExp("#USER#", "g"), member.user.username).replace(new RegExp("#GUILD#", "g"), member.guild.name).replace(new RegExp("#MENTION#", "g"), `<@${member.user.id}>`).replace(new RegExp("#TAG#", "g"), member.user.discriminator).replace(new RegExp("#MEMBERCOUNT#", "g"), member.guild.memberCount).replace(new RegExp("#USERCOUNT#", "g"), member.guild.members.cache.filter(m => !m.user.bot).size);
        channel.send(msg);
    });
}