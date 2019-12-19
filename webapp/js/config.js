var activePage = document.getElementById("dashboard");
var activePageButton = document.getElementById("dashboardButton");

function changeSettingPage (page) {
    activePage.style.display = "none";
    activePageButton.classList.remove("activeSetting");

    activePage = document.getElementById(page);
    activePageButton = document.getElementById(page + "Button");

    activePage.style.display = "block";
    activePageButton.classList.add("activeSetting");
}