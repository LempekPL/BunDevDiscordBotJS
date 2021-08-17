const Discord = require("discord.js");

module.exports.info = {
    name: "cat",
    tags: ["api","badosz","text","fun"]
}

module.exports.run = async (client, message, args) => {
    await client.util.obraziumHandler(client, message, module.exports.info.name, "json");
}