chrome.runtime.onMessage.addListener(function (response, sendResponse) {
  document.querySelector('body').style.filter =
    response.data.value == 100 && !response.data.night
      ? ''
      : `brightness(${response.data.value}%) sepia(${
          response.data.night ? '50' : '0'
        }%)`;
});
