let Discord = require("discord.js");
let Color = require('color');
let colo, hex, rgb, hsl;

module.exports.info = {
    name: "color",
    tags: ["color", "hex", "rgb", "info", "hsl"]
}

module.exports.run = async (client, message, args) => {
    if (args[0] == null) return;
    if (args[0][0] !== "#") return;
    if (/^([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(args[0])) return;
    hex = args[0];
    colo = args[0].replace(new RegExp("#", "g"), "");
    let color = Color(hex);
    rgb = color.rgb().string();
    hsl = color.hsl().string();
    let embed = new Discord.MessageEmbed();
    embed.setTitle("Color");
    embed.setDescription(`**Color:** \nHex: ${hex} \nRGB: ${rgb} \nHSL: ${hsl} \n[[Link]](https://www.color-hex.com/color/${colo})`);
    embed.setColor(hex);
    embed.setThumbnail(`https://www.colorhexa.com/${colo}.png`);
    client.util.footerEmbed(client, embed);
    message.channel.send({embeds: [embed]});
}