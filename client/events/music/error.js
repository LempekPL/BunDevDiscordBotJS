let clc = require("cli-color");

module.exports = (client,name,error) => {
    console.log(clc.red(`Lavalink Node: ${name} emitted an error.`, error));
    require("../../../util/util.js").crash(null, error,"SHOUKAKU");
};