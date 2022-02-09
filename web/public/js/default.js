
// searching guild
document.getElementById("searchGuildsBox").addEventListener("input", () => {
    let inputBox = document.getElementById("searchGuildsBox").value.toLowerCase();
    let guildList = document.getElementById("listOfGuilds").getElementsByClassName("insideBox");
    for (let i = 0; i < guildList.length; i++) {
        let guildName = guildList[i].getElementsByClassName("guildName")[0];
        let nameValue = guildName.textContent || guildName.innerText;
        if (nameValue.toLowerCase().indexOf(inputBox) > -1) {
            guildList[i].style.display = "";
        } else {
            guildList[i].style.display = "none";
        }
    }
});

// focusing if you click on search box
document.getElementsByClassName("searchBox")[0].addEventListener("click", () => {
    document.getElementById("searchGuildsBox").focus();
});

// in mobile open thing
let insideBoxes = document.getElementsByClassName("insideBox");
for (let insideBox of insideBoxes) {
    insideBox.addEventListener("click", () => {
        if (window.screen.width <= 600) {
            window.location.href = insideBox.getElementsByTagName("a")[0].href;
        }
    });
}