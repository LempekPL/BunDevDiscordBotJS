const Discord = require("discord.js");

module.exports.info = {
    name: "fox",
    tags: ["api", "badosz", "picture", "fun"]
}

module.exports.run = async (client, message, args) => {
    await client.util.obraziumHandler(client, message, module.exports.info.name);
}