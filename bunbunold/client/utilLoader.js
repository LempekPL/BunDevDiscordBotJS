let Discord = require('discord.js');

module.exports = (client) => {
    client.util = new Discord.Collection();
    let fs = require("fs");
    let clc = require("cli-color");
    fs.readdirSync("./util/utils/").filter(file => file.endsWith('.js')).forEach(file => {
        console.log(clc.magentaBright(`[utils] `)+ clc.blue(`${file}`));
        Object.assign(client.util, require("../util/utils/"+file));
    });
};