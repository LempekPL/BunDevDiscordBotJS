module.exports.langM = (lang) => {
    console.log("delete")
    let words = require(`../../lang/${lang}.json`);
    return words;
}