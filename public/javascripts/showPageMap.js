try{

    const latitude = tourSpot.coordinates[0];
    const longitude = tourSpot.coordinates[1];
    
    let darkMode = false; // Initially set to normal mode
    
    // Initialize the map
    const map = L.map('map').setView([latitude, longitude], 5);
    
    // Dark mode tile layer
    const darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19
});

// Normal mode tile layer
const normalLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);  // Add the normal layer to the map by default

// Create the popup content
const popupContent = `<h4>${tourSpot.title}</h4>  <p class="text-center">${tourSpot.location}</p>  `;



// Add a marker with popup on hover
const marker = L.marker([latitude, longitude])
.addTo(map)
.bindPopup(popupContent);

// Open popup on mouseover event
marker.on('mouseover', function() {
    this.openPopup();
});

// Close popup on mouseout event
marker.on('mouseout', function() {
    this.closePopup();
});

// Function to toggle map theme
function toggleMapTheme() {
    if (darkMode) {
        map.removeLayer(darkLayer);
        normalLayer.addTo(map);
    } else {
        map.removeLayer(normalLayer);
        darkLayer.addTo(map);
    }
    darkMode = !darkMode;
    updateSwitchLabel();
}

// Function to update switch label text and color
function updateSwitchLabel() {
    const switchButton = document.getElementById('themeSwitch');
    if (darkMode) {
        switchButton.innerText = 'Light';
        switchButton.classList.remove('btn-dark');
        switchButton.classList.add('btn-light');
    } else {
        switchButton.innerText = 'Dark';
        switchButton.classList.remove('btn-light');
        switchButton.classList.add('btn-dark');
    }
}

// Add Bootstrap-styled switch button to toggle between dark and normal map modes
const switchControl = L.control({ position: 'bottomright' });

switchControl.onAdd = function(map) {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
    const switchButton = L.DomUtil.create('button', 'btn btn-transparent rounded-pill', container);
    switchButton.id = 'themeSwitch';
    switchButton.innerText = 'Dark';  // Initial text is 'Dark' since the default mode is normal
    switchButton.onclick = function() {
        toggleMapTheme();
    };
    return container;
};

switchControl.addTo(map);

// Initialize switch label
updateSwitchLabel();
}catch(e){
    console.log(e);
}
