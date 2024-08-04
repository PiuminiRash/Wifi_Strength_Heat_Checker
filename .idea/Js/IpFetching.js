let userIP = '';
let map, marker;

// Function to fetch the public IP address
async function getPublicIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        userIP = data.ip;
        document.getElementById('ipAddress').innerHTML = `Your IP Address: ${userIP}`;
    } catch (error) {
        document.getElementById('ipAddress').innerHTML = 'Error fetching IP Address.';
    }
}

// Function to fetch the user's live location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById('location').innerHTML = 'Geolocation is not supported by this browser.';
    }
}

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    initializeMap(latitude, longitude);
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById('location').innerHTML = 'User denied the request for Geolocation.';
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById('location').innerHTML = 'Location information is unavailable.';
            break;
        case error.TIMEOUT:
            document.getElementById('location').innerHTML = 'The request to get user location timed out.';
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById('location').innerHTML = 'An unknown error occurred.';
            break;
    }
}

function initializeMap(latitude, longitude) {
    map = L.map('map').setView([latitude, longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© MAP'
    }).addTo(map);

    marker = L.marker([latitude, longitude]).addTo(map)
        .bindPopup('You are here')
        .openPopup();
}

getPublicIP();
getLocation();

// Function to start the speed test
function startSpeedTest() {
    const imageAddr = 'https://4k-uhd.nl/wp-content/uploads/2018/08/4K-3840x2160-Wallpaper-Uitzicht-5.jpg';
    const downloadSize = 5739426; // Size of the test image in bytes

    document.getElementById('result').innerHTML = 'Calculating Speed ...';

    const startTime = new Date().getTime();
    const download = new Image();

    download.onload = function() {
        const endTime = new Date().getTime();
        showResults(startTime, endTime, downloadSize);
    };

    download.onerror = function() {
        document.getElementById('result').innerHTML = 'Error downloading the test image.';
    };

    const cacheBuster = '?nnn=' + startTime;
    download.src = imageAddr + cacheBuster;
}

// Function to show the results of the speed test
function showResults(startTime, endTime, downloadSize) {
    const duration = (endTime - startTime) / 1000;
    const bitsLoaded = downloadSize * 8;
    const speedBps = (bitsLoaded / duration).toFixed(2);
    const speedKbps = (speedBps / 1024).toFixed(2);
    const speedMbps = (speedKbps / 1024).toFixed(2);

    document.getElementById('result').innerHTML = `${speedMbps}`;
}


