export type DOMMessage = {
  type: 'LISTEN_DOM' | 'AUTOFILL_DOM',
  tab: chrome.tabs.Tab
}

export type DOMMessageResponse = {
  email: string;
  username: string | null;
  value: string;
};
