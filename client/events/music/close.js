let clc = require("cli-color");

module.exports = (client,name,code,reason) => {
    console.log(clc.magenta(`Lavalink Node: ${name} closed with code ${code}. Reason: ${reason || 'No reason'}`)) 
};