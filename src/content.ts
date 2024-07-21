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

function showPopup(selectedText: string) {
    const container = document.createElement('div');
    container.id = 'translations-popup-container-1e011d5f05a';
    container.classList.add('translations-popup-container-1e011d5f05a');
    document.body.appendChild(container);

    const app = createApp(Popup, {
        selectedText,
        onClose: () => {
            app.unmount();
            document.body.removeChild(container);
        },
    });

    app.mount('#translations-popup-container-1e011d5f05a');
}

window.addEventListener('showPopup-1e011d5f05a', (event: Event) => {
    const customEvent = event as ShowPopupEvent;
    const selectedText = customEvent.detail;

    injectStyles(() => {
        showPopup(selectedText);
    });
});
