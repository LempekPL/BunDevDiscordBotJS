const Discord = require("discord.js");

module.exports.info = {
    name: "blurple",
    tags: ["api","badosz","picture","fun"]
}
// TODO: better image check
module.exports.run = async (client, message, args) => {
    await client.util.obraziumHandler(client, message, module.exports.info.name, "buffer", args[0]?.startsWith("https://") ? "urlImage" : "urlAvatar", args[0]);
}