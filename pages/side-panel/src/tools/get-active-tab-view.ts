import { buildDomTree } from './build-dom-tree';

export async function getActiveTabView(): Promise<{
  title: string;
  url: string;
  htmlContent: string;
} | null> {
  // Get the html content of the current tab
  const tab = await chrome.tabs.query({ active: true });
  const activeTabId = tab[0].id;
  if (!activeTabId) {
    return null;
  }
  // Get tab title
  const tabTitle = tab[0].title;
  const tabUrl = tab[0].url;

  const result = await chrome.scripting.executeScript({
    target: { tabId: activeTabId },
    func: getDOM,
    args: ['body'],
  });
  if (!result[0].result) {
    return null;
  }
  const res: string = result[0].result;

  const domTree = await buildDomTree(res);
  return {
    title: tabTitle || 'No title',
    url: tabUrl || 'No url',
    htmlContent: domTree,
  };
}

function getDOM(selector: string): string | null {
  let ele: HTMLElement | null;
  if (selector) {
    ele = document.querySelector(selector);
    if (!ele) return null;
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
