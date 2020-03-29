let activePage = document.getElementById('dashboard');
let activePageButton = document.getElementById('dashboard-button');
let imagePreview = document.getElementById('place-image-preview');
let channelSelect = document.getElementById('channel-select');
let selectedChannelHeadline = document.getElementById('selected-channel');
let objectSelect = document.getElementById('object-select');

const socket = io();

let channels;
let currentChannel;

socket.on('join', data => {
    console.log(data);
    channels = data;

    for(let i = 0; i < channels.length; i++) {
        let channel = document.createElement('option');
        channel.value = channels[i].name;
        channel.innerText = channels[i].name;
        channel.id = channels[i].id;
        channelSelect.appendChild(channel);
    }

    socket.emit('joined');
});


// EVENT LISTENERS

channelSelect.addEventListener('change', (event) => {
    selectedChannelHeadline.innerText = event.target.value;
    
});

objectSelect.addEventListener('change', (event) => {
    addObject(event.target.value);
    event.target.value = 'default';
});


let objects = document.querySelectorAll('.overlay-object');
let selectedObject = null;
let grabbedObject = null;

objects.forEach(object => {
    object.addEventListener('click', (event) => {
        setSelected(event.target);
    });
});

objects.forEach(object => {
    object.addEventListener('mousedown', (event) => {
        grabbedObject = event.target;
        setSelected(event.target);
    });
});

imagePreview.addEventListener('mousemove', (event) => {  
    if(grabbedObject != null) {
        let left;
        let top;

        if(grabbedObject.style.left != '') {
            left = parseInt(grabbedObject.style.left.replace('px', '')) + event.movementX;
        } else {
            left = event.movementX;
        }
        if(grabbedObject.style.top != '') {
            top = parseInt(grabbedObject.style.top.replace('px', '')) + event.movementY;
        } else {
            top = event.movementY;
        }

        grabbedObject.style.left = left + "px";
        grabbedObject.style.top = top + "px";          
    }
});

imagePreview.addEventListener('mouseup', (event) => {  
    if(grabbedObject != null) {
        grabbedObject = null;
    }
});


function changeSettingPage(page) {
    activePage.style.display = 'none';
    activePageButton.classList.remove('active-setting');

    activePage = document.getElementById(page);
    activePageButton = document.getElementById(page + '-button');

    activePage.style.display = 'block';
    activePageButton.classList.add('active-setting');
}

function setSelected(element) {

    if(element === null) {
        if(selectedObject != null) {
            selectedObject.classList.remove('selected');
        }
        selectedObject = null;
    } else {
        if(selectedObject != null) {
            selectedObject.classList.remove('selected');
        }
        selectedObject = element;
            selectedObject.classList.add('selected');
    }
}

function addObject(type) {
    
}
