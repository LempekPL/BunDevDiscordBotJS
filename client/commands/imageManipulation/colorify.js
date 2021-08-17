const Discord = require("discord.js");

module.exports.info = {
    name: "colorify",
    tags: ["api","badosz","picture","fun"]
}
// TODO: if (!(/^(#+[a-fA-F0-9]{6}|#+[a-fA-F0-9]{3})$/.test(args[0]))) return client.emit("uisae", "U98", message, "");
module.exports.run = async (client, message, args) => {
    await client.util.obraziumHandler(client, message, module.exports.info.name, "buffer", args[1]?.startsWith("https://") ? "urlImage+hex" : "urlAvatar+hex", args);
}