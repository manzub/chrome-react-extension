export type DOMMessage = {
  type: 'LISTEN_DOM',
  tab: chrome.tabs.Tab
}

export type DOMMessageResponse = {
  email: string;
  value: string;
};
