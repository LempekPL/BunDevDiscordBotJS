const Discord = require("discord.js");
const fs = require("fs");
const CliCol = require("cli-color");
const LangPath = "./langs";
const Langs = fs.readdirSync(LangPath).filter(file => fs.statSync(`${LangPath}/${file}`).isDirectory());

module.exports = (client) => {
    client.commands = new Discord.Collection();
    client.commandMap = new Map();
    fs.readdirSync("./client/commands/").forEach(category => {
        let commandFiles = fs.readdirSync(`./client/commands/${category}`).filter(file => file.endsWith(".js"));
        for (let file of commandFiles) {
            let exportedModules = require(`./commands/${category}/${file}`);
            client.commands.set(exportedModules.info.name, {
                category: category,
                run: exportedModules.run,
                info: exportedModules.info
            });
            for (let lang of Langs) {
                let exportedLanguage = require(`.${LangPath}/${lang}/commandExclusive.json`);
                if (!exportedLanguage[exportedModules.info.name]) continue;
                for (let useCase in exportedLanguage[exportedModules.info.name]) {
                    if (useCase === "default") {
                        client.commandMap.set(`${exportedLanguage[exportedModules.info.name].default}|${lang}`, exportedModules.info.name);
                    } else if (useCase === "aliases") {
                        exportedLanguage[exportedModules.info.name].aliases.forEach(al => {
                            client.commandMap.set(`${al}|${lang}`, exportedModules.info.name);
                        });
                    }
                }
            }
            console.log(CliCol.yellow(`[commands] `) + CliCol.green(`(${category}) `) + CliCol.greenBright(`${file}`));
        }
    });
};