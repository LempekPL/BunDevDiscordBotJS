const { Client } = require("discord.js");
const { Shoukaku } = require("shoukaku");
const Config = require("./data/config");
require("dotenv").config();

// creating lavalink server
const LavalinkServer = [{
    name: process.env.DEV && Config.settings.devBotName != null ? Config.settings.devBotName : Config.settings.botName,
    host: process.env.LAVALINK_HOST,
    port: process.env.LAVALINK_PORT,
    auth: process.env.LAVALINK_PASSWORD
}];
const ShoukakuOptions = {
    moveOnDisconnect: true,
    resumable: false,
    resumableTimeout: 30,
    reconnectTries: 2,
    restTimeout: 10000
};


class ExtendedClient extends Client {
    queue = {};
    lang = {};
    db = require("./util/database.js");
    util = require("./util/utilities.js");
    config = Config;
    shoukaku = new Shoukaku(this, LavalinkServer, ShoukakuOptions);
}

// loading bot
const client = new ExtendedClient();
require('./client/eventLoader')(client);
require('./client/commandLoader')(client);
// loading dashboard in client/events/bot/ready.js, because website was loading to fast XDD

// connecting bot
client.login(process.env.DEV && process.env.DEV_TOKEN != null ? process.env.DEV_TOKEN : process.env.TOKEN);