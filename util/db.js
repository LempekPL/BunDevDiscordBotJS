let r = require('rethinkdb');
let config = require("../data/config.json");
let {
    database
} = require('../data/config.json');

let guilds = {
    prefix: config.settings.prefix,
    slowmode: 1,
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
    // warn: {
    //     enabled: false,
    //     limit: false,
    //     votelimit: false,
    //     users: {},
    //     voteUsers: {}
    // },
    // economyInfo: {
    //     money: false,
    //     xp: false,
    //     lvl: false
    // },
    disabledCategory: [],
    // serverEconomy: {
    //     xp: "0",
    //     level: "0"
    // },
    language: {
        lang: "en",
        commands: "en",
        force: false
    }
};

// future thing *ignore*
//serverType: "private"

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
    category: {
        disabled: [],
        force: false
    },
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

let bot = {
    commands: 0,
    globalBans: []
}

let objects = {
    guilds,
    users,
    bot
}

let connection;
module.exports.load = async () => {
    try {
        connection = await r.connect(database);
        await Promise.all([
            r.tableCreate("users").run(connection),
            r.tableCreate("guilds").run(connection),
            r.tableCreate("bot").run(connection),
        ]);
        console.log('Tables created.');
    } catch (error) {
        if (error.message.includes("already exists")) return;
        console.log(error);
    }
};

// this check is for syncing database with data templates
/*  
    id - id of the table
    obj - table 
*/
module.exports.check = async (object, id) => {
    if (!id || !object) return false;
    try {
        let dbdata = await r.table(object).get(id).toJSON().run(connection);
        let parsed = await JSON.parse(dbdata);
        if (!parsed) {
            let dati = {};
            dati["id"] = id;
            for (let prop in objects[object]) {
                dati[prop] = objects[object][prop];
            }
            await r.table(object).insert(dati).run(connection);
            return true;
        }
        for (let prop in objects[object]) {
            if (!parsed[prop]) {
                await r.table(object).get(id).update({
                    [prop]: objects[object][prop]
                }).run(connection);
            }
        }
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};

/*  
    obj - table 
    id - id in the table
    k - data to update
    v - new value
*/
module.exports.update = async (obj, id, k, v) => {
    if (!obj || !id || !k || !v) return false;
    try {
        await r.table(obj).get(id).update({
            [k]: v
        }).run(connection);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};

/*  
    obj - table
    id - id in the table
    v - data values {Object}
*/
module.exports.updateFull = async (obj, id, v) => {
    if (!obj || !id || !v) return false;
    try {
        await r.table(obj).get(id).update(v).run(connection);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};

/*  
    obj - table
    id - id in the table
    name - data to get
*/
module.exports.get = async (obj, id, name) => {
    if (!id) return false;
    try {
        let object = await r.table(obj).get(id).toJSON().run(connection);
        if (!object) return false;
        let data = await JSON.parse(object)[name];
        if (!data) return false;
        return data;
    } catch (e) {
        console.error(e);
        return false;
    }
};

/*  
    obj - table
    id - id in the table
*/
module.exports.getFull = async (obj, id) => {
    if (!id) return false;
    try {
        let object = await r.table(obj).get(id).toJSON().run(connection);
        if (!object) return false;
        let data = await JSON.parse(object);
        if (!data) return false;
        return data;
    } catch (e) {
        console.error(e);
        return false;
    }
};

/*  
    obj - table
    id - id in the table
*/
module.exports.del = async (obj, id) => {
    if (!id) return false;
    try {
        await r.table(obj).get(id).delete().run(connection);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};

/*  
    client - client bot
    object - table
    id - id in the table
*/
module.exports.syncCache = async (client, object, id) => {
    try {
        if (!client || !object || !id) return false;
        let data = await client.db.getFull(object, id);
        client.dbCache[object][id] = await data;
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

/*  
    client - client bot
    object - table
    id - id in the table
*/
module.exports.syncDB = async (client, object, id) => {
    try {
        if (!client || !object || !id) return false;
        await client.db.updateFull(object, id, client.dbCache[object][id]);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}