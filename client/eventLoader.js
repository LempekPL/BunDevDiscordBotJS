const EventHandler = (event) => require(`./events/bot/${event}`);
const MusicEventHandler = (musicEvent) => require(`./events/music/${musicEvent}`);

module.exports = (client) => {
    // classic events
    client.on("ready", () => EventHandler("ready")(client));
    client.on("messageCreate", (message) => EventHandler("messageCreate")(client, message));
    client.on("error", (error) => EventHandler("error")(client, error));
    //client.on("guildCreate", (guild) => EventHandler("guildCreate")(client, guild));
    //client.on("guildDelete", (guild) => EventHandler("guildDelete")(client, guild));
    //client.on("guildMemberAdd", (member) => EventHandler("guildMemberAdd")(client, member));
    //client.on("guildMemberRemove", (member) => EventHandler("guildMemberRemove")(client, member));
    //client.on("voiceStateUpdate", (oldState, newState) => EventHandler("voiceStateUpdate")(client, oldState, newState));
    client.on("uisae", (error, message, addinfo) => EventHandler('uisae')(client, error, message, addinfo));
    // music events
    client.shoukaku.on("ready", (name) => MusicEventHandler("ready")(client,name));
    client.shoukaku.on("error", (name, error) => MusicEventHandler("error")(client,name,error));
    client.shoukaku.on("close", (name, code, reason) => MusicEventHandler("close")(client,name,code,reason));
    client.shoukaku.on("disconnected", (name, reason) => MusicEventHandler("disconnected")(client,name,reason));
    // other events needed for full logger
    // TODO: implement full logger events
}