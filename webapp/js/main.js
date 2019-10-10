let stream = document.getElementById("browserVideo");

let channelSelectionIndicator = document.getElementById("channelSelectionIndicator");
let channelSelection = document.getElementById("channelSelection");
let browserVideo = document.getElementById("browserVideo");
let openArrow = document.getElementById("openArrow");

let channelSelectionVisible = false;

let timeOut;

// HOVER EFFECTS
channelSelectionIndicator.addEventListener("mouseover", function () {
    if (!channelSelectionVisible) {
        channelSelection.style.right = "-19.5vw";
        channelSelectionIndicator.style.right = "-0.5vw";
    }
})

channelSelectionIndicator.addEventListener("mouseout", function () {
    if (!channelSelectionVisible) {
        channelSelection.style.right = "-20vw";
        channelSelectionIndicator.style.right = "-1.5vw";
    }
})

// CLICK
channelSelectionIndicator.addEventListener("click", function () {
    if (channelSelectionVisible) {
        closeChannelSelection();
    } else {
        openChannelSelection();
    }
})

function openChannelSelection() {
    channelSelectionVisible = true;
    channelSelection.style.right = "0";
    channelSelectionIndicator.style.right = "18.5vw";
    browserVideo.style.width = "80vw";
    openArrow.style.transform = "rotate(180deg)";
}

function closeChannelSelection() {
    channelSelectionVisible = false;
    channelSelection.style.right = "-20vw";
    channelSelectionIndicator.style.right = "-1.5vw";
    browserVideo.style.width = "100vw";
    openArrow.style.transform = "rotate(0)";
}

// Select Channel
function selectChannel(newUrl) {
    closeChannelSelection();
    
    stream.src = newUrl;
}

// hide controlls and cursor when mouse is inactive
window.addEventListener("mousemove", function() {
        clearTimeout(timeOut);
        channelSelectionIndicator.style.opacity = 1;
        channelSelection.style.opacity = 1;
        browserVideo.style.cursor = "inherit";
    if(!channelSelectionVisible){    
        timeOut = setTimeout(function() {
            channelSelectionIndicator.style.opacity = 0;
            channelSelection.style.opacity = 0;
            browserVideo.style.cursor = "none";
        }, 3000)
    }
})