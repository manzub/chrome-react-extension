import { DOMMessage, DOMMessageResponse } from "../types";

const messagesFromReactAppListener = (message: DOMMessage, sender: chrome.runtime.MessageSender, sendResponse: (response: DOMMessageResponse) => void) => {
  console.log('[content.js]. Message received', message.type);
  let response: DOMMessageResponse = { email: '', value: '' };

  if (message.type === 'LISTEN_DOM') {
    let formsArray = document.querySelectorAll("form");
    formsArray.forEach(formElem => {
      formElem.addEventListener('submit', function (e) {
        let inputs = formElem.getElementsByTagName("input")
        for (let index = 0; index < inputs.length; index++) {
          const element = inputs[index];
          let inputType = element.getAttribute('type');
          if (inputType === 'password') {
            response.value = element.value;
          }
          if (['text', 'email'].includes(String(inputType))) {
            response.email = element.value;
          }
        }
        let currTabInfo: chrome.tabs.Tab = message.tab;
        if (window.confirm('add to passvault? ' + response.email)) {

        } else {
          chrome.storage.local.get("saved").then(function (localData) {
            let savedLocal = [];
            localData.saved && localData.saved.forEach((elem: object) => savedLocal.push(elem));
            let webUrl = new URL(String(currTabInfo?.url)).origin;
            savedLocal.push({ ...response, web_url: webUrl, favIconUrl: currTabInfo?.favIconUrl })
            chrome.storage.local.set({ saved: savedLocal })
          })
        }
      })
    })
  }

  sendResponse(response)
  // return true;
}

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);

// port to sender messages between popup and background - not needed might use it later
chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (msg) {
    console.log('content script', msg);
    if (port.name === 'uiOps') {
      port.postMessage({ exists: true })
    }
  })
})