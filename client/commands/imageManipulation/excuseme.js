const Discord = require("discord.js");

module.exports.info = {
    name: "excuseme",
    tags: ["api","badosz","picture","fun"]
}

module.exports.run = async (client, message, args) => {
    await client.util.obraziumHandler(client, message, module.exports.info.name, "buffer", "text", args.join(" "));
}