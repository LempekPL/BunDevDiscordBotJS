let reqEvent = (event) => require(`./bot/${event}`);
let reqMusicEvent = (musicEvent) => require(`./music/${musicEvent}`);
module.exports = (client) => {
    client.on('ready', () => reqEvent('ready')(client));
    client.on('voiceStateUpdate', (oldState, newState) => reqEvent('voiceStateUpdate')(oldState, newState, client));
    client.on('message', (message) => reqEvent('message')(message, client));
    client.on('error', (err) => reqEvent('error')(err));
    client.on("uisae", (error, message, addinfo) => reqEvent('uisae')(error, message, addinfo, client));
    client.on('guildCreate', (guild) => reqEvent('guildCreate')(guild));
    client.on('guildDelete', (guild) => reqEvent('guildDelete')(guild));
    client.on('guildMemberAdd', (member) => reqEvent('guildMemberAdd')(member));
    client.on('guildMemberRemove', (member) => reqEvent('guildMemberRemove')(member));
    client.shoukaku.on('ready', (name) => reqMusicEvent('ready')(client,name));
    client.shoukaku.on('error', (name, error) => reqMusicEvent('ready')(client,name,error));
    client.shoukaku.on('close', (name, code, reason) => reqMusicEvent('close')(client,name,code,reason));
    client.shoukaku.on('disconnected', (name, reason) => reqMusicEvent('disconnected')(client,name,reason));
};