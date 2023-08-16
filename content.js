console.log('extension.js has been injected!');

let settings = {};
const observers = {};  // Store references to our MutationObservers

function hideElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.classList.add('hidden-by-extension');
        return true;
    }
    return false;
}

function showElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.classList.remove('hidden-by-extension');
        return true;
    }
    return false;
}

function applySettings() {
    console.log("Shorts setting value: ", settings.shorts);

    const elements = {
        home: 'ytd-browse.style-scope.ytd-page-manager[page-subtype="home"]',
        related: 'ytd-watch-next-secondary-results-renderer',
        comments: '#comments',
        notifications: 'yt-icon-button.style-scope.ytd-notification-topbar-button-renderer',
        shorts: 'ytd-mini-guide-entry-renderer.style-scope.ytd-mini-guide-renderer[aria-label="Shorts"]'
        // Uncomment the above line when you want to use it
    };

    for (let [key, selector] of Object.entries(elements)) {
        if (settings[key]) {
            if (!hideElement(selector) && !observers[key]) {
                observers[key] = new MutationObserver(() => {
                    if (hideElement(selector)) {
                        observers[key].disconnect();
                        delete observers[key];
                    }
                });
                observers[key].observe(document.body, { childList: true, subtree: true });
            }
        } else {
            showElement(selector);
            if (observers[key]) {
                observers[key].disconnect();
                delete observers[key];
            }
        }
    }
}

// Load the settings from the storage and apply them
async function loadAndApplySettings() {
    let storageItems = await browser.storage.sync.get(['home', 'related', 'comments', 'notifications', 'shorts']);
    console.log("Fetched settings:", storageItems);
    settings = storageItems;
    applySettings();
}

// Wait for the DOM to be loaded before applying settings
document.addEventListener('DOMContentLoaded', loadAndApplySettings);

// Listen for messages from the popup script
browser.runtime.onMessage.addListener((message) => {
    settings = message;
    applySettings();
});
