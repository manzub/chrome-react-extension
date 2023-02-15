import { DOMMessages } from "../constants/constants";
import { encryptData } from "../encrypt";

/* eslint-disable no-undef */
const messagesFromReactAppListener = (message, params, sendResponse) => {
  console.log('[content.js]. Message received', message);
  let response = {};
  
  if(message === DOMMessages.LISTEN) {
    let formsArray = document.querySelectorAll("form");
    formsArray.forEach(formElem => {
      formElem.addEventListener('submit', function(e) {
        let inputs = formElem.getElementsByTagName("input")
        for (let index = 0; index < inputs.length; index++) {
          const element = inputs[index];
          let inputType = element.getAttribute('type');
          response = {
            email: inputType === 'email' && element.value,
            value: inputType === 'password' && encryptData(element.value)
          }
        }
      })
    })
  }

  console.log('[content.js]. Message response', response);

  sendResponse(response)
}

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
