module.exports.codename = (name) => {
    let names = require("../../data/codenames.json").codenames;
    return names[path.basename(path.resolve(name, ''))];
}