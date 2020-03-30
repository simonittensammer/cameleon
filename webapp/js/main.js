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
let editChannelBox = document.getElementById("editChannelBox");
let nameInput = document.getElementById("channelNameInput");
let descriptionInput = document.getElementById("channelDescriptionInput");
let ipInput = document.getElementById("channelIpInput");
let nameInputEdit = document.getElementById("channelNameInputEdit");
let descriptionInputEdit = document.getElementById("channelDescriptionInputEdit");
let ipInputEdit = document.getElementById("channelIpInputEdit");
let cancelButton = document.getElementById("cancel");
let saveButton = document.getElementById("save");
let cancelEditButton = document.getElementById("cancelEdit");
let saveEditButton = document.getElementById("saveEdit");
let saveDeleteButton = document.getElementById("saveDelete");
let cancelDeleteButton = document.getElementById("cancelDelete");
let deleteChannelButton = document.getElementById("deleteChannelButton");
let deleteChannelBox = document.getElementById("deleteChannelVerifyBox");
let editChannelId = -1;
let channelElements;
let channelSelectionVisible = false;
let activeChannelId = 0;
let timeOut;
let fullscreenOpen = true;
let welcomePageIsOpen = true;
let addChannelBoxIsOpen = false;
let editChannelBoxIsOpen = false;
let deleteChannelBoxIsOpen = false;

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
    data.forEach(channel => {
        channels[channel.id] = channel;
    });

    let id = 0;
    while(channels[id] === undefined){
        id ++;     
    }
    activeChannelId = channels[id].id;
    
    generateChannelSelectors();
    socket.emit('joined');
})

socket.on('image', (image) => {
    const imageElm = document.getElementById("browserVideo");
    imageElm.src = `data:image/jpeg;base64,${image}`;
});

socket.on('stream-change-error', () => {
    browserVideo.style.opacity = 0;

    let errorPopup = document.createElement('div');
    errorPopup.classList.add('error-popup');
    errorPopup.innerText = 'unable to reach this stream';
    document.body.appendChild(errorPopup)
    errorPopup.addEventListener('animationend', () => {
        document.body.removeChild(errorPopup);
    });
});

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
    channels.forEach(channel => {
        document.getElementById("channelWrapper").innerHTML +=  "<div id='" + channel.id + "' class='channel'>" +
                                                                "<h2>" + channel.name + "</h2>" +
                                                                "<p class='channelDescriptions'>" + channel.desc + "</p>" +
                                                                "<img src='img/edit.png' class='channelControlIcon'>" +
                                                                "</div>";
    });

    channelElements = document.getElementsByClassName("channel");
    
    channels.forEach(channel => {
        let channelElement = document.getElementById(channel.id);
        channelElement.addEventListener("click", function(){
            selectChannel(this.id);
        });
        channelElement.addEventListener("mouseover", function(){
            if(!editChannelBoxIsOpen) {
                channelElement.querySelector(".channelControlIcon").style.opacity = .9;
            }
        });
        channelElement.addEventListener("mouseout", function(){
            channelElement.querySelector(".channelControlIcon").style.opacity = 0;
        });
        channelElement.querySelector(".channelControlIcon").addEventListener("click", (event) => {
            toggleEditChannelBox(event.target.parentNode.id);
            event.stopPropagation();
        });
    });
}

// Select Channel
function selectChannel(streamId) {
    console.log(streamId);
    
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
cancelEditButton.addEventListener("click", toggleEditChannelBox);
cancelDeleteButton.addEventListener("click", toggleDeleteChannelBox);
saveButton.addEventListener("click", addChannel);
saveEditButton.addEventListener("click", editChannel);
saveDeleteButton.addEventListener("click", deleteChannel);
deleteChannelButton.addEventListener("click", toggleDeleteChannelBox);


function addChannel() {
   /* channelNames[channelNames.length] = nameInput.value;
    channelDescriptions[channelDescriptions.length] = descriptionInput.value;
    channelUrls[channelUrls.length] = ipInput.value;*/

   /* channels[channels.length].name = nameInput.value;
    channels[channels.length].desc = descriptionInput.value;
    channels[channels.length].ip = ipInput.value;*/

    const data = {
        "id": parseInt(channels[channels.length-1].id) + 1,
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

function editChannel() {

    channels[editChannelId].name = nameInputEdit.value;
    channels[editChannelId].desc = descriptionInputEdit.value;
    channels[editChannelId].ip = ipInputEdit.value;

    const data = {
        "id": editChannelId,
        "name": nameInputEdit.value,
        "desc": descriptionInputEdit.value,
        "url":  ipInputEdit.value
    }

    toggleEditChannelBox(editChannelId);

    socket.emit('edit-channel', data);

    document.getElementById(editChannelId).querySelector("h2").innerText = nameInputEdit.value;
    document.getElementById(editChannelId).querySelector(".channelDescriptions").innerText = descriptionInputEdit.value;
}

function deleteChannel() {

    const data = {
        "id": editChannelId
    }

    socket.emit("delete-channel", data)

    deleteChannelBox.style.display = "none";
    deleteChannelBoxIsOpen = false;

    document.getElementById(editChannelId).parentNode.removeChild(document.getElementById(editChannelId));
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

function toggleEditChannelBox(id) {
    if(editChannelBoxIsOpen) {
        editChannelBox.style.display = "none";
        editChannelBoxIsOpen = false;
    } else {
        editChannelBox.style.display = "block";
        editChannelBoxIsOpen = true;

        editChannelId = id;

        nameInputEdit.value = channels[id].name;
        descriptionInputEdit.value = channels[id].desc;
        ipInputEdit.value = channels[id].ip;
    }
}

function toggleDeleteChannelBox() {
    if(deleteChannelBoxIsOpen) {     
        deleteChannelBox.style.display = "none";
        deleteChannelBoxIsOpen = false;
        toggleEditChannelBox(editChannelId);
    } else {
        deleteChannelBox.style.display = "block";
        deleteChannelBoxIsOpen = true;

        toggleEditChannelBox(editChannelId);

        deleteChannelBox.querySelector("h2").innerHTML = "Delete Channel " + channels[editChannelId].name + "?";
    }
}