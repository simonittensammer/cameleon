let activePage = document.getElementById('dashboard');
let activePageButton = document.getElementById('dashboard-button');
let dropdown = document.getElementById('channel-dropdown');
let dropdownButton = dropdown.querySelector('.dropdown-button');
let dropdownContent = dropdown.querySelector('.dropdown-content');
let selectedChannelHeadline = document.getElementById('selected-channel');

const socket = io();

let channels;
let currentChannel;

socket.on('join', data => {
    console.log(data);
    channels = data;

    for(let i = 0; i < channels.length; i++) {
        let channel = document.createElement('div');
        channel.id = channels[i].id;
        channel.classList.add('dropdown-channel');
        channel.innerHTML = '<span>' + channels[i].name + '</span>';
        dropdownContent.appendChild(channel);

        channel.addEventListener('click', () => {
            currentChannel = channels[i];
            selectedChannelHeadline.innerHTML = currentChannel.name;
            toggleDropdown();
        });
    }

    socket.emit('joined');
});

dropdownButton.addEventListener('click', () => {
    toggleDropdown(); 
});


function toggleDropdown() {
    dropdownContent.classList.toggle('dropdown-content-active');
    dropdownButton.classList.toggle('dropdown-button-active');
}



function changeSettingPage(page) {
    activePage.style.display = 'none';
    activePageButton.classList.remove('active-setting');

    activePage = document.getElementById(page);
    activePageButton = document.getElementById(page + '-button');

    activePage.style.display = 'block';
    activePageButton.classList.add('active-setting');
}
