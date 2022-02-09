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
            await require("../../commandLoader")(client);
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
        case "client":
            console.log(CliCol.cyan(`Reloading client!`));
            await message.channel.send("Reloaded client");
            client = await require("../../../client")(client);
            console.log(CliCol.cyan(`Reloaded client!`));
            break;
        default:
            message.channel.send("`commands` - reload commands\n`client` - reload entire client\n`database` - reload database");
            break;
    }
}