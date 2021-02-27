let Discord = require("discord.js");

module.exports.info = {
    name: "test",
    example: "`#PREFIX##COMMAND#`",
    info: "info",
    tags: ["test"]
}

module.exports.run = async (client, message, args) => {
    let resp = client.util.searchUser(message, args[0], false);
    console.log(resp);
    message.channel.send(resp.username);
}