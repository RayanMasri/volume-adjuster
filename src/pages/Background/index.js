var audioStates = {};
var brightnessStates = {};
window.audioStates = audioStates;
window.brightnessStates = brightnessStates;

let disable_interval = false;

// refresh all audio states interval
setInterval(() => {
  console.log(disable_interval);
  if (disable_interval) {
    console.log('disabled');
    return;
  }

  chrome.tabs.query({ active: true }, ([tab]) => {
    if (audioStates.hasOwnProperty(tab.id)) {
      if (audioStates[tab.id].volume == 1 && audioStates[tab.id].enabled) {
        audioStates[tab.id].mediaStream.getTracks()[0].stop();
      } else {
        chrome.tabCapture.capture({ audio: true, video: false }, (stream) => {
          if (chrome.runtime.lastError) return;

          registerTab(tab.id, stream, audioStates[tab.id].enabled);
          setTabVolume(
            tab.id,
            audioStates[tab.id].volume,
            audioStates[tab.id].enabled
          );
        });
      }
    }
    if (brightnessStates.hasOwnProperty(tab.id)) {
      chrome.tabs.sendMessage(tab.id, { data: brightnessStates[tab.id] });
    }
  });
}, 500);

// $("body_id").style.filter = `brightness(${current}%)`;
// document.querySelector('body').style.filter = `brightness(50%) sepia(50%)`;
// sepia 50% is night light, 0% is normal light

const enableInterval = () => {
  disable_interval = false;
  console.log('Enabled interval');
};

const disableInterval = () => {
  disable_interval = true;
  console.log('Disabled interval');
};

const registerTab = (id, stream, enabled) => {
  var context = new window.AudioContext();
  var source = context.createMediaStreamSource(stream);
  var gain = context.createGain();
  source.connect(gain);
  gain.connect(context.destination);

  audioStates[id] = {
    mediaStream: stream,
    audioContext: context,
    gainNode: gain,
    enabled: enabled,
    volume: 100,
  };
};

const setTabBrightness = (id, value, night) => {
  brightnessStates[id] = {
    value: value,
    night: night,
  };
};

const setTabVolume = (id, value, enabled) => {
  audioStates[id].volume = value / 100;
  audioStates[id].enabled = enabled;
  audioStates[id].gainNode.gain.value = audioStates[id].enabled
    ? audioStates[id].volume
    : 0;
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  let { id, action } = message;

  switch (action) {
    case 'get-gain':
      if (audioStates.hasOwnProperty(id)) {
        sendResponse({
          status: audioStates[id].enabled,
          value: audioStates[id].volume * 100,
        });
        break;
      }
      sendResponse({
        status: true,
        value: 100,
      });
      break;
    case 'get-brightness':
      if (brightnessStates.hasOwnProperty(id)) {
        sendResponse({
          status: brightnessStates[id].night,
          value: brightnessStates[id].value,
        });
        break;
      }
      sendResponse({
        status: false,
        value: 100,
      });
      break;
    case 'audio-change':
      if (!audioStates.hasOwnProperty(id)) {
        chrome.tabCapture.capture({ audio: true, video: false }, (stream) => {
          if (chrome.runtime.lastError) return;

          registerTab(id, stream, message.data.status);
          setTabVolume(id, message.data.value, message.data.status);
        });
      } else {
        setTabVolume(id, message.data.value, message.data.status);
      }
      break;
    case 'brightness-change':
      setTabBrightness(id, message.data.value, message.data.status);
      break;
  }

  // save volume
  // let object = { 'current-volume': params.sliderValue };
  // chrome.storage.local.set(object);
});

// if tab is closed
chrome.tabs.onRemoved.addListener((id) => {
  if (audioStates.hasOwnProperty(id)) {
    // if tab is registered,
    // close audioContext and delete the key
    audioStates[id].audioContext.close().then(() => {
      delete audioStates[id];
    });
  }
});
