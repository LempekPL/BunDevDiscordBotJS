let rqEvent = (event) => require(`./musicEvents/${event}`);
module.exports = client => {
    client.shoukaku.on('ready', (name) => rqEvent('ready')(client,name));
    client.shoukaku.on('error', (name, error) => rqEvent('ready')(client,name,error));
    client.shoukaku.on('close', (name, code, reason) => rqEvent('close')(client,name,code,reason));
    client.shoukaku.on('disconnected', (name, reason) => rqEvent('disconnected')(client,name,reason));
};