// Retrieve settings
var settings = {
  'activated': true
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
});

// Functions
function triggerToogleChanges(property, element) {
  element.change(() => {
    settings[property] = element.is(":checked");
    storeSettings();
  });
}

function storeSettings() {
  console.log(settings)
  chrome.storage.sync.set({
    'settings': settings
  }, () => {
    console.log('Settings updated');
  });
}
