let channelSelectionIndicator = document.getElementById("channelSelectionIndicator");
let channelSelection = document.getElementById("channelSelection");
let browserVideo = document.getElementById("browserVideo");
let openArrow = document.getElementById("openArrow");

let channelSelectionVisible = false;

// HOVER EFFECTS
channelSelectionIndicator.addEventListener("mouseover", function () {
    if (!channelSelectionVisible) {
        channelSelection.style.right = "-19.5vw";
        channelSelectionIndicator.style.right = "-1.5vw";
    }
})

channelSelectionIndicator.addEventListener("mouseout", function () {
    if (!channelSelectionVisible) {
        channelSelection.style.right = "-20vw";
        channelSelectionIndicator.style.right = "-2.5vw";
    }
})

// CLICK
channelSelectionIndicator.addEventListener("click", function () {
    if (channelSelectionVisible) {
        channelSelectionVisible = false;
        channelSelection.style.right = "-20vw";
        channelSelectionIndicator.style.right = "-2.5vw";
        browserVideo.style.width = "100vw";
        openArrow.style.transform = "rotate(0)";
    } else {
        channelSelectionVisible = true;
        channelSelection.style.right = "0";
        channelSelectionIndicator.style.right = "17.5vw";
        browserVideo.style.width = "80vw";
        openArrow.style.transform = "rotate(180deg)";
    }
})