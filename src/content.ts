import { createApp } from 'vue';
import Popup from './components/Popup.vue';

interface ShowPopupEvent extends CustomEvent {
    detail: string;
}

function injectStyles(callback: () => void) {
    const styleEl = document.createElement('link');
    styleEl.rel = 'stylesheet';
    styleEl.href = chrome.runtime.getURL('assets/content.css'); // убедитесь, что путь правильный
    styleEl.onload = callback; // Call the callback function once the stylesheet is loaded
    document.head.appendChild(styleEl);
}

function saveSelection(): { range: Range | null, element: HTMLElement | null } {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0).cloneRange();
        const element = range.startContainer.parentElement as HTMLElement;
        return { range, element };
    }
    return { range: null, element: null };
}

// function restoreSelection(range: Range | null) {
//     if (range) {
//         const selection = window.getSelection();
//         selection?.removeAllRanges();
//         selection?.addRange(range);
//     }
// }

function replaceSelection(range: Range | null, newText: string, element: HTMLElement | null) {
    if (!range || !element) return;

    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        const inputElement = element as HTMLInputElement | HTMLTextAreaElement;
        const start = inputElement.selectionStart ?? 0;
        const end = inputElement.selectionEnd ?? 0;
        const value = inputElement.value;

        // Replace the selected text with the new text
        inputElement.value = value.slice(0, start) + newText + value.slice(end);

        // Optionally set the cursor position after the inserted text
        inputElement.setSelectionRange(start + newText.length, start + newText.length);
    }
}

function showPopup(selectedText: string, originalRange: Range | null, element: HTMLElement | null) {
    const container = document.createElement('div');
    container.id = 'translations-popup-container-1e011d5f05a';
    container.classList.add('translations-popup-container-1e011d5f05a');
    document.body.appendChild(container);

    const app = createApp(Popup, {
        selectedText,
        onClose: () => {
            // restoreSelection(originalRange); // Restore the selection position

            app.unmount();
            document.body.removeChild(container);
        },
        onReplace: (newText: string) => {
            replaceSelection(originalRange, newText, element);
        },
    });

    app.mount('#translations-popup-container-1e011d5f05a');
}

window.addEventListener('showPopup-1e011d5f05a', (event: Event) => {
    const customEvent = event as ShowPopupEvent;
    const selectedText = customEvent.detail;
    const { range, element } = saveSelection();

    injectStyles(() => {
        showPopup(selectedText, range, element);
    });
});
