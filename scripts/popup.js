document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('toggle-blocker');
    const statusText = document.getElementById('status-text').querySelector('span');
    const languageSelect = document.getElementById('language-select');

    // Top 10 languages supported
    const supportedLanguages = ['en', 'zh', 'es', 'hi', 'ar', 'bn', 'pt', 'ru', 'ja', 'fr'];

    // Load current state
    chrome.storage.local.get(['blockerEnabled', 'targetLanguage'], (result) => {
        // Blocker state
        const isEnabled = result.blockerEnabled !== false; // Default to true
        toggle.checked = isEnabled;
        updateStatusText(isEnabled);

        // Language state
        let targetLang = result.targetLanguage;
        if (!targetLang) {
            // Detect browser language and check if it's in our top 10
            const browserLang = navigator.language.split('-')[0];
            targetLang = supportedLanguages.includes(browserLang) ? browserLang : 'en';

            // Save the detected language as initial preference
            chrome.storage.local.set({ targetLanguage: targetLang });
        }
        languageSelect.value = targetLang;
    });

    // Handle toggle change
    toggle.addEventListener('change', () => {
        const isEnabled = toggle.checked;
        chrome.storage.local.set({ blockerEnabled: isEnabled }, () => {
            updateStatusText(isEnabled);
        });
    });

    // Handle language change
    languageSelect.addEventListener('change', () => {
        const selectedLang = languageSelect.value;
        chrome.storage.local.set({ targetLanguage: selectedLang });
    });

    function updateStatusText(isEnabled) {
        statusText.textContent = isEnabled ? 'ON' : 'OFF';
        statusText.style.color = isEnabled ? '#ff4500' : '#7f8c8d';
    }
});
