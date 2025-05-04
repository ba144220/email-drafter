import { debounce } from './utils/debounce';

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

  private onMutation() {
    const tempEditor = this.getEditor();
    if (tempEditor && tempEditor == this.editor) return;
    if (!tempEditor) return;
    this.editor = tempEditor;

    this.cleanComments(this.editor);
    this.editor.style.border = '1px solid orange';
    // Get the first child of the editor
    const firstChild = this.editor.firstChild;
    if (firstChild) {
      // Copy the first child
      const firstChildCopy = firstChild.cloneNode(true);

      firstChildCopy.textContent = '// Hello';
      // Insert the first child copy to the top of the editor
      this.editor.insertBefore(firstChildCopy, this.editor.firstChild);
    }

    this.decorateComments(this.editor);

    this.editor.addEventListener('keyup', () => {
      this.decorateComments(this.editor);
    });
  }

  public startObserver(): void {
    this.observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false,
    });
  }
}
