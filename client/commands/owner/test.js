let Discord = require("discord.js");

module.exports.info = {
    name: "test",
    tags: ["owner"]
}

module.exports.run = async (client, message, args) => {
    let retA = args[1] !== "false";
    let ignB = args[2] === "true";
    let muSS = args[3] === "true";
    let a = await client.util.searchUser(client, message, args[0], {
        returnAuthor: retA,
        ignoreBots: ignB,
        multiServerSearch: muSS
    });
    console.log(a)
    if (!a) return;
    message.channel.send(JSON.stringify(a))
}