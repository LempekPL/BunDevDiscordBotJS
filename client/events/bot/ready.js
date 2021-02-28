let clc = require("cli-color");
let Discord = require("discord.js");

module.exports = (client) => {
    client.user.setPresence({
        status: "online",
        activity: {
            name: "to people | " + client.config.settings.prefix + "help",
            type: "LISTENING"
        }
    });
    // | "+prefix+"lang
    module.exports.emojiguild = client.guilds.cache.get(client.config.settings.emojiServer);
    client.util = new Discord.Collection();
    let fs = require("fs");
    fs.readdirSync("./util/utils/").filter(file => file.endsWith('.js')).forEach(file => {
        console.log(clc.magentaBright(`[utils] `)+ clc.blue(`${file}`));
        Object.assign(client.util, require("../../../util/utils/"+file));
    });
    client.db.load();

    console.log(clc.cyan(`${client.user.tag} ready`));
}