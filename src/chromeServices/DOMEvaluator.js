/* eslint-disable no-undef */
const messagesFromReactAppListener = (message, sender, sendResponse) => {
  console.log('[content.js]. Message received', message);
  if(message === 'perform action') {

  }

  const response = {
    title: document.title,
    headlines: Array.from(document.getElementsByTagName<"h1">("h1")).map(h1 => h1.innerText)
  };

  console.log('[content.js]. Message response', response);

  sendResponse(response)
}

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
