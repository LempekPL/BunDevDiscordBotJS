const CliCol = require("cli-color");

module.exports = (client, name, reason) => {
    console.log(CliCol.magenta(`Lavalink Node: ${name} disconnected. Reason: ${reason || 'No reason'}`));
};