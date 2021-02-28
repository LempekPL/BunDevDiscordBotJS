let path = require("path");

module.exports.codename = (name) => {
    let names = require("../../data/codenames.json").codename;
    return names[path.basename(path.resolve(name, ''))];
}