export type DOMMessage = {
  type: 'LISTEN_DOM' | 'AUTOFILL_DOM',
  tab: chrome.tabs.Tab
}

export type VaultItem = {
  email: string,
  favIconUrl: string,
  owner: string,
  username: string,
  value: string,
  web_url: string
}

export type DOMMessageResponse = {
  email: string;
  username: string | null;
  value: string;
};
