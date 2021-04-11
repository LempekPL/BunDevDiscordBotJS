let clc = require("cli-color");

module.exports = (client, name) => {
    console.log(clc.cyan(`Lavalink Node: ${name} ready!`));
};