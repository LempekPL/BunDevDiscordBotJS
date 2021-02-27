let Discord = require('discord.js');
module.exports = (client) => {
    client.commands = new Discord.Collection();
    let fs = require("fs");
    let clc = require("cli-color");
    fs.readdirSync("./client/commands/").forEach(category => {
        let commandFile = fs.readdirSync(`./client/commands/${category}`).filter(file => file.endsWith('.js'));
        for (let file of commandFile) {
            let props = require(`./commands/${category}/${file}`);
            console.log(clc.yellow(`[commands] `)+ clc.green(`(${category}) `) + clc.greenBright(`${file}`));
            client.commands.set(props.info.name, {
                category: category,
                run: props.run,
                info: props.info
            });
            if (props.info.aliases != undefined) {
                try {
                    props.info.aliases.forEach(alias => client.commands.set(alias, {
                        category: category,
                        run: props.run,
                        info: props.info
                    }));
                } catch (e) {}
            }
        }
    });
};