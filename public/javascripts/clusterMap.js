// Initialize the map
const map = L.map('cluster-map').setView([28.6139, 77.2090], 4); // Set the initial center and zoom level

let darkMode = true; // Initially set to normal mode

// Dark mode tile layer
const darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19
}).addTo(map); ;

// Normal mode tile layer
const normalLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}); // Add the normal layer to the map by default

// Initialize marker cluster group
const markers = L.markerClusterGroup();

// Add markers to the marker cluster group
tourSpots.forEach(tourSpot => {
    const marker = L.marker(tourSpot.coordinates);

    let popupContent = `<h6 class="text-center">${tourSpot.title}</h6><p class="text-center">${tourSpot.location}</p>`;
    if(tourSpot.reviews.length>0){

        popupContent = `<h6 class="text-center">${tourSpot.title}</h6>
        <div class="card-title d-flex justify-content-between gap-3 align-items-center">
            <div class="d-flex justify-content-between gap-3 align-items-center">
                <div><strong class="fs-5">${ Math.floor((tourSpot.totalRating * 10) / tourSpot.reviews.length) / 10 }</strong></div>
                <p class="starability-result m-0" data-rating="${ Math.round(tourSpot.totalRating / tourSpot.reviews.length) }"></p>
                <p class="fs-5 m-0">(${ tourSpot.reviews.length })</p>
            </div>
        </div>
        <p class="text-center">${tourSpot.location}</p>`;
    }
    // Add popup to each marker
    marker.bindPopup(popupContent, {
        closeButton: false,
        closeOnClick: false,
        className: darkMode ? 'dark-popup' : ''
    });

    // Show popup on hover
    marker.on('mouseover', function(e) {
        this.openPopup();
    });

    // Hide popup when not hovering
    marker.on('mouseout', function(e) {
        this.closePopup();
    });

    marker.on('click', function() {
        window.open(`/tourSpots/${tourSpot._id}`, '_blank'); // Open the link in a new browser tab
    });

    markers.addLayer(marker);
});

// Add marker cluster group to the map
map.addLayer(markers);

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
    updatePopups();
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

// Function to update popup styles
function updatePopups() {
    markers.eachLayer(function(marker) {
        marker.getPopup().options.className = darkMode ? 'dark-popup' : '';
        marker.closePopup();
    });
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

// Custom CSS for dark-themed popup
const darkPopupStyle = `
    .dark-popup .leaflet-popup-content-wrapper {
        background-color: #333;
        color: #fff;
    }
`;

// Add custom style to the head of the document
const style = document.createElement('style');
style.innerHTML = darkPopupStyle;
document.head.appendChild(style);
