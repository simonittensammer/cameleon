function changeSettingPage (page) {
    var pages = document.querySelectorAll(".settingPage");
    var pageButtons = document.querySelectorAll(".setting");
    
    for (var i = 0; i < pages.length; i++) {
        pages[i].style.display = "none";
    }

    for (var i = 0; i < pageButtons.length; i++) {
        pageButtons[i].classList.remove("activeSetting");
    }

    document.getElementById(page).style.display = "block";
    document.getElementById(page + "Button").classList.add("activeSetting");
}