let channelSelectionIndicator = document.getElementById("channelSelectionIndicator");
let channelSelection = document.getElementById("channelSelection");
let browserVideo = document.getElementById("browserVideo");
let openArrow = document.getElementById("openArrow");

let channelSelectionVisible = false;

// HOVER EFFECTS
channelSelectionIndicator.addEventListener("mouseover", function () {
    if (!channelSelectionVisible) {
        channelSelection.style.left = "99vw";
        channelSelectionIndicator.style.right = "-1vw";
    }
})

channelSelectionIndicator.addEventListener("mouseout", function () {
    if (!channelSelectionVisible) {
        channelSelection.style.left = "100vw";
        channelSelectionIndicator.style.right = "-2.5vw";
    }
})

// CLICK
channelSelectionIndicator.addEventListener("click", function () {
    if (channelSelectionVisible) {
        channelSelectionVisible = false;
        channelSelection.style.left = "100vw";
        channelSelectionIndicator.style.right = "-2.5vw";
        browserVideo.style.width = "100vw";
        openArrow.style.transform = "rotate(0)";
    } else {
        channelSelectionVisible = true;
        channelSelection.style.left = "80vw";
        channelSelectionIndicator.style.right = "17.5vw";
        browserVideo.style.width = "80vw";
        openArrow.style.transform = "rotate(180deg)";
    }
})