const CliCol = require("cli-color");

module.exports = (client, name) => {
    console.log(CliCol.cyan(`Lavalink Node: ${name} ready!`));
};