const CliCol = require("cli-color");

module.exports = async (client) => {
    // create database connection
    client.dbConn = await new client.db.Connection().connect();
    await client.dbConn.load();

    // set presence and change it once per hour
    await setPresence(client);
    setInterval(async () => {
        await setPresence(client);
    }, 60 * 60 * 1000);

    // create loop making new connections every day
    // because caching stuff still needs to be updated so eh
    setInterval(async () => {
        await client.dbConn.close();
        client.dbConn = await new client.db.Connection().connect();
    }, 24 * 60 * 60 * 1000);

    console.log(CliCol.cyan(`Discord Bot: ${client.user.tag} ready!`));
}

const ListOfSecondThings = [
    "Change language on lmpk.tk/bun",
    "Change settings on lmpk.tk/bun",
    "Change server settings on lmpk.tk/bun",
    "Change user settings on lmpk.tk/bun",
    "Helping #PEOPLESCOUNT# users!",
    "Helping in #GUILDSCOUNT# servers!",
    "#COMMANDSCOUNT# times used!"
]

async function setPresence(client) {
    let type = Math.floor(Math.random() * 4), secondThing = Math.floor(Math.random() * ListOfSecondThings.length);
    let presenceType, presenceName, finalThing, commandCount, commandCountLetter;
    if (ListOfSecondThings[secondThing].includes("#COMMANDSCOUNT#")) {
        commandCount = await client.dbConn.getKey("bot", client.user.id, "commands");
        let commandCountLength = String(Math.abs(commandCount)).length;
        let commandCountFlored = Math.floor((commandCountLength - 0.1) / 3);
        let commandCountMultiplier = commandCountLength % 3 !== 0 ? 10 : 1;
        commandCount = Math.floor((commandCount / (1000 ** commandCountFlored)) * commandCountMultiplier) / commandCountMultiplier;
        commandCountLetter = commandCountFlored === 0 ? "" : commandCountFlored === 1 ? "k" : commandCountFlored === 2 ? "M" : commandCountFlored === 3 ? "B" : "T";
    }
    finalThing = ListOfSecondThings[secondThing].replace(/#COMMANDSCOUNT#/g, `+${commandCount}${commandCountLetter}`).replace(/#GUILDSCOUNT#/g, client.guilds.cache.size).replace(/#PEOPLESCOUNT#/g, client.users.cache.size);
    switch (type) {
        case 0:
            presenceType = "LISTENING";
            presenceName = `people | ${finalThing}`;
            break;
        case 1:
            presenceType = "WATCHING";
            presenceName = `people | ${finalThing}`;
            break;
        case 2:
            presenceType = "COMPETING";
            presenceName = `chat with people | ${finalThing}`;
            break;
        case 3:
            presenceType = "PLAYING";
            presenceName = `with people | ${finalThing}`;
            break;
        default:
            presenceType = "PLAYING";
            presenceName = `Minecraft | ${finalThing}`;
            break;
    }
    client.user.setPresence({
        status: "online",
        activities: [{
            name: presenceName,
            type: presenceType
        }]
    });
}