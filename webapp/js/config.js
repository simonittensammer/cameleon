
// # ELEMENTS #

let activePage = document.getElementById('dashboard');
let activePageButton = document.getElementById('dashboard-button');
let imagePreview = document.getElementById('place-image-preview');
let channelSelect = document.getElementById('channel-select');
let channelSelectOptions;
let selectedChannelHeadline = document.getElementById('selected-channel');
let objectSelect = document.getElementById('object-select');
let xInput = document.getElementById('x-input');
let yInput = document.getElementById('y-input');
let scaleInput = document.getElementById('scale-input');
let textInput = document.getElementById('text-input');
let imageInput = document.getElementById('image-input');
let colorInput = document.getElementById('color-input');
let opacityInput = document.getElementById('opacity-input');
let saveObjectsButton = document.getElementById('save-objects-button');




// # VARIABLES #

let channels = [];
let currentChannel;

let overlayObjects = [];

let objects = document.querySelectorAll('.overlay-object');
let selectedObject = null;
let grabbedObject = null;



// # CODE #

// simulated data from db
// overlayObjects.push(
//     {
//         'channelId': '1',
//         'id': 0,
//         'type': 'txt',
//         'x': 0,
//         'y': 0,
//         'scale': 1,
//         'color': '#000000',
//         'opacity': 1,
//         'text': 'Hello World',
//         'dataURL': '',
//         'imageName' : ''
//     },
//     {
//         'channelId': '1',
//         'id': 1,
//         'type': 'txt',
//         'x': 25,
//         'y': 25,
//         'scale': 2,
//         'color': '#aaaaaa',
//         'opacity': 1,
//         'text': 'Hello Cameleon',
//         'dataURL': '',
//         'imageName' : ''
//     },
//     {
//         'channelId': '2',
//         'id': 2,
//         'type': 'img',
//         'x': 50,
//         'y': 50,
//         'scale': 1.5,
//         'color': '',
//         'opacity': 0.5,
//         'dataURL': 'https://img.icons8.com/ios/500/no-image.png',
//         'imageName': 'image.png'
//     }
// )



// # SOCKET #

const socket = io();

socket.on('join', data => {
    console.log(data);

    data.cams.forEach(channel => {
        channels[channel.id] = channel;
    });

    channels.forEach(channel => {
        let channelOption = document.createElement('option');
        channelOption.value = channel.name;
        channelOption.innerText = channel.name;
        channelOption.id = 'channel-option-' + channel.id;
        channelSelect.appendChild(channelOption);
    });

    data.overlayObjects.forEach(overlayObject => {
        overlayObjects[overlayObject.id] = overlayObject;
    });

    channelSelectOptions = channelSelect.querySelectorAll('option');

    addEventListeners();

    socket.emit('joined');
});


// PERSIST AN OVERLAY-OBJECT

function persistOverlayObject(overlayObject) {
    socket.emit('add-overlay-object', overlayObject);
}


// UPDATE ALL OVERLAY-OBJECTS

function updateOverlayObjects() {
    socket.emit('update-overlay-objects', overlayObjects);
}



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
            selectedObject.querySelector('.selection-box').classList.remove('selected');
        }
        selectedObject = null;
        setInputValues('', '');
        scaleInput.value = '';
        textInput.value = '';
        imageInput.value = '';
        colorInput.value = '#000000';
        opacityInput.value = '';
        toggleValueInputs(true);
        
    } else {
        if(selectedObject != null) {
            selectedObject.querySelector('.selection-box').classList.remove('selected');
        }
        selectedObject = element;
        selectedObject.querySelector('.selection-box').classList.add('selected');

        let overlayObject = overlayObjects[selectedObject.id.replace('overlay-object-', '')];

        setInputValues(overlayObject.x, overlayObject.y);
        scaleInput.value = overlayObject.scale;   
        opacityInput.value = overlayObject.opacity;
    
        if(overlayObject.type === 'txt') {
            textInput.value = overlayObject.text; 
            colorInput.value = overlayObject.color;
            imageInput.value = '';
        } else if(overlayObject.type === 'img') {
            textInput.value = ''; 
            colorInput.value = '#000000';
            //imageInput.value = overlayObject.imageName;
        }
           
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

    if(disabled) {
        textInput.disabled = disabled;
        imageInput.disabled = disabled;
        colorInput.disabled = disabled;
        opacityInput.disabled = disabled;
    } else {
        if(overlayObjects[selectedObject.id.replace('overlay-object-', '')].type === 'txt') {
            textInput.disabled = disabled;
            colorInput.disabled = disabled;
            opacityInput.disabled = disabled;
            imageInput.disabled = true;
        } else if(overlayObjects[selectedObject.id.replace('overlay-object-', '')].type === 'img') {
            imageInput.disabled = disabled;
            opacityInput.disabled = disabled;
            textInput.disabled = true;
            colorInput.disabled = true;
        } 
    }
}


// ADD OBJECT

function addObject(channelId, id, type, x, y, scale, color, opacity, text, dataURL, persist) {

    let object;
    
    if(type === 'txt') {
        object = document.createElement('div');
        object.classList.add('text-object');
        object.innerHTML = '<span>' + text + '</span>';
        object.querySelector('span').style.color = color;
        object.querySelector('span').style.opacity = opacity;

        if(persist) {
            overlayObjects.push(
                {
                    'channelId': channelId,
                    'id': id,
                    'type': 'txt',
                    'x': x,
                    'y': y,
                    'scale': scale,
                    'color': color,
                    'opacity': opacity,
                    'text': text,
                    'dataURL': '',
                    'imageName' : ''
                }
            );
        }
    }

    if(type === 'img') {
        object = document.createElement('div');
        img = document.createElement('img');
        object.classList.add('image-object');
        img.src = dataURL; 
        object.appendChild(img);
        object.querySelector('img').style.opacity = opacity;

        if(persist) {
            overlayObjects.push(
                {
                    'channelId': channelId,
                    'id': id,
                    'type': 'img',
                    'x': x,
                    'y': y,
                    'scale': scale,
                    'color': '',
                    'opacity': opacity,
                    'text': '',
                    'dataURL': dataURL,
                    'imageName': ''
                }
            );
        }
    }

    object.id = 'overlay-object-' + id;

    object.classList.add('overlay-object');
    
    object.style.left = x + '%';
    object.style.top = y + '%';
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

    let selectionBox = document.createElement('div');
    selectionBox.classList.add('selection-box');

    object.appendChild(selectionBox);
    imagePreview.appendChild(object);

    if(persist) {
        persistOverlayObject(overlayObjects[id]);
    }
}

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}


// ADD EVENT LISTENERS

function addEventListeners() {

// CHANNEL SELECTOR ON CHANGE

channelSelect.addEventListener('change', (event) => {
    selectedChannelHeadline.innerText = event.target.value;   

    let channelId = event.target.options[event.target.options.selectedIndex].id.replace('channel-option-', ''); 
    currentChannel =  channels[channelId];

    setSelected(null);
    imagePreview.innerHTML = '';

    overlayObjects.forEach(overlayObject => {
        if(overlayObject.channelId === channelId) {         
            addObject(
                overlayObject.channelId,
                overlayObject.id,
                overlayObject.type,
                overlayObject.x,
                overlayObject.y,
                overlayObject.scale,
                overlayObject.color,
                overlayObject.opacity,
                overlayObject.text,
                overlayObject.dataURL,
                false
            );
        }
    });
        

    objectSelect.disabled = false;
});


// OBJECT SELECTOR ON CHANGE 

objectSelect.addEventListener('change', (event) => {
    addObject(
        currentChannel.id,
        overlayObjects.length,
        event.target.value,
        50,
        50,
        1,
        '#000000',
        1,
        'Text Object',
        'https://img.icons8.com/ios/500/no-image.png',
        true
    );
    event.target.value = 'default';
});


// IMAGE PREVIEW ON MOUSE MOVE

imagePreview.addEventListener('mousemove', (event) => {  
    if(grabbedObject != null) {
        let relativeMovementX =  event.movementX / imagePreview.clientWidth * 100;
        let relativeMovementY =  event.movementY / imagePreview.clientHeight * 100;

        let left;
        let top;

        if(grabbedObject.style.left != '') {
            left = parseFloat(grabbedObject.style.left.replace('%', '')) + relativeMovementX;
        } else {
            left = relativeMovementX;
        }
        if(grabbedObject.style.top != '') {
            top = parseFloat(grabbedObject.style.top.replace('%', '')) + relativeMovementY;
        } else {
            top = relativeMovementY;
        }
        
        setInputValues(left, top);

        let overlayObject = overlayObjects[selectedObject.id.replace('overlay-object-', '')];
        overlayObject.x = left;
        overlayObject.y = top;

        grabbedObject.style.left = left + "%";
        grabbedObject.style.top = top + "%";          
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
    selectedObject.style.left = event.target.value + '%';

    let overlayObject = overlayObjects[selectedObject.id.replace('overlay-object-', '')];
    overlayObject.x = event.target.value;
});


// Y-INPUT ON CHANGE

yInput.addEventListener('change', (event) => {
    selectedObject.style.top = event.target.value + '%';

    let overlayObject = overlayObjects[selectedObject.id.replace('overlay-object-', '')];
    overlayObject.y = event.target.value;
});


// SCALE-INPUT ON CHANGE

scaleInput.addEventListener('change', (event) => {
    selectedObject.style.transform = 'scale(' + event.target.value + ')';
    selectedObject.querySelector('.selection-box').style.outline = 'lightseagreen solid ' + 2/event.target.value + 'px';

    let overlayObject = overlayObjects[selectedObject.id.replace('overlay-object-', '')];
    overlayObject.scale = event.target.value;
});


// TEXT-INPUT ON CHANGE

textInput.addEventListener('change', (event) => {
    selectedObject.querySelector('span').innerText = event.target.value;

    let overlayObject = overlayObjects[selectedObject.id.replace('overlay-object-', '')];
    overlayObject.text = event.target.value;
});


// IMAGE-INPUT ON CHANGE

imageInput.addEventListener('change', async (event) => {
    let file = event.target.files[0];
    let dataURL = await getBase64(file);
    selectedObject.querySelector('img').src = dataURL;

    let overlayObject = overlayObjects[selectedObject.id.replace('overlay-object-', '')];
    overlayObject.dataURL = dataURL;

    if(event.target.value.includes('\\')) {
        overlayObject.imageName = event.target.value.split('\\')[event.target.value.split('\\').length - 1];
    } else {
        overlayObject.imageName = event.target.value.split('/')[event.target.value.split('/').length - 1];
    }
});


// COLOR-INPUT ON CHANGE

colorInput.addEventListener('change', (event) => {
    selectedObject.querySelector('span').style.color = event.target.value;

    let overlayObject = overlayObjects[selectedObject.id.replace('overlay-object-', '')];
    overlayObject.color = event.target.value;
});


// OPACITY-INPUT ON CHANGE

opacityInput.addEventListener('change', (event) => {
    
    let overlayObject = overlayObjects[selectedObject.id.replace('overlay-object-', '')];

    if(overlayObject.type === 'txt') {
        selectedObject.querySelector('span').style.opacity = event.target.value;
    } else if(overlayObject.type === 'img') {
        selectedObject.querySelector('img').style.opacity = event.target.value;
    }

    overlayObject.opacity = event.target.value;
});


// SAVE-OBJECTS-BUTTON ON CLICK

saveObjectsButton.addEventListener('click', () => {
    updateOverlayObjects();
});
}
