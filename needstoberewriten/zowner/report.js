let Discord = require("discord.js");

module.exports.info = {
    name: "name",
    example: "`#PREFIX##COMMAND# <problem or suggestion>`",
    info: "info",
    tags: ["test"]
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname),message)) return;
    let i = Math.floor(Math.random() * client.config.c.length);
    let ce = client.config.c[i];
    let whook = new Discord.WebhookClient(client.config.webhooks.reports.split("/")[5], client.config.webhooks.reports.split("/")[6]);
    let embed = new Discord.MessageEmbed();
    embed.setColor(ce);
    embed.setTitle(`Suggestion or report:`);
    embed.setDescription(args.join(" "));
    whook.send(embed);
}