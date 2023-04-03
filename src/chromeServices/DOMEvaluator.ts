import { DOMMessage, DOMMessageResponse, VaultItem } from "../types";

type CurrItem = { origin: string, pathname: string, value: string, email: string, username: string };

// TODO: fix listener
const messagesFromReactAppListener = (message: DOMMessage, sender: chrome.runtime.MessageSender, sendResponse: (response: DOMMessageResponse) => void) => {
  console.log('[content.js]. Message received', message.type);
  let response: DOMMessageResponse = { email: '', value: '', username: null };
  let currTabInfo: chrome.tabs.Tab = message.tab;
  // document.addEventListener("DOMContentLoaded", function () {
  // console.log('DOMContentLoaded');
  chrome.storage.local.get("vaultItems").then(function (result) {
    let vaultItems: VaultItem[] = result.vaultItems
    // DONE: listen for form submits
    if (message.type === 'LISTEN_DOM') {
      // new event listener
      var listenerInterval = setInterval(function () { // interval to check page updates and listener
        try {
          let currItem: CurrItem = JSON.parse((sessionStorage.getItem('currItem') || '{}'));
          if (currItem.pathname && currItem.value) { // if an item for this instance has been saved
            if (currItem.pathname !== window.location.pathname) { // a redirect happened
              let itemExists = vaultItems.find(x => x.web_url === currItem.origin);
              let sameDetails = [currItem.email, currItem.value].includes(itemExists?.email || itemExists?.username || '');
              let confirmMessage = 'add to passvault? ' + (currItem.email || currItem.username);
              if (!sameDetails) {
                confirmMessage = 'update password for: ' + currItem.origin;
              }
              // check if either item exists and same details found or no existing item
              if (((itemExists && !sameDetails) || !itemExists) && window.confirm(confirmMessage)) {
                chrome.storage.local.get("saved").then(function (localData) {
                  let savedLocal = [];
                  localData.saved && localData.saved.forEach((elem: object) => savedLocal.push(elem));
                  let webUrl = new URL(String(currTabInfo?.url)).origin;
                  savedLocal.push({ email: currItem.email, username: currItem.username, value: currItem.value, web_url: webUrl, favIconUrl: currTabInfo?.favIconUrl, itemExists: !!itemExists })
                  chrome.storage.local.set({ saved: savedLocal })
                  sessionStorage.removeItem('currItem');
                  clearInterval(listenerInterval);
                })
              } else clearInterval(listenerInterval);
            }
          } else {
            // test listener
            let __currItem = { origin: window.location.origin, pathname: window.location.pathname, value: '', email: '', username: '' };
            sessionStorage.setItem('currItem', JSON.stringify(__currItem));
            let inputs = document.querySelectorAll("input");
            inputs.forEach(function (input) {
              input.addEventListener('change', function (event) {
                console.log('listener working');
                let currItem: CurrItem = JSON.parse((sessionStorage.getItem('currItem') || '{}'));
                if (input.type === 'password') currItem.value = input.value;
                if (input.type === 'email') currItem.email = input.value;
                if (input.type === 'text') {
                  // check if email and save
                  if (String(input.value).toLowerCase().match(/\S+@\S+\.\S+/)) currItem.email = input.value;
                  // test check username
                  if (!currItem.email && ['user', 'name', 'id'].some(x => input.getAttribute('name')?.includes(x))) currItem.username = input.value;
                }
                sessionStorage.setItem('currItem', JSON.stringify(currItem));
              })
            })
          }
        } catch (error) {
          clearInterval(listenerInterval);
          console.log('error occurred');
        }
      }, 2000)
      // select all form elements on the page and add onsubmit listeners
    }
    // TODO: fix background autofill password for users
    if (message.type === 'AUTOFILL_DOM') {
      var autofillInterval = setInterval(function () {
        try {
          if (vaultItems) {
            for (let index = 0; index < vaultItems.length; index++) {
              const item = vaultItems[index];
              let domain = new URL(String(currTabInfo.url));
              if (domain.origin === item.web_url) {
                let inputs = document.getElementsByTagName('input');
                let foundPasswordFields = [].filter.call(inputs, (el: HTMLElement) => el.getAttribute('type') === 'password');
                if (foundPasswordFields.length > 0) {
                  // fix autofill
                  if (window.confirm('do you want to autofill your saved password?')) {
                    for (let index = 0; index < inputs.length; index++) {
                      const element = inputs[index];
                      let inputType = element.getAttribute('type');
                      // find password fields first
                      if (inputType === 'password') { element.value = item.value; }
                      // find email field next
                      if (inputType === 'email') { element.value = item.email }
                      // else find username
                      if (inputType === 'text') {
                        element.value = item.email === '' ? item.username : item.email;
                      }
                    }
                    clearInterval(autofillInterval);
                  } else {
                    clearInterval(autofillInterval);
                  }
                }
                break;
              }
            }
          }
        } catch (error: any) {
          clearInterval(autofillInterval);
          console.log('error occurred: ' + error.message);

        }
      }, 2000)
    }
  })
  // })

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