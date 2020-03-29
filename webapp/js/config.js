
// # ELEMENTS #

let activePage = document.getElementById('dashboard');
let activePageButton = document.getElementById('dashboard-button');
let imagePreview = document.getElementById('place-image-preview');
let channelSelect = document.getElementById('channel-select');
let selectedChannelHeadline = document.getElementById('selected-channel');
let objectSelect = document.getElementById('object-select');
let xInput = document.getElementById('x-input');
let yInput = document.getElementById('y-input');
let scaleInput = document.getElementById('scale-input');
let textInput = document.getElementById('text-input');
let textLabel = document.getElementById('text-label');



// # VARIABLES #

let channels;
let currentChannel;

let overlayObjects = [];

let objects = document.querySelectorAll('.overlay-object');
let selectedObject = null;
let grabbedObject = null;



// # CODE #

// simulated data from db
overlayObjects.push(
    {
        'id': 0,
        'type': 'txt',
        'x': 100,
        'y': 100,
        'scale': 1,
        'text': 'Hello World'
    },
    {
        'id': 1,
        'type': 'txt',
        'x': 200,
        'y': 200,
        'scale': 2,
        'text': 'Hello Cameleon'
    },
    {
        'id': 3,
        'type': 'img',
        'x': 300,
        'y': 300,
        'scale': 0.5,
        'text': 'Hello World'
    }
)



// # SOCKET #

const socket = io();

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



// # EVENT LISTENERS #

// CHANNEL SELECTOR ON CHANGE

channelSelect.addEventListener('change', (event) => {
    selectedChannelHeadline.innerText = event.target.value;
});


// OBJECT SELECTOR ON CHANGE 

objectSelect.addEventListener('change', (event) => {
    addObject(event.target.value, 0, 0, 1, false);
    event.target.value = 'default';
});


// IMAGE PREVIEW ON MOUSE MOVE

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

        setInputValues(left, top);

        grabbedObject.style.left = left + "px";
        grabbedObject.style.top = top + "px";          
    }
    event.stopPropagation();
});


// IMAGE PREVIEW ON MOUSE UP

imagePreview.addEventListener('mouseup', (event) => {  
    if(grabbedObject != null) {
        grabbedObject = null;
    }
    event.stopPropagation();
});


// IMAGE PREVIEW ON CLICK

imagePreview.addEventListener('click', (event) => {
    setSelected(null);
    event.stopPropagation();
});


// X-INPUT ON CHANGE

xInput.addEventListener('change', (event) => {
    selectedObject.style.left = event.target.value + 'px';
});


// Y-INPUT ON CHANGE

yInput.addEventListener('change', (event) => {
    selectedObject.style.top = event.target.value + 'px';
});


// SCALE-INPUT ON CHANGE

scaleInput.addEventListener('change', (event) => {
    selectedObject.style.transform = 'scale(' + event.target.value + ')';
});


// TEXT-INPUT ON CHANGE

textInput.addEventListener('change', (event) => {
    selectedObject.innerText = event.target.value;
});



// # FUNCTIONS #

// CHANGE SETTING PAGE

function changeSettingPage(page) {
    activePage.style.display = 'none';
    activePageButton.classList.remove('active-setting');

    activePage = document.getElementById(page);
    activePageButton = document.getElementById(page + '-button');

    activePage.style.display = 'block';
    activePageButton.classList.add('active-setting');
}


// SET SELECTED

function setSelected(element) {

    if(element === null) {
        if(selectedObject != null) {
            selectedObject.classList.remove('selected');
        }
        selectedObject = null;
        setInputValues('', '');
        scaleInput.value = '';
        toggleValueInputs(true);

    } else {
        if(selectedObject != null) {
            selectedObject.classList.remove('selected');
        }
        selectedObject = element;
        selectedObject.classList.add('selected');
        setInputValues(
            selectedObject.style.left.replace('px', ''),
            selectedObject.style.top.replace('px', ''));
        scaleInput.value = selectedObject.style.transform.replace('scale(', '').replace(')', '');    
        toggleValueInputs(false);    
        
    }
}


// SET INPUT VALUES

function setInputValues(x, y) {
    xInput.value = x;
    yInput.value = y;
}


// TOGGLE VALUE INPUTS

function toggleValueInputs(disabled) {
    xInput.disabled = disabled;
    yInput.disabled = disabled;
    scaleInput.disabled = disabled;
}


// ADD OBJECT

function addObject(type, x, y, scale, persist) {
    let object;
    
    if(type === 'txt') {
        object = document.createElement('div');
        object.classList.add('text-object');
        object.innerText = 'Text Object';
    }

    object.classList.add('overlay-object');
    
    object.style.left = x + 'px';
    object.style.top = y + 'px';
    object.style.transform = 'scale(' + scale + ')';

    object.addEventListener('click', (event) => {
        setSelected(event.target);
        event.stopPropagation();
    });

    object.addEventListener('mousedown', (event) => {
        grabbedObject = event.target;
        setSelected(event.target);
        event.stopPropagation();
    });

    imagePreview.appendChild(object);

    console.log(object);
}
