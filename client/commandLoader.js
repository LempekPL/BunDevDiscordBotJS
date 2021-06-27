let Discord = require('discord.js');
module.exports = (client) => {
    client.commands = new Discord.Collection();
    client.commandMap = new Map();
    let fs = require("fs");
    let clc = require("cli-color");
    fs.readdirSync("./client/commands/").forEach(category => {
        let commandFile = fs.readdirSync(`./client/commands/${category}`).filter(file => file.endsWith('.js'));
        for (let file of commandFile) {
            let props = require(`./commands/${category}/${file}`);
            console.log(clc.yellow(`[commands] `) + clc.green(`(${category}) `) + clc.greenBright(`${file}`));
            client.commands.set(props.info.name, {
                category: category,
                run: props.run,
                info: props.info
            });
            for (lan in props.info.lang) {
                for (nam in props.info.lang[lan]) {
                    if (nam === "main") {
                        client.commandMap.set(`${props.info.lang[lan].main}|${lan}`, props.info.name);
                    } else if (nam === "aliases") {
                        props.info.lang[lan].aliases.forEach(al => {
                            client.commandMap.set(`${al}|${lan}`, props.info.name);
                        });
                    }
                }
            }
        }
    });
};