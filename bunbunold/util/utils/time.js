module.exports.time = (number) => {

    let second = 1;
    let minute = second * 60;
    let hour = minute * 60;

    let hoursa = Math.floor(number / (hour));
    if (hoursa < 10) {
        hoursa = "0" + String(hoursa)
    }
    let minsa = Math.floor((number % (hour)) / (minute));
    if (minsa < 10) {
        minsa = "0" + String(minsa)
    }
    let secsa = Math.floor((number % (minute)) / (second));
    if (secsa < 10) {
        secsa = "0" + String(secsa)
    }

    let time = `00:00`;
    if (hoursa <= 0) {
        time = `${minsa}:${secsa}`;
    } else {
        time = `${hoursa}:${minsa}:${secsa}`;
    }

    return time;
};