module.exports.randomColorConfig = (client) => {
    let ce = client.config.c[Math.floor(Math.random() * client.config.c.length)];
    return ce;
};
    