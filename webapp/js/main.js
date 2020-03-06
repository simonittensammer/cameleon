let stream = document.getElementById("browserVideo");

let channelSelectionIndicator = document.getElementById("channelSelectionIndicator");
let channelSelection = document.getElementById("channelSelection");
let browserVideo = document.getElementById("browserVideo");
let openArrow = document.getElementById("openArrow");
let configIcon = document.getElementById("configIcon");
let tutorialFurtherConfigurations = document.getElementById("furtherConfigurations");
let tutorialAddOrSelectChannel = document.getElementById("addOrSelectChannel");
let tutorialpressF = document.getElementById("fForFullscreen");
let addChannelButton = document.getElementById("addChannelButton");
let addChannelBox = document.getElementById("addChannelBox");
let nameInput = document.getElementById("channelNameInput");
let descriptionInput = document.getElementById("channelDescriptionInput");
let ipInput = document.getElementById("channelIpInput");
let cancelButton = document.getElementById("cancel");
let saveButton = document.getElementById("save");
let channelElements;
let channelSelectionVisible = false;
let activeChannelId = 0;
let timeOut;
let fullscreenOpen = true;
let welcomePageIsOpen = true;
let addChannelBoxIsOpen = false;

var channelNames = [];
var channelUrls = [];
var channelDescriptions = [];
/*
let channelNames = [
    "Image 1", 
    "Image 2", 
    "IP Camera 1", 
    "IP Camera 2"
];
let channelUrls = [
    "http://192.168.1.174:80/mjpegstream.cgi?-chn=12&usr=cameleon&pwd=videostream", 
    "http://192.168.1.121:8080/video", 
    "http://192.168.1.174:80/cgi-bin/hi3510/mjpegstream.cgi?-chn=11&-usr=cameleon&-pwd=videostream", 
    "http://192.168.1.137:8080/video"
];
let channelDescriptions = [
    "Image No. 1", 
    "Image No. 2", 
    "IP Camera No. 1", 
    "IP Camera No. 2"
];
*/

let channels = [];

const socket = io();

socket.on('join', data => {
    console.log(data);
    channels = data;
    generateChannelSelectors();
    socket.emit('joined');
})

socket.on('image', (image) => {
    const imageElm = document.getElementById("browserVideo");
    imageElm.src = `data:image/jpeg;base64,${image}`;
});

socket.on('stream-change-error', () => {
    browserVideo.style.opacity = 0;
})

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

// HIDE TUTORIAL
function hideTutorial() {
    tutorialAddOrSelectChannel.style.opacity = 0;
    tutorialFurtherConfigurations.style.opacity = 0;
    tutorialpressF.style.opacity = 0;
}

function showTutorial() {
    tutorialAddOrSelectChannel.style.opacity = 1;
    tutorialFurtherConfigurations.style.opacity = 1;
    tutorialpressF.style.opacity = 1;
}

// OPEN AND CLOSE CHANNEL SELECTION
channelSelectionIndicator.addEventListener("click", function () {
    if (channelSelectionVisible) {
        closeChannelSelection();
    } else {
        openChannelSelection();
    }
});

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

// GENERATE CHANNEL SELECTORS
function generateChannelSelectors() {
    document.getElementById("channelWrapper").innerHTML = "";
    for (let i = 0; i < channels.length; i++) {
        document.getElementById("channelWrapper").innerHTML +=  "<div id='" + i + "' class='channel'>" +
                                                                "<h2>" + channels[i].name + "</h2>" +
                                                                "<p class='channelDescriptions'><nobr>" + channels[i].desc + "</nobr></p>" +
                                                                "</div>";
    }

    channelElements = document.getElementsByClassName("channel");
    
    for (let i = 0; i < channelElements.length; i++) {
        channelElements[i].addEventListener("click", function(){
            selectChannel(this.id);
        });
    }
}

// Select Channel
function selectChannel(streamId) {
    welcomePageIsOpen = false;
    hideTutorial();
    closeChannelSelection();

    browserVideo.style.opacity = 100;
    document.getElementById(activeChannelId).classList.remove("activeChannel");
    activeChannelId = streamId;
    document.getElementById(activeChannelId).classList.add("activeChannel");

    socket.emit('change-stream', streamId);
}

function selectChannelCallback() {

}

// HIDE CONTROLLS AND CURSOR
browserVideo.addEventListener("mousemove", function() {
    window.addEventListener("mousemove", function() {
            clearTimeout(timeOut);
            channelSelectionIndicator.style.opacity = 1;
            channelSelection.style.opacity = 1;
            browserVideo.style.cursor = "inherit";
            configIcon.style.opacity = 1;
            if (welcomePageIsOpen) {
                showTutorial();
            }
        if(!channelSelectionVisible){    
            timeOut = setTimeout(function() {
                channelSelectionIndicator.style.opacity = 0;
                channelSelection.style.opacity = 0;
                browserVideo.style.cursor = "none";
                configIcon.style.opacity = 0;
                if (welcomePageIsOpen) {
                    hideTutorial();
                }
            }, 3000)
        }
    })
});

// PRESS F TO ENTER FULL SCREEN
window.addEventListener("keydown", function(event){
    if(event.keyCode === 70 && !addChannelBoxIsOpen){
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

// ADD CHANNEL
addChannelButton.addEventListener("click", toggleAddChannelBox);
cancelButton.addEventListener("click", toggleAddChannelBox);
saveButton.addEventListener("click", addChannel);

function addChannel() {
   /* channelNames[channelNames.length] = nameInput.value;
    channelDescriptions[channelDescriptions.length] = descriptionInput.value;
    channelUrls[channelUrls.length] = ipInput.value;*/

   /* channels[channels.length].name = nameInput.value;
    channels[channels.length].desc = descriptionInput.value;
    channels[channels.length].ip = ipInput.value;*/

    const data = {
        "id": channels.length,
        "name": nameInput.value,
        "desc": descriptionInput.value,
        "url":  ipInput.value
    }

    channels.push(data);

    generateChannelSelectors();
    toggleAddChannelBox();

    socket.emit('add-channel', data);

    //location.reload();
}

function toggleAddChannelBox() {
    if(addChannelBoxIsOpen) {
        addChannelBox.style.display = "none";
        addChannelBoxIsOpen = false;
    } else {
        addChannelBox.style.display = "block";
        addChannelBoxIsOpen = true;
    }
}
