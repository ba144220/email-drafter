import { createRoot } from 'react-dom/client';
import App from '@src/App';
// @ts-expect-error Because file doesn't exist before build
import tailwindcssOutput from '../dist/tailwind-output.css?inline';

const root = document.createElement('div');
root.id = 'chrome-extension-boilerplate-react-vite-content-view-root';

document.body.append(root);

const rootIntoShadow = document.createElement('div');
rootIntoShadow.id = 'shadow-root';

const shadowRoot = root.attachShadow({ mode: 'open' });

if (navigator.userAgent.includes('Firefox')) {
  /**
   * In the firefox environment, adoptedStyleSheets cannot be used due to the bug
   * @url https://bugzilla.mozilla.org/show_bug.cgi?id=1770592
   *
   * Injecting styles into the document, this may cause style conflicts with the host page
   */
  const styleElement = document.createElement('style');
  styleElement.innerHTML = tailwindcssOutput;
  shadowRoot.appendChild(styleElement);
} else {
  /** Inject styles into shadow dom */
  const globalStyleSheet = new CSSStyleSheet();
  globalStyleSheet.replaceSync(tailwindcssOutput);
  shadowRoot.adoptedStyleSheets = [globalStyleSheet];
}

shadowRoot.appendChild(rootIntoShadow);
createRoot(rootIntoShadow).render(<App />);

console.log('content-ui script loaded');
// get the current url
const url = window.location.href;
console.log('current url', url);

// delay function
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getSplitPrimaryButton(
  maxRetries: number = 10,
  interval: number = 1000, // 1 second
): Promise<HTMLElement | null> {
  let retries = 0;
  while (retries < maxRetries) {
    const splitPrimaryButton = document.querySelector('.splitPrimaryButton');
    if (splitPrimaryButton) {
      return splitPrimaryButton as HTMLElement;
    }
    console.log('waiting for splitPrimaryButton', retries);
    retries++;
    await delay(interval);
  }
  return null;
}
(async () => {
  // delay 2 seconds
  await delay(5000);
  const splitPrimaryButton = await getSplitPrimaryButton();
  console.log('splitPrimaryButton', splitPrimaryButton);
  if (splitPrimaryButton) {
    splitPrimaryButton.style.border = '4px solid blue';
    // splitPrimaryButton.classList.add('border-2', 'border-teal-500');
  }
})();
