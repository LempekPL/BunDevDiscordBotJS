const {Client, Intents} = require("discord.js");
const {Shoukaku, Libraries} = require('shoukaku');
const Config = require("./data/config");

const LavalinkServer = [{
    name: JSON.parse(process.env.DEV) && Config.settings.devBotName != null ? Config.settings.devBotName : Config.settings.botName,
    url: process.env.LAVALINK_URL,
    auth: process.env.LAVALINK_PASSWORD
}];
const ShoukakuOptions = {
    moveOnDisconnect: false,
    resumable: false,
    resumableTimeout: 30,
    reconnectTries: 2,
    restTimeout: 10000
};

// I only have good intentions :)
let discordIntentions = [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
    // Intents.FLAGS.DIRECT_MESSAGES,
    // Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    // Intents.FLAGS.DIRECT_MESSAGE_TYPING
]

class ExtendedClient extends Client {
    queue = {};
    lang = {};
    langCom = {};
    db = require("./util/database");
    util = require("./util/utilities");
    config = Config;
    shoukaku = new Shoukaku(new Libraries.DiscordJS(this), LavalinkServer, ShoukakuOptions);
    dashboardServer = require("./web/dashboard")(this);
}

module.exports = (clientOld) => {
    if (clientOld) {
        clientOld.dashboardServer.close()
        clientOld.destroy();
        for (const path in require.cache) {
            delete require.cache[path]
        }
    }

    // loading bot
    let client = new ExtendedClient({intents: discordIntentions});
    require("./client/commandLoader")(client);
    require('./client/eventLoader')(client);

    // connecting bot
    client.login(JSON.parse(process.env.DEV) && process.env.DEV_TOKEN != null ? process.env.DEV_TOKEN : process.env.TOKEN);
    return client;
}