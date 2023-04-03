import { DOMMessage, DOMMessageResponse, VaultItem } from "../types";

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
      // select all form elements on the page and add onsubmit listeners
      let formsArray = document.querySelectorAll("form");
      formsArray.forEach(formElem => {
        formElem.addEventListener('submit', function (e) {
          let inputs = formElem.getElementsByTagName("input")
          for (let index = 0; index < inputs.length; index++) {
            const element = inputs[index];
            let inputType = element.getAttribute('type');
            // find password fields first
            if (inputType === 'password') { response.value = element.value; }
            // find email fields next
            if (['text', 'email'].includes(String(inputType))) {
              const validateEmail = (email: string) => {
                // eslint-disable-next-line no-useless-escape
                return email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
              };
              if (validateEmail(element.value)) { response.email = element.value; }
            }
          }
          //  if no email fields found then find other fields - e.g username
          if (response.email === '') {
            let inputsArr = Array.from(inputs).filter(item => (item.getAttribute('type') !== 'password'));
            if (inputsArr.length > 0) {
              inputsArr.forEach(item => {
                if (item.getAttribute('type') === 'text') { response.username = item.value }
              })
            }
          }

          let currTabDomain = new URL(String(currTabInfo.url));
          let itemExists = vaultItems.find(x => x.web_url === currTabDomain.origin);
          if (response.value) {
            let confirmMessage = 'add to passvault? ' + response.email;
            let sameDetails = [response.email, response.username].includes(itemExists?.email || itemExists?.username || '');
            if (!sameDetails) {
              confirmMessage = `update password for: ${currTabDomain.origin}`;
            }

            // check if either item exists and same details found or no existing item
            if (((itemExists && !sameDetails) || !itemExists) && window.confirm(confirmMessage)) {
              chrome.storage.local.get("saved").then(function (localData) {
                let savedLocal = [];
                localData.saved && localData.saved.forEach((elem: object) => savedLocal.push(elem));
                let webUrl = new URL(String(currTabInfo?.url)).origin;
                savedLocal.push({ ...response, web_url: webUrl, favIconUrl: currTabInfo?.favIconUrl, itemExists: !!itemExists })
                chrome.storage.local.set({ saved: savedLocal })
              })
            }
          }
        })
      })
    }
    // TODO: fix background autofill password for users
    if (message.type === 'AUTOFILL_DOM') {
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
              }
            }
            break;
          }
        }
      }
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