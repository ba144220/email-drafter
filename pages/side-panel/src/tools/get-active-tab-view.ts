import { buildDomTree } from './build-dom-tree';

export async function getActiveTabView(): Promise<{
  title: string;
  url: string;
  htmlContent: string;
}> {
  // Get the html content of the current tab
  const tab = await chrome.tabs.query({ active: true });
  const activeTabId = tab[0].id;
  if (!activeTabId) {
    return {
      title: 'No active tab found',
      url: 'No active tab found',
      htmlContent: 'No active tab found',
    };
  }
  // Get tab title
  const tabTitle = tab[0].title;
  const tabUrl = tab[0].url;

  const result = await chrome.scripting.executeScript({
    target: { tabId: activeTabId },
    func: getDOM,
    args: ['body'],
  });

  const domTree = await buildDomTree(result[0].result || '');
  return {
    title: tabTitle || 'No title',
    url: tabUrl || 'No url',
    htmlContent: domTree,
  };
}

function getDOM(selector: string) {
  let ele: HTMLElement | null;
  if (selector) {
    ele = document.querySelector(selector);
    if (!ele) return 'ERROR: querySelector failed to find node';
  } else {
    ele = document.documentElement;
  }
  return ele.outerHTML;
}

// async function DOMtoString(selector: string) {
//   let ele: HTMLElement | null;
//   if (selector) {
//     ele = document.querySelector(selector);
//     if (!ele) return 'ERROR: querySelector failed to find node';
//   } else {
//     ele = document.documentElement;
//   }
//   const domTree = await buildDomTree(ele);
//   return domTree.outerHTML;
// }
