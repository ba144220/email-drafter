import OpenAI from 'openai';
import { debounce } from './utils/debounce';
import isHotkey from 'is-hotkey';
import { EMAIL_DRAFTER_PROMPT } from './constants/prompts';

const client = new OpenAI({
  apiKey: process.env['CEB_OPENAI_API_KEY'], // This is the default and can be omitted
  dangerouslyAllowBrowser: true,
});

export class Editor {
  private editor: HTMLElement | null = null;
  private observer: MutationObserver;

  private debounceWait: number = 500;

  constructor() {
    this.editor = null;
    this.observer = new MutationObserver(debounce(this.onMutation.bind(this), this.debounceWait));
  }

  private getEditor(): HTMLElement | null {
    return document.querySelector('div[contenteditable="true"][aria-label^="Message body"]') as HTMLElement;
  }

  private getAllComments(editor: HTMLElement | null, commentRegex: RegExp = /^\/\/\s/) {
    if (!editor) return [];
    const comments: HTMLElement[] = [];
    editor.childNodes.forEach((child: Node) => {
      if (child.nodeType === Node.ELEMENT_NODE && commentRegex.test(child.textContent || '')) {
        comments.push(child as HTMLElement);
      }
    });
    return comments;
  }

  private cleanComments(editor: HTMLElement | null, commentRegex: RegExp = /^\/\/\s/) {
    if (!editor) return;
    const comments = this.getAllComments(editor, commentRegex);
    comments.forEach(comment => {
      comment.remove();
    });
  }

  private decorateComments(editor: HTMLElement | null, commentRegex: RegExp = /^\/\/\s/) {
    if (!editor) return;
    editor.childNodes.forEach((child: Node) => {
      // If the child has a class email-drafter-comment but doesn't start with the commentRegex, remove the class
      if (
        child instanceof HTMLElement &&
        child.classList.contains('email-drafter-comment') &&
        !commentRegex.test(child.textContent || '')
      ) {
        child.classList.remove('email-drafter-comment');
      }
    });
    const comments = this.getAllComments(editor, commentRegex);
    comments.forEach(comment => {
      comment.classList.add('email-drafter-comment');
    });
  }

  private async generate() {
    // get the text content of the editor
    const text = this.editor?.innerText;
    if (!text) return;
    console.log('prefix');
    console.log(text);
    // send the text to the OpenAI API
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.0,
      max_tokens: 200,
      messages: [
        { role: 'system', content: EMAIL_DRAFTER_PROMPT },
        { role: 'user', content: text },
      ],
    });
    console.log(response.choices[0].message.content);
    // insert the response at the cursor
    if (response.choices[0].message.content) {
      this.insertTextAtCursor(response.choices[0].message.content);
    }
  }

  private onMutation() {
    const tempEditor = this.getEditor();
    if (tempEditor && tempEditor == this.editor) return;
    if (!tempEditor) return;
    this.editor = tempEditor;

    this.cleanComments(this.editor);
    // this.editor.style.border = '1px solid orange';
    // Get the first child of the editor
    const firstChild = this.editor.firstChild;
    if (firstChild) {
      // Copy the first child
      const firstChildCopy = firstChild.cloneNode(true);

      firstChildCopy.textContent = '// Press command+shift+enter to generate';
      // Insert the first child copy to the top of the editor
      this.editor.insertBefore(firstChildCopy, this.editor.firstChild);
    }

    this.decorateComments(this.editor);

    this.editor.addEventListener('keydown', async (event: KeyboardEvent) => {
      if (isHotkey('meta+shift+enter', event)) {
        await this.generate();
        // this.insertTextAtCursor('Hello World!');
        this.cleanComments(this.editor);
      }
    });

    this.editor.addEventListener('keyup', (event: KeyboardEvent) => {
      this.decorateComments(this.editor);
    });
  }

  public insertTextAtCursor(text: string): boolean {
    if (!this.editor) return false;

    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return false;

    const range = selection.getRangeAt(0);

    // Make sure the selection is within our editor
    if (!this.editor.contains(range.commonAncestorContainer)) return false;

    // Split the text by newline characters
    const lines = text.split('\n');

    // Create a document fragment to hold all our elements
    const fragment = document.createDocumentFragment();

    // Process each line
    lines.forEach((line, index) => {
      // Create a paragraph element for each line
      const paragraph = document.createElement('div');
      paragraph.textContent = line;
      fragment.appendChild(paragraph);
    });

    // Insert the entire fragment at once
    range.deleteContents();
    range.insertNode(fragment);

    // Move the cursor to the end of the inserted content
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);

    return true;
  }
  // public insertTextAtCursor(text: string): boolean {
  //   if (!this.editor) return false;

  //   const selection = window.getSelection();
  //   if (!selection || !selection.rangeCount) return false;

  //   const range = selection.getRangeAt(0);

  //   // Make sure the selection is within our editor
  //   if (!this.editor.contains(range.commonAncestorContainer)) return false;

  //   // Create a text node with the content
  //   const textNode = document.createTextNode(text);

  //   // Insert the text node at the cursor position
  //   range.insertNode(textNode);

  //   // Move the cursor after the inserted text
  //   range.setStartAfter(textNode);
  //   range.setEndAfter(textNode);
  //   selection.removeAllRanges();
  //   selection.addRange(range);

  //   return true;
  // }

  public startObserver(): void {
    this.observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false,
    });
  }
}
