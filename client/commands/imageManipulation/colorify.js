const Discord = require("discord.js");

module.exports.info = {
    name: "colorify",
    tags: ["api","badosz","picture","fun"]
}

module.exports.run = async (client, message, args) => {
    await client.util.obraziumHandler(client, message, module.exports.info.name, "buffer", args[1]?.startsWith("https://") ? "urlImage+hex" : "urlAvatar+hex", args);
}