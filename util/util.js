// this file will be deleted

let Discord = require('discord.js');
let config = require("../data/config.json");
let db = require("./db.js")
let fetch = require('node-fetch');
let cooldown = new Set();
let {
    URLSearchParams
} = require('url');
let path = require("path");

let test = function test(message) {
    return message;
}

let searchUser = function searchUser(message, string, returnAuthor = true,safeServer=false) {
    return new Promise((resolve, reject) => {
        if (message.mentions.users.first() == null) {
            if (string == null || string.startsWith("#")) {
                if (returnAuthor) {
                    return resolve(message.author);
                } else {
                    return reject(message.author);
                }
            }
            if (message.guild.members.cache.get(string) != undefined) {
                return resolve(message.client.users.cache.get(string));
            }
            let zn = false;
            message.guild.members.cache.forEach(member => {
                if (zn) return;
                if (member.user.username.toLowerCase().includes(string.toLowerCase())) {
                    zn = true;
                    return resolve(member.user);
                }
            });
            if (!zn)
                if (returnAuthor) resolve(message.author);
                else reject(message.author);
        } else {
            resolve(message.mentions.users.first());
        }
    }).catch(err => {
        message.channel.send(err)
    });
}

let polskieliterytoblad = function polskieliterytoblad(string) {
    return string.replace(/ą/g, "a").replace(/ę/g, "e").replace(/ć/g, "c").replace(/ń/g, "n").replace(/ł/g, "l").replace(/ó/g, "o").replace(/ś/g, "s").replace(/ź/g, "z").replace(/ż/g, "z").replace(/Ą/g, "A").replace(/Ę/g, "E").replace(/Ć/g, "C").replace(/Ń/g, "N").replace(/Ł/g, "L").replace(/Ó/g, "O").replace(/Ś/g, "S").replace(/Ź/g, "Z").replace(/Ż/g, "Z");
}

let gban = async function gban(message, client) {
    let embed = new Discord.MessageEmbed();
    embed.setTitle(`Globalban`);
    embed.setDescription(`You can't use this bot.\nYou can appeal here https://discord.gg/NEGmf5A`);
    embed.setColor("#FF0000");
    if (config.settings.subowners.length==0) {
        embed.setFooter("© "+client.users.cache.get(config.settings.ownerid).username, client.users.cache.get(config.settings.ownerid).avatarURL());
    } else {
        let owners = client.users.cache.get(config.settings.ownerid).username
        config.settings.subowners.forEach(sub => {
            owners+=` & ${client.users.cache.get(sub).username}`;
        });
        embed.setFooter("© "+owners, client.user.avatarURL());
    }
    embed.setTimestamp();
    message.channel.send(embed);
}

let datef = function datef(date) {
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
}

let daten = function daten(date) {
    let d = new Date(date);

    let msecond = 1;
    let second = msecond * 1000;
    let minute = second * 60;
    let hour = minute * 60;
    let day = hour * 24;
    let year = day * 365.25;


    let yearsa = Math.floor(d / year);
    let daysa = Math.floor((d % year) / day);
    let hoursa = Math.floor((d % day) / hour);
    let minsa = Math.floor((d % hour) / minute);
    let secsa = Math.floor((d % minute) / second);
    let msecsa = Math.floor((d % second) / msecond);

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

}

let time = function time(number) {

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

    let timea = `00:00`;
    if (hoursa <= 0) {
        timea = `${minsa}:${secsa}`;
    } else {
        timea = `${hoursa}:${minsa}:${secsa}`;
    }

    return timea;
}

let requester = async function requester(web, auth, type, authName = "Authorization", meth = 'GET', bodify = false) {
    if (bodify) {
        let params = new URLSearchParams();
        params.append(bodify[0], bodify[1]);
        try {
            let response = await fetch(web, {
                method: meth,
                headers: {
                    [authName]: auth
                },
                body: params
            })
            odp = await res(response, type)
            return odp;
        } catch (error) {
            console.log(error)
        }
    } else {
        try {
            let response = await fetch(web, {
                method: meth,
                headers: {
                    [authName]: auth
                }
            })
            odp = await res(response, type)
            return odp;
        } catch (error) {
            console.log(error)
        }
    }
}

function res(response, type) {
    if (type == "text") {
        return odp = response.text();
    } else if (type == "buffer") {
        return odp = response.buffer();
    } else if (type == "raw") {
        return odp = response;
    } else {
        return odp = response.json();
    }
}

let badoszapiimage = async function badoszapiimage(message, args, imagg, suf, us) {
    if (await blockCheck(codename(__dirname), message)) return;
    let i = Math.floor(Math.random() * config.c.length);
    let ce = config.c[i];
    if (cooldown.has(message.author.id)) {
        message.channel.send(`Wait 5 seconds`);
    } else {
        let response = await requester(`http://obrazium.com/v1/${imagg}`, config.tokens.badosz, "buffer");
        let embed = new Discord.MessageEmbed();
        embed.attachFiles([{
            attachment: response,
            name: "content." + suf
        }]);
        embed.setTitle(imagg.charAt(0).toUpperCase() + imagg.slice(1));
        if (us) {
            let user = await searchUser(message, args[0]);
            embed.setDescription(`${message.member} ${us} ${user}`);
        }
        embed.setImage("attachment://content." + suf);
        embed.setColor(ce);
        embed.setFooter("obrazium.com");
        message.channel.send(embed);
        cooldown.add(message.author.id);
        setTimeout(() => {
            cooldown.delete(message.author.id);
        }, 5000);
    }
}

let blockCheck = async function blockCheck(type, message) {
    let discatgui = await db.get("guilds", message.guild.id, "disabledCategory");
    let discatuse = await db.get("users", message.author.id, "disabledCategory");
    if (discatgui.includes(type)) {
        message.channel.send("Server blocked this category");
        return true;
    } else if (discatuse.includes(type)) {
        message.channel.send("You blocked this category");
        return true;
    } else {
        return false;
    }
}

let codename = function codename(name) {
    let names = require("../client/names.json").codenames;
    return names[path.basename(path.resolve(name, ''))];
}


module.exports.test = test;
module.exports.searchUser = searchUser;
module.exports.polskieliterytoblad = polskieliterytoblad;
module.exports.gban = gban;
module.exports.datef = datef;
module.exports.daten = daten;
module.exports.time = time;
module.exports.requester = requester;
module.exports.badoszapiimage = badoszapiimage;
module.exports.blockCheck = blockCheck;
module.exports.codename = codename;