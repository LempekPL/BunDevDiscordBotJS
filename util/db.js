let r = require('rethinkdb');
let config = require("../data/config.json")

let database = {
    host: process.env.RETHINK_HOST,
    port: process.env.RETHINK_PORT,
    db: process.env.DEV ? process.env.DEV_RETHINK_DB : process.env.RETHINK_DB,
    user: process.env.RETHINK_USER,
    password: process.env.RETHINK_PASSWORD,
}

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
    // money: {
    //     money: "0",
    //     bank: "0"
    // },
    // xp: {
    //     xp: "0",
    //     totxp: "0"
    // },
    // lvl: {
    //     lvl: "1",
    //     nxlvl: "60"
    // },
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

let bot = {
    commands: 0,
    globalBans: []
}

let defaultData = {
    guilds,
    users,
    bot
}

module.exports.default = defaultData

let connection;

// this check is for syncing database with data templates
/*  
    id - id of the table
    obj - table 
*/
module.exports.check = async (object, id) => {
    console.log("deletecheck")
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
    console.log("deleteupdate")
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
    console.log("deleteupdateFull")
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
    console.log("deleteget")
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
    console.log("deletegetFull")
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
    console.log("deletedel")
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
    console.log("deletesyncCache")
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
    console.log("deletesyncDB")
    try {
        if (!client || !object || !id) return false;
        await client.db.updateFull(object, id, client.dbCache[object][id]);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

module.exports.Conn = class Conn {
    constructor({host, port, db, user, password} = database) {
        this.host = host;
        this.port = port;
        this.db = db;
        this.user = user;
        this.password = password;
        this.connection = {};
    }

    async connect() {
        let database = {host: this.host, port: this.port, db: this.db, user: this.user, password: this.password};
        this.connection = await r.connect(database);
        return this;
    }

    async load() {
        try {
            await Promise.all([
                r.tableCreate("users").run(this.connection),
                r.tableCreate("guilds").run(this.connection),
                r.tableCreate("bot").run(this.connection),
            ]);
            console.log('Tables created.');
        } catch (error) {
            if (error.message.includes("already exists")) return;
            console.error(error);
        }
    }

    async updateKeyValue(table, id, key, value) {
        if (!table || !id || !key || !value) return false;
        try {
            await r.table(table).get(id).update({
                [key]: value
            }).run(this.connection);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async update(table,id,values) {
        if (!table || !id || !values) return false;
        try {
            await r.table(table).get(id).update(values).run(this.connection);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async insert(table ,id, values = {}) {
        if (!table || !id || !values || values === {}) return false;
        try {
            await r.table(table).insert({
                id
            }).run(this.connection);
            await r.table(table).get(id).update(values).run(this.connection);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async getKey(table, key, id) {
        if (!table || !key || !id) return false;
        try {
            let cursor = await r.table(table).get(id).toJSON().run(this.connection);
            let data = await JSON.parse(cursor)[key];
            if (!data) return defaultData[table][key];
            return data;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async getAll(table) {
        if (!table) return false;
        try {
            let cursor = await r.table(table).run(this.connection);
            let data = await cursor.toArray();
            cursor.close();
            if (!data) return false;
            return data;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async get(table,id) {
        if (!table || !id) return false;
        try {
            let resp = await r.table(table).get(id).toJSON().run(this.connection);
            let data = JSON.parse(resp);
            if (!data) return defaultData[table];
            return data;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async getBy(table,key, value, amount = 1) {
        if (!table || !key || !value) return false;
        try {
            let cursor = await r.table(table).filter({[key]: value}).run(this.connection);
            let data = await cursor.toArray();
            cursor.close();
            if (!data) return null;
            let dataExit;
            if (amount > 0 && amount <= data.length) {
                dataExit = data.slice(0, amount);
            } else {
                dataExit = data;
            }
            return dataExit;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async deleteRow(table, id, key) {
        if (!table || !id || !key) return false;
        try {
            await r.table(table).get(id).replace(r.row.without(key)).run(this.connection);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async delete(table, id) {
        if (!table || !id) return false;
        try {
            await r.table(table).get(id).delete().run(this.connection);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async close() {
        try {
            await this.connection.close(function (err) {
                if (err) throw err;
            });
        } catch (e) {
            console.error(e);
        }
    }
}