// import { delay } from './utils/delay';

import { Editor } from './editor';

// async function getEditor() {
//   // Get all divs with contenteditable="true" and aria-label including "Message body"
//   return document.querySelector('div[contenteditable="true"][aria-label^="Message body"]') as HTMLElement;
// }

// let timeout: NodeJS.Timeout;
// function onMutationsDebounced() {
//   clearTimeout(timeout);
//   timeout = setTimeout(async () => {
//     const editor = await getEditor();
//     editor.style.border = '1px solid green';
//     // Set it's placeholder to "Hello"
//     if (!editor) {
//       console.log('No editor found');
//       return;
//     }
//     console.log('editor', editor);
//     console.log('selection', window.getSelection());
//     const selectionElement = window.getSelection()?.anchorNode?.parentElement;
//     if (selectionElement) {
//       // Remove all the elements with the class email-drafter-selection
//       const existingElements = document.querySelectorAll('.email-drafter-selection');
//       await Promise.all(
//         Array.from(existingElements).map(element => {
//           element.classList.remove('email-drafter-selection');
//         }),
//       );
//       // Add the class
//       selectionElement.classList.add('email-drafter-selection');
//     }
//   }, 100);
// }

// const observer = new MutationObserver(onMutationsDebounced);

// // 3) Start observing: whole document, all subtree changes, attributes & text content
// observer.observe(document.documentElement, {
//   childList: true, // additions/removals of nodes
//   subtree: true, // watch entire document, not just direct children
//   attributes: false, // changes to attributes (e.g. class, src, style…)
//   characterData: true, // changes to text nodes
// });

async function main() {
  // Inject the styles
  const style = document.createElement('style');
  style.textContent = `
    .email-drafter-comment {
      opacity: 0.25;
    }
  `;
  document.head.appendChild(style);

  const editor = new Editor();
  editor.startObserver();
}

main();
