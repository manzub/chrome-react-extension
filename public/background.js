/* eslint-disable no-undef */
console.log('background script started');

chrome.tabs.onActivated.addListener(function () {
  chrome.tabs.query({}, tabs => portContentScript(tabs[0].id || 0, 'onActivated'))
})

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  chrome.tabs.sendMessage(tabId, { type: 'LISTEN_DOM', tab })
  chrome.tabs.sendMessage(tabId, { type: 'AUTOFILL_DOM', tab })
  portContentScript(tabId, 'onUpdated');
})

function portContentScript(tabId, message) {
  const port = chrome.tabs.connect(tabId, { name: 'uiOps' });
  port.postMessage(message)
}