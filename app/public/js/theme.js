let body = document.body;
let theme = localStorage.getItem("theme");
lista = ["light","dark"];

if (lista.includes(theme)) {
    body.classList.remove(body.classList.item(0));
    body.classList.add(theme);
} else {
    body.classList.remove(body.classList.item(0));
    body.classList.add("light");
    localStorage.setItem("theme", "light");
}

if (theme == "dark") {
    document.getElementById('checkDark').checked = true;
}

function saveusetheme() {
    let thm = "light";
    if (localStorage.getItem("theme") == 'light') {
        thm = 'dark';
    } else {
        thm = 'light';
    }
    body.classList.remove(body.classList.item(0));
    body.classList.add(thm)
    localStorage.setItem("theme", thm);
}
