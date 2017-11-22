// Geolocation API Overriding
function overrideGeolocation(extension) {
  if(!navigator.geolocation) return;

  // Current position
  navigator.geolocation.getCurrentPosition = (success, error, options) => {
    console.log("called 1");
  };

  navigator.geolocation.watchPosition = (success, error, options) => {
  	// Request content script for noised position
    window.postMessage({req:'noised'}, '*');
    window.addEventListener('message', (event) => {
      if(event.source != window) return;
      if(event.data.res) {
        success({
          coords:{
            latitude: parseFloat(event.data.res.latitude),
            longitude: parseFloat(event.data.res.longitude),
            altitude: 100,
            accuracy: 10,
            speed: 0
          }
        })
      }
    });
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
    // Script injection
    var inject = '(function(){ ' + overrideGeolocation + ' overrideGeolocation("' + chrome.runtime.id + '");})()';
    var script = document.createElement('script');
    script.setAttribute('id', 'lockation');
    script.appendChild(document.createTextNode(inject));
    document.documentElement.appendChild(script);
    // Event listener for bidirectionnal communication with injected script
    window.addEventListener('message', (event) => {
      if(event.source != window) return;
      if(event.data.req && (event.data.req == 'noised')) {
        chrome.runtime.sendMessage({req:'geolocation'}, function(response) {
          // Retrieve settings to add noise
          chrome.storage.sync.get(['settings'], (stored) => {
            // cf. https://stackoverflow.com/questions/7477003/calculating-new-longitude-latitude-from-old-n-meters#comment74868464_40471701
            let distance = Math.random() * (stored.settings.distance - 50) + 50;
            let coef = distance * 0.000008983;
            let noised = {
              latitude: response.position.latitude + coef * Math.cos(Math.random() * Math.PI * 2),
              longitude: response.position.longitude + coef * Math.sin(Math.random() * Math.PI * 2)
            }
            window.postMessage({res:noised}, '*');
          });
        });
      }
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
