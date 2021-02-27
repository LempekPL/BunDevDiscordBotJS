module.exports.dateFormat = (date) => {
    let d = new Date(date);
    let dformat = [
        (d.getDate() < 10 ? '0' : '') + d.getDate(),
        ((Number(d.getMonth() + 1)) < 10 ? '0' : '') + Number(d.getMonth() + 1),
        d.getFullYear()
    ].join('.') + ' ' + [
        (d.getHours() < 10 ? '0' : '') + d.getHours(),
        (d.getMinutes() < 10 ? '0' : '') + d.getMinutes(),
        (d.getSeconds() < 10 ? '0' : '') + d.getSeconds()
    ].join(':');
    return dformat;
};