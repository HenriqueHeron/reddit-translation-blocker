/**
 * Removes Reddit translations from the search results.
 * @returns {void}
 */
async function removeRedditTranslations() {
  // Check if blocker is enabled and get target language
  const result = await chrome.storage.local.get(['blockerEnabled', 'targetLanguage']);
  const isEnabled = result.blockerEnabled !== false;

  if (!isEnabled) {
    console.log("Reddit Translation Blocker is disabled.");
    return;
  }

  // Determine target language: stored preference, or browser language, or default to English
  let targetLang = result.targetLanguage;
  if (!targetLang) {
    targetLang = navigator.language.split('-')[0];
  }

  console.log(`Reddit Translation Blocker is active! Current language: ${targetLang}`);

  const searchBar = document.querySelector('textarea[class="gLFyf"]');
  const searchBtn = document.querySelector('button[class="HZVG1b Tg7LZd"]');

  if (searchBar && searchBar.value.toLowerCase().includes("reddit")) {
    const redditTlParam = `?tl=`;
    const exclusionParam = `-inurl:${redditTlParam}`;

    // Also block the variant without the question mark if it exists (some Google URLs use &tl=)
    // But ?tl= is the primary one for the "Translate" button results.

    if (!searchBar.value.includes(exclusionParam)) {
      searchBar.value = `${searchBar.value} ${exclusionParam}`;
      if (searchBtn) {
        searchBtn.click();
      } else {
        // Fallback: trigger Enter key if button not found
        searchBar.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true
        }));
      }
    }
  }
}

// Observe for AJAX navigation in Google Search
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    removeRedditTranslations();
  }
}).observe(document, { subtree: true, childList: true });

// Initial run
removeRedditTranslations();
