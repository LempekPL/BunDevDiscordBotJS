//"25Hz","40Hz","63Hz","100Hz","160Hz","250Hz","400Hz","630Hz","1KHz","1.6KHz","2.5KHz","4KHz","6.3KHz","10KHz","16KHz"
let gaingrup = {
    pop: ["0", "0", "0", "0", "-0.06", "0", "-0.12", "-0.02", "0", "0", "0", "-0.06", "-0.06", "0", "0"],
    rock: ["0.07", "0.07", "0.07", "0.06", "0.05", "0.04", "0.02", "0", "-0.04", "-0.02", "0", "-0.02", "-0.04", "0.01", "0.5"],
    jazz: ["0", "0", "0", "0", "0", "0", "0", "0", "-0.05", "-0.06", "-0.07", "0", "0", "0", "0"],
    hiphop: ["0.06", "0.06", "0.06", "0.06", "0.05", "0", "-0.05", "-0.03", "0", "-0.03", "-0.05", "-0.05", "-0.05", "0.03", "0.06"],
    electric: ["0.06", "0.06", "0.06", "0.06", "0.06", "0.02", "-0.02", "-0.01", "0", "-0.03", "-0.06", "-0.03", "0", "0", "0"],
    metal: ["0.05", "0.05", "0.05", "0.03", "0", "0", "0", "-0.03", "-0.05", "-0.06", "-0.08", "-0.04", "0", "0", "0"],
    bassboost: ["0.1", "0.2", "0.3", "0.3", "0.2", "0.1", "-0.05", "-0.1", "-0.2", "-0.1", "-0.1", "-0.05", "0.1", "-0.1", "0.3"],
    earrape: ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "0", "0", "0", "0", "0"],
    reset: ["0", "0", "0", "0", "0","0", "0", "0", "0", "0","0", "0", "0", "0", "0"]
}

let equalizer = function equalizer(player) {
    if (!player.bands[14]) {
        for (let i = 0; i < 15; i++) {
            player.bands.push({
                band: i,
                gain: 0
            })
        }
    }
    let eqlist = player.bands;
    return eqlist;
}

let setEqualizer = function setEqualizer(player, band, gain, com = null, db = false) {
    if (!player.bands[14]) {
        for (let i = 0; i < 15; i++) {
            player.bands.push({
                band: i,
                gain: 0
            })
        }
    }
    if (db) {
        if(!com) return "ERROR";
        player.bands = com
        return;
    }
    if (!band && !gain) {
        if (!gaingrup[com]) return "PRDNE";
        let gainb = gaingrup[com];
        for (let i = 0; i < 15; i++) {
            player.bands.splice(i, 1, {
                band: i,
                gain: Number(gainb[i])
            });
        };
    } else {
        player.bands.splice(band - 1, 1, {
            band: band - 1,
            gain: Number(gain)
        });
    }
    player.setEqualizer(player.bands);
}

module.exports.setEqualizer = setEqualizer;
module.exports.equalizer = equalizer;