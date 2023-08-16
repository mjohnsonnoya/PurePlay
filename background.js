// background.js

browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === "install") {
        // Set default values when the extension is installed
        await browser.storage.sync.set({
            home: false,
            related: false,
            comments: false,
            notifications: false,
            shorts: false
        });
    }
});
