const {Client, Intents} = require("discord.js");
const {Shoukaku, Libraries} = require('shoukaku');
const Config = require("./data/config");
require("dotenv").config();

// declaring lavalinks servers info
const LavalinkServer = [{
    name: process.env.DEV && Config.settings.devBotName != null ? Config.settings.devBotName : Config.settings.botName,
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

// intents so discord wouldn't shout at me, I only have good intentions :)
let intentsSoDiscordWouldShutUp = [
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
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING
]

class ExtendedClient extends Client {
    queue = {};
    lang = {};
    langCom = {};
    db = require("./util/database.js");
    util = require("./util/utilities.js");
    config = Config;
    shoukaku = new Shoukaku(new Libraries.DiscordJS(this), LavalinkServer, ShoukakuOptions);
}

// loading bot
const client = new ExtendedClient({intents: intentsSoDiscordWouldShutUp});
require('./client/eventLoader')(client);
// loading commends in client/events/bot/ready.js, to make sure database loads
// loading dashboard in client/events/bot/ready.js, because website was loading to fast XDD

// connecting bot
client.login(process.env.DEV && process.env.DEV_TOKEN != null ? process.env.DEV_TOKEN : process.env.TOKEN);
