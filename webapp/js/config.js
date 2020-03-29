let activePage = document.getElementById('dashboard');
let activePageButton = document.getElementById('dashboard-button');
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


function changeSettingPage(page) {
    activePage.style.display = 'none';
    activePageButton.classList.remove('active-setting');

    activePage = document.getElementById(page);
    activePageButton = document.getElementById(page + '-button');

    activePage.style.display = 'block';
    activePageButton.classList.add('active-setting');
}
