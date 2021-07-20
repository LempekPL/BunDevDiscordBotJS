const Discord = require("discord.js");
const fs = require("fs");
const clc = require("cli-color");

module.exports = (client) => {
    client.commands = new Discord.Collection();
    client.commandMap = new Map();
    fs.readdirSync("./client/commands/").forEach(category => {
        let commandFile = fs.readdirSync(`./client/commands/${category}`).filter(file => file.endsWith('.js'));
        for (let file of commandFile) {
            let props = require(`./commands/${category}/${file}`);
            client.commands.set(props.info.name, {
                category: category,
                run: props.run,
                info: props.info
            });
            for (let lang in props.info.lang) {
                for (let useCase in props.info.lang[lang]) {
                    if (useCase === "main") {
                        client.commandMap.set(`${props.info.lang[lang].main}|${lang}`, props.info.name);
                    } else if (useCase === "aliases") {
                        props.info.lang[lang].aliases.forEach(al => {
                            client.commandMap.set(`${al}|${lang}`, props.info.name);
                        });
                    }
                }
            }
            console.log(clc.yellow(`[commands] `) + clc.green(`(${category}) `) + clc.greenBright(`${file}`));
        }
    });
};