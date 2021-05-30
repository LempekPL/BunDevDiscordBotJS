let clc = require("cli-color");

module.exports = (client) => {
    client.user.setPresence({
        status: "online",
        clientStatus: "online",
        activity: {
            name: "to people | " + client.config.settings.prefix + "help",
            type: "LISTENING"
        }
    }).catch(console.error);
    //TODO | Change language on lmpk.tk/bun
    module.exports.emojiguild = client.guilds.cache.get(client.config.settings.emojiServer);
    // load database
    client.db.load();
    
    // load dashboard
    require("../../../app/dashboard")(client);

    console.log(clc.cyan(`Discord Bot: ${client.user.tag} ready!`));
}