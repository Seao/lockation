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
  // Important for asynchrounous responses
  return true;
});
