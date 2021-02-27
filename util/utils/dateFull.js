module.exports.daten = (date) => {
    let d = new Date(date);

    let second = 1000;
    let minute = second * 60;
    let hour = minute * 60;
    let day = hour * 24;
    let year = day * 365.25;


    // this requires full rewrite

    let yearsa = Math.floor(d / year);
    let daysa = Math.floor((d % year) / day);
    let hoursa = Math.floor((d % day) / hour);
    let minsa = Math.floor((d % hour) / minute);
    let secsa = Math.floor((d % minute) / second);
    let msecsa = Math.floor(d % second);

    let yf, df, hf, mf, sf, msf;

    if (yearsa == 1) {
        yf = `year`;
    } else {
        yf = `years`;
    };

    if (daysa == 1) {
        df = `day`;
    } else {
        df = `days`;
    };

    if (hoursa == 1) {
        hf = `hour`;
    } else {
        hf = `hours`;
    };

    if (minsa == 1) {
        mf = `minute`;
    } else {
        mf = `minutes`;
    };

    if (secsa == 1) {
        sf = `second`;
    } else {
        sf = `seconds`;
    };

    if (msecsa == 1) {
        msf = `milliseconds`;
    } else {
        msf = `milliseconds`;
    };

    let response = {
        "years": yearsa,
        "days": daysa,
        "hours": hoursa,
        "mins": minsa,
        "secs": secsa,
        "msecs": msecsa,
        "ty": yf,
        "td": df,
        "th": hf,
        "tm": mf,
        "ts": sf,
        "tms": msf
    }

    return response;

};