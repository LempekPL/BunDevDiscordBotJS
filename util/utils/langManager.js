module.exports.langM = (lang) => {
    let words = require(`./lang/${lang}.json`);
    return words;
}