let r = require('rethinkdb');
let config = require("../data/config.json");
let {
    database
} = require('../data/config.json');

// server database template
let guilds = {
    prefix: config.settings.prefix,
    slowmode: config.settings.slowmode,
    welcome: {
        enabled: false,
        channel: "",
        msg: ""
    },
    goodbye: {
        enabled: false,
        channel: "",
        msg: ""
    },
    autorole: {
        enabled: false,
        role: ""
    },
    voiceBans: [],
    player: {
        nextSong: false,
        voteSkip: false,
        voteSkipTo: false,
        votePrev: false,
        djrole: ""
    },
    voteVoiceKick: {
        limit: false,
        users: {}
    },
    warn: {
        enabled: false,
        limit: false,
        votelimit: false,
        users: {},
        voteUsers: {}
    },
    economyInfo: {
        money: false,
        xp: false,
        lvl: false
    },
    disabledCategory: [],
    serverEconomy: {
        xp: "0",
        level: "0"
    },
    language: {
        lang: "en",
        commands: "en",
        force: false
    }
};

// future thing *ignore*
//serverType: "private"

// user database template
let users = {
    money: {
        money: "0",
        bank: "0",
        lastDaily: "0"
    },
    xp: {
        xp: "0",
        totxp: "0"
    },
    lvl: {
        lvl: "1",
        nxlvl: "60"
    },
    time: {
        lastRob: "0"
    },
    disabledCategory: [],
    equalizers: {},
    playlists: {},
    favCommands: {},
    randomhelpinfo: true,
    display: {
        help: false,
        settings: false,
        options: false
    },
    language: {
        lang: "en",
        commands: "en"
    }
}

// this bot database template
let bot = {
    commands: 0,
    globalBans: []
}

// creating tables in database
let connection;
module.exports.load = async () => {
    try {
        connection = await r.connect(database);
        await Promise.all([
            r.tableCreate("users").run(connection),
            r.tableCreate("guilds").run(connection),
            r.tableCreate("bot").run(connection),
        ]);
        console.log('Tabele zostaly stworzone.');
    } catch (error) {
        if (error.message.includes("already exists")) return;
        console.log(error);
    }
};

// checking if the guild data is correct to the template
module.exports.checkGuild = async (gid) => {
    try {
        let guild = await r.table('guilds').get(gid).toJSON().run(connection);
        let baziz = await JSON.parse(guild);
        if (!baziz) {
            let dati = {};
            dati["id"] = gid;
            for (let prop in guilds) {
                dati[prop] = guilds[prop];
            }
            await r.table("guilds").insert(dati).run(connection);
            return true;
        }
        for (let prop in guilds) {
            if (!baziz[prop]) {
                await r.table("guilds").get(gid).update({
                    [prop]: guilds[prop]
                }).run(connection);
            }
        }
    } catch (e) {
        console.error(e);
        return false;
    }
    return true;
};

// checking if the user data is correct to the template
module.exports.checkUser = async (uid) => {
    try {
        let user = await r.table('users').get(uid).toJSON().run(connection);
        let baziz = await JSON.parse(user);
        if (!baziz) {
            let dati = {};
            dati["id"] = uid;
            for (let prop in users) {
                dati[prop] = users[prop];
            }
            await r.table("users").insert(dati).run(connection);
            return true;
        }
        for (let prop in users) {
            if (!baziz[prop]) {
                await r.table("users").get(uid).update({
                    [prop]: users[prop]
                }).run(connection);
            }
        }
    } catch (e) {
        console.error(e);
        return false;
    }
    return true;
};

// checking if the bot data is correct to the template
module.exports.checkBot = async (bid) => {
    try {
        let bote = await r.table('bot').get(bid).toJSON().run(connection);
        let baziz = await JSON.parse(bote);
        if (!baziz) {
            let dati = {};
            dati["id"] = bid;
            for (let prop in bot) {
                dati[prop] = bot[prop];
            }
            await r.table("bot").insert(dati).run(connection);
            return true;
        }
        for (let prop in bot) {
            if (!baziz[prop]) {
                await r.table("bot").get(bid).update({
                    [prop]: bot[prop]
                }).run(connection);
            }
        }
    } catch (e) {
        console.error(e);
        return false;
    }
    return true;
};

// update function to update the data
/*  obj - table 
    id - id in the table
    k - data to update
    v - new value
*/
module.exports.update = async (obj, id, k, v) => {
    if (obj && id && k && v) {
        try {
            await r.table(obj).get(id).update({
                [k]: v
            }).run(connection);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    } else {
        return false;
    }
};

// get function to get the data
/*  obj - table
    id - id in the table
    name - data to get
*/
module.exports.get = async (obj, id, name) => {
    if (id) {
        if (id == null) return false;
        try {
            let object = await r.table(obj).get(id).toJSON().run(connection);
            if (object == null) return false;
            let data = await JSON.parse(object)[name];
            if (data == null) return false;
            return data;
        } catch (e) {
            console.error(e);
            return false;
        }
    } else {
        return false;
    }
};

// delete function to delete the data
/*  obj - table
    id - id in the table
*/
module.exports.del = async (obj, id) => {
    if (id) {
        if (id == null) return false;
        try {
            await r.table(obj).get(id).delete().run(connection);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    } else {
        return false;
    }
};