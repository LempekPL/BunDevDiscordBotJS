const Discord = require("discord.js");

module.exports.info = {
    name: "catgirl",
    tags: ["api","badosz","picture","fun"]
}

module.exports.run = async (client, message, args) => {
    await client.util.obraziumImage(client, message, module.exports.info.name);
}
