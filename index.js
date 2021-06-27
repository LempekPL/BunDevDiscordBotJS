let Discord = require('discord.js');
let config = require("./data/config");
let {
    Shoukaku
} = require('shoukaku');
require('dotenv').config()

// creating lavalink server
let LavalinkServer = [{
    name: config.settings.botname,
    host: process.env.LAVALINK_HOST,
    port: process.env.LAVALINK_PORT,
    auth: process.env.LAVALINK_PASSWORD
}];
let ShoukakuOptions = {
    moveOnDisconnect: true,
    resumable: false,
    resumableTimeout: 30,
    reconnectTries: 2,
    restTimeout: 10000
};


class BotClient extends Discord.Client {
    queue = {};
    util = {};
    db = require("./util/db.js");
    dbCache = {
        bot: {},
        users: {},
        guilds: {}
    };
    forceCheck = new Set();
    words = {};
    wordsCom = {};
    config = config;
    shoukaku = new Shoukaku(this, LavalinkServer, ShoukakuOptions);
}


// loading bot
let client = new BotClient();
require('./client/events/eventsLoader')(client);
require('./client/commandLoader')(client);
require('./client/utilLoader')(client);
// loading dashboard is in client/events/bot/ready.js, because website was loading to fast XDD

// connecting bot
client.login(process.env.DEV ? process.env.DEV_TOKEN : process.env.TOKEN);