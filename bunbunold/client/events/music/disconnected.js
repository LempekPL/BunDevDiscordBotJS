let clc = require("cli-color");

module.exports = (client,name,reason) => {
    console.log(clc.magenta(`Lavalink Node: ${name} disconnected. Reason: ${reason || 'No reason'}`)); 
};