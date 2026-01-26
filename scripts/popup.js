document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('toggle-blocker');
    const statusLabel = document.getElementById('status-label');
    const statusToggleText = document.getElementById('status-toggle-text');
    const languageSelect = document.getElementById('language-select');
    const popupTitle = document.getElementById('popup-title');
    const languageLabel = document.getElementById('language-label');
    const footerText = document.getElementById('footer-text');

    const translations = {
        en: { title: 'Reddit Translation Blocker', status: 'Blocker is ', on: 'ON', off: 'OFF', language: 'Language:', footer: 'Making search cleaner! ✨' },
        zh: { title: 'Reddit 翻译拦截器', status: '拦截器已', on: '开启', off: '关闭', language: '语言：', footer: '让搜索更清爽！ ✨' },
        es: { title: 'Bloqueador de Traducciones de Reddit', status: 'El bloqueador está ', on: 'ACTIVADO', off: 'DESACTIVADO', language: 'Idioma:', footer: '¡Haciendo las búsquedas más limpias! ✨' },
        hi: { title: 'Reddit अनुवाद अवरोधक', status: 'अवरोधक ', on: 'चालू', off: 'बंद', language: 'भाषा:', footer: 'खोज को स्वच्छ बनाना! ✨' },
        ar: { title: 'حاجب ترجمة Reddit', status: 'الحاجب ', on: 'قيد التشغيل', off: 'متوقف', language: 'اللغة:', footer: 'جعل البحث أنظف! ✨' },
        bn: { title: 'Reddit অনুবাদ ব্লকার', status: 'ব্লকার ', on: 'চালু', off: 'বন্ধ', language: 'ভাষা:', footer: 'অনুসন্ধান আরও পরিষ্কার করা! ✨' },
        pt: { title: 'Bloqueador de Tradução do Reddit', status: 'O bloqueador está ', on: 'LIGADO', off: 'DESLIGADO', language: 'Idioma:', footer: 'Tornando a busca mais limpa! ✨' },
        ru: { title: 'Блокировщик переводов Reddit', status: 'Блокировщик ', on: 'ВКЛ', off: 'ВЫКЛ', language: 'Язык:', footer: 'Делаем поиск чище! ✨' },
        ja: { title: 'Reddit 翻訳ブロッカー', status: 'ブロッカーは', on: 'オン', off: 'オフ', language: '言語:', footer: '検索をよりクリーンに！ ✨' },
        fr: { title: 'Bloqueur de traduction Reddit', status: 'Le bloqueur est ', on: 'ACTIVÉ', off: 'DÉSACTIVÉ', language: 'Langue :', footer: 'Rendre la recherche plus propre ! ✨' }
    };

    // Top 10 languages supported
    const supportedLanguages = Object.keys(translations);

    // Load current state
    chrome.storage.local.get(['blockerEnabled', 'targetLanguage'], (result) => {
        // Blocker state
        const isEnabled = result.blockerEnabled !== false; // Default to true
        toggle.checked = isEnabled;

        // Language state
        let targetLang = result.targetLanguage;
        if (!targetLang) {
            const browserLang = navigator.language.split('-')[0];
            targetLang = supportedLanguages.includes(browserLang) ? browserLang : 'en';
            chrome.storage.local.set({ targetLanguage: targetLang });
        }
        languageSelect.value = targetLang;

        translateUI(targetLang, isEnabled);
    });

    // Handle toggle change
    toggle.addEventListener('change', () => {
        const isEnabled = toggle.checked;
        chrome.storage.local.set({ blockerEnabled: isEnabled }, () => {
            translateUI(languageSelect.value, isEnabled);
        });
    });

    // Handle language change
    languageSelect.addEventListener('change', () => {
        const selectedLang = languageSelect.value;
        chrome.storage.local.set({ targetLanguage: selectedLang }, () => {
            translateUI(selectedLang, toggle.checked);
        });
    });

    function translateUI(lang, isEnabled) {
        const t = translations[lang] || translations.en;
        popupTitle.textContent = t.title;
        languageLabel.textContent = t.language;
        footerText.textContent = t.footer;

        // Update status section
        statusLabel.childNodes[0].textContent = t.status;
        statusToggleText.textContent = isEnabled ? t.on : t.off;
        statusToggleText.style.color = isEnabled ? '#ff4500' : '#7f8c8d';
    }
});
