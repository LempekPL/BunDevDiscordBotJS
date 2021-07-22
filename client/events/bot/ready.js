const CliCol = require("cli-color");

module.exports = async (client) => {
    client.user.setPresence({
        status: "online",
        clientStatus: "online",
        activity: {
            name: "to people | Change language on lmpk.tk/bun",
            type: "LISTENING"
        }
    }).catch(console.error);
    module.exports.emojiguild = client.guilds.cache.get(client.config.settings.emojiServerID);

    // create database connection
    client.dbConn = await new client.db.Connection();
    await client.dbConn.load();

    // create loop making new connections every day
    // because caching stuff still needs to be updated so eh
    client.setInterval(async () => {
        await client.dbConn.close();
        client.dbConn = await new client.db.Connection();
    }, 24*60*60*1000);

    // load dashboard
    //await require("../../../app/dashboard")(client);

    console.log(CliCol.cyan(`Discord Bot: ${client.user.tag} ready!`));
}