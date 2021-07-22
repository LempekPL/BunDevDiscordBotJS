const DefaultData = require("../data/defaultDatabaseValues.json");
const R = require('rethinkdb');
const DatabaseDefault = {
    host: process.env.RETHINK_HOST,
    port: process.env.RETHINK_PORT,
    db: process.env.DEV ? process.env.DEV_RETHINK_DB : process.env.RETHINK_DB,
    user: process.env.RETHINK_USER,
    password: process.env.RETHINK_PASSWORD,
};

module.exports.Connection = class Connection {
    constructor(database = DatabaseDefault) {
        this.database = database;
        this.connection = {};
    }

    async connect() {
        this.connection = await R.connect(this.database);
        return this;
    }

    async load() {
        try {
            await Promise.all([
                R.tableCreate("users").run(this.connection),
                R.tableCreate("guilds").run(this.connection),
                R.tableCreate("bot").run(this.connection),
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
            await R.table(table).get(id).update({
                [key]: value
            }).run(this.connection);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async update(table, id, values) {
        if (!table || !id || !values) return false;
        try {
            await R.table(table).get(id).update(values).run(this.connection);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async insert(table, id, values = {}) {
        if (!table || !id || !values || values === {}) return false;
        try {
            await R.table(table).insert({
                id
            }).run(this.connection);
            await R.table(table).get(id).update(values).run(this.connection);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async getKey(table, id, key) {
        if (!table || !key || !id) return false;
        try {
            let cursor = await R.table(table).get(id).toJSON().run(this.connection);
            if (cursor === "null") {
                await this.insert(table, id, DefaultData[table]);
                return DefaultData[table][key];
            }
            let dataReturn = await JSON.parse(cursor)[key];
            if (!dataReturn) return DefaultData[table][key];
            return dataReturn;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async getAll(table) {
        if (!table) return false;
        try {
            let cursor = await R.table(table).run(this.connection);
            let data = await cursor.toArray();
            cursor.close();
            if (!data) return false;
            return data;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async get(table, id) {
        if (!table || !id) return false;
        try {
            let resp = await R.table(table).get(id).toJSON().run(this.connection);
            let data = JSON.parse(resp);
            if (!data) return DefaultData[table];
            return data;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async getBy(table, key, value, amount = 1) {
        if (!table || !key || !value) return false;
        try {
            let cursor = await R.table(table).filter({[key]: value}).run(this.connection);
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
            await R.table(table).get(id).replace(R.row.without(key)).run(this.connection);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async delete(table, id) {
        if (!table || !id) return false;
        try {
            await R.table(table).get(id).delete().run(this.connection);
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