// Geolocation API Overriding
function overrideGeolocation() {
  if(!navigator.geolocation) return;

  // Current position
  navigator.geolocation.getCurrentPosition = (success, error, options) => {
    console.log("called 1");
  };

  navigator.geolocation.watchPosition = (success, error, options) => {
  	console.log("called 2");
  };

  navigator.geolocation.clearWatch = () => {
  	console.log("called 3");
  };

  // Clean script injection
  let script = document.getElementById('lockation');
	if(script) script.remove();
}

// Verify extension activation
getSettings('activated', (value) => {
  if(value == true) {
    // Get current position before obfuscation
    chrome.runtime.sendMessage({req:'geolocation'}, function(response) {
      console.log(response.position);
      // Script injection
      var inject = "(function(){ " + overrideGeolocation + " overrideGeolocation();})()";
      var script = document.createElement('script');
      script.setAttribute('id', 'lockation');
      script.appendChild(document.createTextNode(inject));
      document.documentElement.appendChild(script);
    });
  }
});

// Functions
function getSettings(property, callback) {
  var settings = {
    "activated": true
  }
  chrome.storage.sync.get(['settings'], (stored) => {
    if(Object.keys(stored).length != 0) {
      settings = stored.settings;
    }
    callback(settings[property]);
  });
}
