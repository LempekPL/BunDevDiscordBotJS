let defaultData = require("../data/defaultDatabaseValues.json");

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

    async getKey(table, id, key) {
        if (!table || !key || !id) return false;
        try {
            let cursor = await r.table(table).get(id).toJSON().run(this.connection);
            if (cursor === "null") {
                await this.insert(table, id, defaultData[table]);
                return defaultData[table][key];
            }
            let dataReturn = await JSON.parse(cursor)[key];
            if (!dataReturn) return defaultData[table][key];
            return dataReturn;
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