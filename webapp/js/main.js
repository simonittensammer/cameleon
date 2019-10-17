let stream = document.getElementById("browserVideo");

let channelSelectionIndicator = document.getElementById("channelSelectionIndicator");
let channelSelection = document.getElementById("channelSelection");
let browserVideo = document.getElementById("browserVideo");
let openArrow = document.getElementById("openArrow");
let channelElements = document.getElementsByClassName("channel");
let channelSelectionVisible = false;
let channels = [
    "img/placeholder.jpg", 
    "img/placeholder.png", 
    "http://172.17.209.28:8080/video", 
    "http://172.17.209.115:8080/video"
];

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

for (let i = 0; i < channelElements.length; i++) {
    channelElements[i].addEventListener("click", function(){
        selectChannel(this.id);
    });
}

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
function selectChannel(streamId) {
    closeChannelSelection();
    
    stream.src = channels[streamId];
}