const Discord = require("discord.js");
const CliCol = require("cli-color");

module.exports.info = {
    name: "reload",
    tags: ["owner"]
}

module.exports.run = async (client, message, args) => {
    switch (args[0]) {
        case "commands":
            console.log(CliCol.cyan(`Reloading commands!`));
            message.channel.send("Reloading commands");
            require("../../commandLoader")(client);
            message.channel.send("Reloaded commands");
            console.log(CliCol.cyan(`Reloaded commands!`));
            break;
        case "database":
            console.log(CliCol.cyan(`Reloading database!`));
            message.channel.send("Reloading database");
            await client.dbConn.close();
            client.dbConn = await new client.db.Connection().connect();
            message.channel.send("Reloaded database");
            console.log(CliCol.cyan(`Reloaded database!`));
            break;
        case "bot":
            console.log(CliCol.cyan(`Reloading client!`));
            await message.channel.send("Reloaded client");
            client = require("../../../client.js")(client);
            console.log(CliCol.cyan(`Reloaded client!`));
            break;
        default:
            message.channel.send("`commands` - reload commands\n`bot` - reload bot\n`bot` - reload database");
            break;
    }
}