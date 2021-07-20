function setCookie(namez, content, expiresz) {
    let daw = new Date();
    daw.setTime(daw.getTime() + (expiresz*24*60*60*1000));
    let expiresaz = "expires="+ daw.toUTCString();
    document.cookie = namez + "=" + content + ";" + expiresaz + ";path=/";
}

function getCookie(namez) {
    let nameaz = namez + "=";
    let caxc = document.cookie.split(';');
    for (let i = 0; i < caxc.length; i++) {
        let cxc = caxc[i];
        while (cxc.charAt(0) == ' ') {
            cxc = cxc.substring(1);
        }
        if (cxc.indexOf(nameaz) == 0) {
            return cxc.substring(nameaz.length, cxc.length);
        }
    }
    return "";
}

function delCookie(namez) {
    document.cookie = namez + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
}