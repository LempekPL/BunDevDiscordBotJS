let Discord = require("discord.js");

module.exports.info = {
    name: "remindme",
    example: "`#PREFIX##COMMAND#`",
    info: "info",
    tags: ["test"]
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname),message)) return;
    // this part can be deleted after betatesting
    no = 0;
    client.config.settings.subowners.forEach(sub => {
        if (message.author.id != sub) {
            no++;
        }
    });
    if (!client.guilds.cache.get(client.config.settings.supportServer).members.cache.get(message.author.id) && !client.guilds.cache.get(client.config.settings.supportServer).members.cache.get(message.author.id).roles.cache.has(client.config.settings.betaroleid) && message.author.id != client.config.settings.ownerid && no == client.config.settings.subowners.length) return client.emit("uisae", "U11", message, "");
    // ^
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    message.channel.send("\n**OK**")
    function messageSend() {
        args.shift();
        message.channel.send("\n**REMINDER:**\n" + args.join(" "));
    }
    // setTimeout CRINGE!!111!!!
    //! will fix
    setTimeout(messageSend, args[0]*1000);
}