const Discord = require("discord.js");

module.exports.info = {
    name: "triggered",
    tags: ["api", "badosz", "picture", "fun"]
}

module.exports.run = async (client, message, args) => {
    await client.util.obraziumHandler(client, message, module.exports.info.name, "buffer", args[0]?.startsWith("https://") ? "urlImage" : "urlAvatar", args[0]);
}