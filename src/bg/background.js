// Message Passing
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Geolocation
  if(request.req == 'geolocation') {
    navigator.geolocation.getCurrentPosition((position) => {
      // Position retrieved
      sendResponse({
        position: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
      });
    }, (err) => {
      // Error thrown
      sendResponse({
        position: {}
      });
    }, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
  }
  // GET
  if(request.req == 'get' && request.params) {
    // Settings
    if(request.params.target == 'settings') {
      chrome.storage.sync.get(['settings'], (stored) => {
        // Default settings
        var settings = {
          'activated': true,
          'distance': 1000
        }
        // Overwrite if necessaray
        if(Object.keys(stored).length != 0) {
          settings = stored.settings;
        }
        // Reponse
        if(request.params.property) {
          sendResponse(settings[property]);
        } else {
          sendResponse(settings);
        }
      });
    }
  }
  // SET
  if(request.req == 'set' && request.params) {
    // settings
    if(request.params.target == 'settings' && request.params.value) {
      chrome.storage.sync.set({
        'settings': request.params.value
      }, () => {
        sendResponse(true);
      });
    }
  }
  // Important for asynchrounous responses
  return true;
});
