chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "showPopup-1e011d5f05a",
        title: "Translate selected text",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "showPopup-1e011d5f05a" && info.selectionText) {
        if (tab && tab.id !== undefined) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: (selectedText) => {
                    window.dispatchEvent(new CustomEvent('showPopup-1e011d5f05a', { detail: selectedText }));
                },
                args: [info.selectionText]
            });
        } else {
            console.error('Tab is undefined or tab.id is undefined');
        }
    }
});
