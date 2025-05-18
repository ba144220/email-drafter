function script() {
  const body = document.body;

  function isInteractiveCandidate(element: Element): boolean {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) return false;

    const tagName = element.tagName.toLowerCase();

    // Fast-path for common interactive elements
    const interactiveElements = new Set(['a', 'button', 'input', 'select', 'textarea', 'details', 'summary']);

    if (interactiveElements.has(tagName)) return true;

    // Quick attribute checks without getting full lists
    const hasQuickInteractiveAttr =
      element.hasAttribute('onclick') ||
      element.hasAttribute('role') ||
      element.hasAttribute('tabindex') ||
      element.hasAttribute('aria-') ||
      element.hasAttribute('data-action') ||
      element.getAttribute('contenteditable') === 'true';

    return hasQuickInteractiveAttr;
  }

  function isInteractiveElement(element: Element): boolean {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      return false;
    }
    const tagName = element.tagName.toLowerCase();
    const style = window.getComputedStyle(element);

    // Define interactive cursors
    const interactiveCursors = new Set([
      'pointer', // Link/clickable elements
      'move', // Movable elements
      'text', // Text selection
      'grab', // Grabbable elements
      'grabbing', // Currently grabbing
      'cell', // Table cell selection
      'copy', // Copy operation
      'alias', // Alias creation
      'all-scroll', // Scrollable content
      'col-resize', // Column resize
      'context-menu', // Context menu available
      'crosshair', // Precise selection
      'e-resize', // East resize
      'ew-resize', // East-west resize
      'help', // Help available
      'n-resize', // North resize
      'ne-resize', // Northeast resize
      'nesw-resize', // Northeast-southwest resize
      'ns-resize', // North-south resize
      'nw-resize', // Northwest resize
      'nwse-resize', // Northwest-southeast resize
      'row-resize', // Row resize
      's-resize', // South resize
      'se-resize', // Southeast resize
      'sw-resize', // Southwest resize
      'vertical-text', // Vertical text selection
      'w-resize', // West resize
      'zoom-in', // Zoom in
      'zoom-out', // Zoom out
    ]);

    // Define non-interactive cursors
    const nonInteractiveCursors = new Set([
      'not-allowed', // Action not allowed
      'no-drop', // Drop not allowed
      'wait', // Processing
      'progress', // In progress
      'initial', // Initial value
      'inherit', // Inherited value
      //? Let's just include all potentially clickable elements that are not specifically blocked
      // 'none',        // No cursor
      // 'default',     // Default cursor
      // 'auto',        // Browser default
    ]);

    function doesElementHaveInteractivePointer(element: Element): boolean {
      if (element.tagName.toLowerCase() === 'html') return false;

      if (interactiveCursors.has(style.cursor)) return true;

      return false;
    }

    const isInteractiveCursor = doesElementHaveInteractivePointer(element);

    // Genius fix for almost all interactive elements
    if (isInteractiveCursor) {
      return true;
    }

    const interactiveElements = new Set([
      'a', // Links
      'button', // Buttons
      'input', // All input types (text, checkbox, radio, etc.)
      'select', // Dropdown menus
      'textarea', // Text areas
      'details', // Expandable details
      'summary', // Summary element (clickable part of details)
      'label', // Form labels (often clickable)
      'option', // Select options
      'optgroup', // Option groups
      'fieldset', // Form fieldsets (can be interactive with legend)
      'legend', // Fieldset legends
    ]);

    // Define explicit disable attributes and properties
    const explicitDisableTags = new Set([
      'disabled', // Standard disabled attribute
      // 'aria-disabled',      // ARIA disabled state
      'readonly', // Read-only state
      // 'aria-readonly',     // ARIA read-only state
      // 'aria-hidden',       // Hidden from accessibility
      // 'hidden',            // Hidden attribute
      // 'inert',             // Inert attribute
      // 'aria-inert',        // ARIA inert state
      // 'tabindex="-1"',     // Removed from tab order
      // 'aria-hidden="true"' // Hidden from screen readers
    ]);

    // handle inputs, select, checkbox, radio, textarea, button and make sure they are not cursor style disabled/not-allowed
    if (interactiveElements.has(tagName)) {
      // Check for non-interactive cursor
      if (nonInteractiveCursors.has(style.cursor)) {
        return false;
      }

      // Check for explicit disable attributes
      for (const disableTag of explicitDisableTags) {
        if (
          element.hasAttribute(disableTag) ||
          element.getAttribute(disableTag) === 'true' ||
          element.getAttribute(disableTag) === ''
        ) {
          return false;
        }
      }

      if (
        (element instanceof HTMLButtonElement ||
          element instanceof HTMLInputElement ||
          element instanceof HTMLSelectElement ||
          element instanceof HTMLTextAreaElement ||
          element instanceof HTMLOptionElement ||
          element instanceof HTMLFieldSetElement) &&
        element.disabled
      ) {
        return false;
      }

      // Check for readonly property on form elements
      if ((element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) && element.readOnly) {
        return false;
      }

      // Check for inert property
      if ('inert' in element && (element as HTMLElement).inert) {
        return false;
      }

      return true;
    }
    return false;
  }

  function isElementDistinctInteraction(element: Element): boolean {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      return false;
    }
    const DISTINCT_INTERACTIVE_TAGS = new Set([
      'a',
      'button',
      'input',
      'select',
      'textarea',
      'summary',
      'details',
      'label',
      'option',
    ]);
    const INTERACTIVE_ROLES = new Set([
      'button',
      'link',
      'menuitem',
      'menuitemradio',
      'menuitemcheckbox',
      'radio',
      'checkbox',
      'tab',
      'switch',
      'slider',
      'spinbutton',
      'combobox',
      'searchbox',
      'textbox',
      'listbox',
      'option',
      'scrollbar',
    ]);

    const tagName = element.tagName.toLowerCase();
    const role = element.getAttribute('role');

    // Check if it's an iframe - always distinct boundary
    if (tagName === 'iframe') {
      return true;
    }

    // Check tag name
    if (DISTINCT_INTERACTIVE_TAGS.has(tagName)) {
      return true;
    }
    // Check interactive roles
    if (role && INTERACTIVE_ROLES.has(role)) {
      return true;
    }
    // Check contenteditable
    if (element.getAttribute('contenteditable') === 'true') {
      return true;
    }
    // Check for common testing/automation attributes
    if (element.hasAttribute('data-testid') || element.hasAttribute('data-cy') || element.hasAttribute('data-test')) {
      return true;
    }
    // Check for explicit onclick handler (attribute or property)
    if (element.hasAttribute('onclick') || typeof (element as HTMLElement).onclick === 'function') {
      return true;
    }
    // Check for other common interaction event listeners

    // Fallback: Check common event attributes if getEventListeners is not available
    const commonEventAttrs = [
      'onmousedown',
      'onmouseup',
      'onkeydown',
      'onkeyup',
      'onsubmit',
      'onchange',
      'oninput',
      'onfocus',
      'onblur',
    ];
    if (commonEventAttrs.some(attr => element.hasAttribute(attr))) {
      return true;
    }

    // Default to false: if it's interactive but doesn't match above,
    // assume it triggers the same action as the parent.
    return false;
  }

  // Inject css styles to the body
  const style = document.createElement('style');
  style.textContent = `
    .blix-interactive-element {
      border: 1px solid red;
    }
    .blix-text-node {
      border: 1px solid gray;
    }
    .blix-distinct-interaction-element {
      border: 1px solid green;
    }
  `;
  document.head.appendChild(style);

  // Count all the elements
  const elementCount = Array.from(body.querySelectorAll('*')).length;
  console.log('Raw');
  console.log('Element Count: ', elementCount);
  console.log('Chars count: ', body.outerHTML.length);

  // Conduct a BFS to find all the interactive elements
  const interactiveElements = new Set<Element>();
  const queue: Element[] = [body];
  while (queue.length > 0) {
    const element = queue.shift();
    if (!element) continue;
    if (isInteractiveCandidate(element) && isInteractiveElement(element)) {
      interactiveElements.add(element);
      continue;
    }
    Array.from(element.children).forEach(child => {
      queue.push(child);
    });
  }

  // Skip tags
  const SKIP_TAGS = new Set(['script', 'style', 'link', 'meta', 'title', 'noscript', 'svg', 'path', 'rect']);

  // Get all the elements with innerText
  const textNodeEls = Array.from(body.querySelectorAll('*')).filter(
    el =>
      !SKIP_TAGS.has(el.tagName.toLowerCase()) &&
      Array.from(el.childNodes).some(
        node => node.nodeType === Node.TEXT_NODE && !!node.textContent && node.textContent.trim().length > 0,
      ),
  );
  textNodeEls.forEach(el => {
    if (el instanceof HTMLElement) {
      el.classList.add('blix-text-node');
    }
  });

  // Give them a border
  const innerQueue: Element[] = [];
  const innerDistinctInteractionElements = new Set<Element>();
  interactiveElements.forEach(el => {
    // add their children to the queue
    Array.from(el.children).forEach(child => {
      innerQueue.push(child);
    });
  });

  while (innerQueue.length > 0) {
    const element = innerQueue.shift();
    if (!element) continue;
    if (isElementDistinctInteraction(element)) {
      innerDistinctInteractionElements.add(element);
      continue;
    }
    Array.from(element.children).forEach(child => {
      innerQueue.push(child);
    });
  }
  interactiveElements.forEach(el => {
    if (el instanceof HTMLElement) {
      el.classList.add('blix-interactive-element');
    }
  });
  innerDistinctInteractionElements.forEach(el => {
    if (el instanceof HTMLElement) {
      el.classList.add('blix-distinct-interaction-element');
    }
  });

  console.log('Interactive Elements: ', interactiveElements.size);
  console.log('Distinct Interaction Elements: ', innerDistinctInteractionElements.size);
  console.log('Text Nodes: ', textNodeEls.length);

  // BFS to remove and nodes without any interactive elements, distinct interaction elements, or text nodes descendants
  const queueToRemove: Element[] = [body];
  while (queueToRemove.length > 0) {
    const element = queueToRemove.shift();
    if (!element) continue;
    // If the element type is not a Text nor Element, remove it
    if (element.nodeType !== Node.TEXT_NODE && element.nodeType !== Node.ELEMENT_NODE) {
      element.remove();
      continue;
    }
    if (SKIP_TAGS.has(element.tagName.toLowerCase())) {
      element.remove();
      continue;
    }
    // If the element itself is a text node, interactive element, or distinct interaction element, don't remove it
    if (
      textNodeEls.includes(element) ||
      interactiveElements.has(element) ||
      innerDistinctInteractionElements.has(element)
    ) {
      Array.from(element.children).forEach(child => {
        queueToRemove.push(child);
      });
      continue;
    }
    if (element instanceof HTMLElement) {
      // Check if the element has any interactive elements, distinct interaction elements, or text nodes as descendants
      const hasInteractiveElements = element.querySelector('.blix-interactive-element') !== null;
      const hasDistinctInteractionElements = element.querySelector('.blix-distinct-interaction-element') !== null;
      const hasTextNodes = element.querySelector('.blix-text-node') !== null;

      // If the element has none of these, remove it
      if (!hasInteractiveElements && !hasDistinctInteractionElements && !hasTextNodes) {
        element.remove();
        continue;
      }
    }
    Array.from(element.children).forEach(child => {
      queueToRemove.push(child);
    });
  }

  // Remove all attributes from all elements
  new Promise(resolve => {
    Array.from(body.querySelectorAll('*')).forEach(el => {
      Array.from(el.attributes).forEach(attr => {
        el.removeAttribute(attr.name);
      });
    });
    // Clear all attributes from the body
    Array.from(body.attributes).forEach(attr => {
      body.removeAttribute(attr.name);
    });
    // Add overflow scroll to the body
    // body.style.overflow = 'scroll';

    // // Add a gray border for every element
    // Array.from(body.querySelectorAll('*')).forEach(el => {
    //   if (el instanceof HTMLElement && el.nodeType === Node.ELEMENT_NODE) {
    //     el.style.border = '1px solid gray';
    //   }
    // });

    resolve(true);
  });

  // Count all the elements again
  const elementCountAfter = Array.from(body.querySelectorAll('*')).length;
  console.log('Element Count After: ', elementCountAfter);
  console.log('Chars count after: ', body.outerHTML.length);
  console.log(body);

  return '';
}

export default function HtmlSnapshotTest() {
  const handleClick = async () => {
    // Get the current tab
    const activeTab = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!activeTab[0]) return;
    const activeTabId = activeTab[0]?.id;
    if (!activeTabId) return;

    const results = await chrome.scripting.executeScript({
      target: {
        tabId: activeTabId,
      },
      func: script,
    });
    if (results.length === 0) return;
    if (!results[0].result) return;
    const html = results[0].result;
    const dom = new DOMParser();
    const doc = dom.parseFromString(html, 'text/html');
    console.log('===== html =====');
    console.log(doc.body);
  };
  return <button onClick={handleClick}>HtmlSnapshotTest</button>;
}
