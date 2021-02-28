let Discord = require("discord.js");
let Color = require('color');
let colo, hex, rgb, hsl;

module.exports.info = {
    name: "color",
    aliases: ["colour"],
    example: "`#PREFIX##COMMAND# <#hex color>`",
    info: "Shows information about color",
    tags: ["color","hex","rgb","info","hsl","colour"]
}

module.exports.run = async (client, message, args) => {
    if (await client.util.blockCheck(client.util.codename(__dirname),message)) return;
    if (args[0] == null) return client.emit("uisae", "U04", message, "");
    let co = args.join(" ").slice("#");
    let c = args.join(" ");
    if (c[0] != "#") return client.emit("uisae", "U686578", message, "");
    if (/^([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(args[0])) return client.emit("uisae", "U686578", message, "");
    hex = c;
    colo = co.replace(new RegExp("#", "g"), "");
    let color = Color(hex);
    rgb = color.rgb().string();
    hsl = color.hsl().string();
    let kartakoloru = new Discord.MessageEmbed();
    kartakoloru.setTitle("**Color**");
    kartakoloru.setDescription("**Color:**\nHex: " + hex + "\nRGB: " + rgb + "\nHSL: " + hsl + " \n[[Link]](https://www.color-hex.com/color/" + colo + `)`);
    kartakoloru.setColor(hex);
    kartakoloru.setThumbnail("https://www.colorhexa.com/" + colo + ".png");
    if (client.config.settings.subowners.length==0) {
        kartakoloru.setFooter("© "+client.users.cache.get(client.config.settings.ownerid).username, client.users.cache.get(client.config.settings.ownerid).avatarURL());
    } else {
        let owners = client.users.cache.get(client.config.settings.ownerid).username
        client.config.settings.subowners.forEach(sub => {
            owners+=` & ${client.users.cache.get(sub).username}`;
        });
        kartakoloru.setFooter("© "+owners, client.user.avatarURL());
    }
    kartakoloru.setTimestamp();
    message.channel.send(kartakoloru);
}