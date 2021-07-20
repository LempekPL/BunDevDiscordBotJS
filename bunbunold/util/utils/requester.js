let fetch = require('node-fetch');
let {
    URLSearchParams
} = require('url');

module.exports.requester = async (web, auth, type, authName = "Authorization", meth = 'GET', bodify = false) => {
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