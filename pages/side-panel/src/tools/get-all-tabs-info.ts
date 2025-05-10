import moment from 'moment';

export async function getAllTabsInfo(): Promise<string> {
  const tabs = await chrome.tabs.query({});
  const tabsInfo = tabs.map((tab, index) => ({
    id: tab.id || index,
    title: tab.title,
    url: tab.url,
    lastAccessed: tab.lastAccessed ? moment(tab.lastAccessed).fromNow() : 'N/A',
    active: tab.active ? 'Yes' : 'No',
    pinned: tab.pinned ? 'Yes' : 'No',
  }));

  return JSON.stringify(tabsInfo, null, 1);
}
