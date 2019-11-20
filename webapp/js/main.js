let stream = document.getElementById("browserVideo");

let channelSelectionIndicator = document.getElementById("channelSelectionIndicator");
let channelSelection = document.getElementById("channelSelection");
let browserVideo = document.getElementById("browserVideo");
let openArrow = document.getElementById("openArrow");
let configIcon = document.getElementById("configIcon");
let channelElements = document.getElementsByClassName("channel");
let channelSelectionVisible = false;
let activeChannelId = 0;
let timeOut;
let fullscreenOpen = false;

let channelNames = [
    "Image 1", 
    "Image 2", 
    "IP Camera 1", 
    "IP Camera 2"
];
let channelIds = [
    "img/placeholder.jpg", 
    "img/placeholder.png", 
    "http://172.17.209.28:8080/video", 
    "http://10.0.0.16:8080/video"
];

// HOVER EFFECTS
channelSelectionIndicator.addEventListener("mouseover", function () {
    if (!channelSelectionVisible) {
        channelSelection.style.right = "-19.5vw";
        channelSelectionIndicator.style.right = "-0.5vw";
    }
});

channelSelectionIndicator.addEventListener("mouseout", function () {
    if (!channelSelectionVisible) {
        channelSelection.style.right = "-20vw";
        channelSelectionIndicator.style.right = "-1.5vw";
    }
});

// CLICK
channelSelectionIndicator.addEventListener("click", function () {
    if (channelSelectionVisible) {
        closeChannelSelection();
    } else {
        openChannelSelection();
    }
});

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
    clearTimeout(timeOut);
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

    document.getElementById(activeChannelId).classList.remove("activeChannel");
    activeChannelId = streamId;
    document.getElementById(activeChannelId).classList.add("activeChannel");

    stream.src = channelIds[streamId];
}

// hide Controls and cursor when mouse is inactive
browserVideo.addEventListener("mousemove", function() {
    window.addEventListener("mousemove", function() {
            clearTimeout(timeOut);
            channelSelectionIndicator.style.opacity = 1;
            channelSelection.style.opacity = 1;
            browserVideo.style.cursor = "inherit";
            configIcon.style.opacity = 1;
        if(!channelSelectionVisible){    
            timeOut = setTimeout(function() {
                channelSelectionIndicator.style.opacity = 0;
                channelSelection.style.opacity = 0;
                browserVideo.style.cursor = "none";
                configIcon.style.opacity = 0;
            }, 3000)
        }
    })
});

// Press F to enter Full screen
window.addEventListener("keydown", function(event){
    if(event.keyCode === 70){
        if (fullscreenOpen) {
            closeFullscreen();
            fullscreenOpen = false;
        } else {
            openFullscreen(document.body);
            fullscreenOpen = true;
        }
    }
})

function openFullscreen(elem) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
      elem.msRequestFullscreen();
    }
  }

  function closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
      document.msExitFullscreen();
    }
  }
