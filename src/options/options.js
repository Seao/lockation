var map = undefined;
var circle = undefined;

var settings = {
  'activated': true,
  'distance': 1000
}

chrome.storage.sync.get(['settings'], (stored) => {
  // Check if there is already stored settings
  if(Object.keys(stored).length != 0) {
    settings = stored.settings;
  }
  // Load settings
  if(settings.activated) {
    $('#option-extension-activated').prop('checked',true);
  } triggerToogleChanges('activated', $('#option-extension-activated'));

  if(settings.distance) {
    setDistanceSlider('distance', settings.distance);
  } triggerSliderChanges('distance', $('.step-item a'));

  // Geolocation
  navigator.geolocation.getCurrentPosition((position) => {
    map = L.map('map').setView([position.coords.latitude, position.coords.longitude], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  		maxZoom: 18,
  		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  		id: 'mapbox.streets'
  	}).addTo(map);
    // Position marker
    L.marker([position.coords.latitude, position.coords.longitude]).addTo(map).bindPopup('Votre position').openPopup();
    // Area noise
    console.log(settings.distance);
    circle = L.circle([position.coords.latitude, position.coords.longitude], settings.distance, {
  		color: 'red',
  		fillColor: '#f03',
  		fillOpacity: 0.5
  	}).addTo(map).bindPopup('Zone de bruit ajoutée');
  }, (err) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }, {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  });
});

// Triggers
function triggerToogleChanges(property, element) {
  element.change(() => {
    settings[property] = element.is(":checked");
    storeSettings();
  });
}

function triggerSliderChanges(property, element) {
  element.click((event) => {
    setDistanceSlider('distance', event.target.id);
    settings[property] = parseInt(event.target.id);
    storeSettings();
  });
}

// Utils
function setDistanceSlider(property, distance) {
  $('.step-item').removeClass('active');
  $('#' + distance.toString()).parent().addClass('active');
  // Change circle on the map if already created
  if(circle != undefined) {
    circle.setRadius(distance);
  }
}

// Storage
function storeSettings() {
  console.log(settings)
  chrome.storage.sync.set({
    'settings': settings
  }, () => {
    console.log('Settings updated');
    console.log(settings);
  });
}
