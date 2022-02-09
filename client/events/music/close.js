const CliCol = require("cli-color");

module.exports = (client, name, code, reason) => {
    console.log(CliCol.magenta(`Lavalink Node: ${name} closed with code ${code}. Reason: ${reason || 'No reason'}`))
};