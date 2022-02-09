function drops() {
    document.getElementById("mainDropdown").classList.toggle("show");
}

window.addEventListener("click", (event) => {
    if (!event.target.matches(".tucz")) {
        let dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains("show")) {
                openDropdown.classList.remove("show");
            }
        }
    }
    if (event.target.matches("select.tucz")) {
        if (event.path) {
            event.path[1].classList.toggle("arrowChangeNavbar");
        }
    } else {
        if (document.getElementById("langNavbar").classList.contains("arrowChangeNavbar")) {
            document.getElementById("langNavbar").classList.remove("arrowChangeNavbar");
        }
        if (document.getElementById("themeNavbar").classList.contains("arrowChangeNavbar")) {
            document.getElementById("themeNavbar").classList.remove("arrowChangeNavbar");
        }
    }
});
//
// function locLang(valu) {
//     if (valu === "default") {
//         delCookie("lang");
//     } else {
//         setCookie("lang", valu, 365);
//     }
//     window.location.reload(true);
// }