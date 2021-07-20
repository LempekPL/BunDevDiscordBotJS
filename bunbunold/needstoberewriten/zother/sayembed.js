let Discord = require("discord.js");

module.exports.info = {
  name: "sayembed",
  aliases: ["say"],
  example: "`#PREFIX##COMMAND# <text>`",
  info: "Says what you said, but in embed",
  tags: ["embed", "say", "send", "message", "other"]
}

module.exports.run = async (client, message, args) => {
  if (await client.util.blockCheck(client.util.codename(__dirname), message)) return;
  let i = Math.floor(Math.random() * client.config.c.length);
  let ce = client.config.c[i];
  let saye = args.join(" ");
  message.delete().catch();
  if (!args[0]) {
    let sayembeda = new Discord.MessageEmbed();
    sayembeda.setTitle(message.author.tag + ` said:`);
    sayembeda.setColor(ce);
    sayembeda.setDescription(`nothing`);
    if (client.config.settings.subowners.length == 0) {
      sayembeda.setFooter("© " + client.users.cache.get(client.config.settings.ownerid).username, client.users.cache.get(client.config.settings.ownerid).avatarURL());
    } else {
      let owners = client.users.cache.get(client.config.settings.ownerid).username
      client.config.settings.subowners.forEach(sub => {
        owners += ` & ${client.users.cache.get(sub).username}`;
      });
      sayembeda.setFooter("© " + owners, client.user.avatarURL());
    }
    sayembeda.setTimestamp();
    message.channel.send(sayembeda);
    return;
  }
  let sayembe = new Discord.MessageEmbed();
  sayembe.setTitle(message.author.tag + ` said:`);
  sayembe.setColor(ce);
  sayembe.setDescription(saye);
  if (client.config.settings.subowners.length == 0) {
    sayembe.setFooter("© " + client.users.cache.get(client.config.settings.ownerid).username, client.users.cache.get(client.config.settings.ownerid).avatarURL());
  } else {
    let owners = client.users.cache.get(client.config.settings.ownerid).username
    client.config.settings.subowners.forEach(sub => {
      owners += ` & ${client.users.cache.get(sub).username}`;
    });
    sayembe.setFooter("© " + owners, client.user.avatarURL());
  }
  sayembe.setTimestamp();
  message.channel.send(sayembe);


}