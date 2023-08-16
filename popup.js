document.addEventListener('DOMContentLoaded', async () => {
    const SETTINGS_LIST = ['home', 'related', 'comments', 'notifications', 'shorts'];

    // Fetch the current settings from storage
    let storageItems = await browser.storage.sync.get(SETTINGS_LIST);

    // Function to save the current settings
    const saveSettings = async () => {
        let settings = {};

        // Loop through each setting and update its value
        SETTINGS_LIST.forEach(setting => {
            settings[setting] = !document.getElementById(setting).checked;
        });

        await browser.storage.sync.set(settings);

        // Send a message to content.js with the updated settings
        let tabs = await browser.tabs.query({ active: true, currentWindow: true });
        if (tabs[0]) {
            browser.tabs.sendMessage(tabs[0].id, settings);
        }
    };

    // Initialize the state of checkboxes and attach event listeners
    SETTINGS_LIST.forEach(setting => {
        let checkbox = document.getElementById(setting);

        // Set the initial state of the checkbox
        checkbox.checked = !storageItems[setting];

        // Attach the save function to the change event of the checkbox
        checkbox.addEventListener('change', saveSettings);
    });
});
