const VERSION = Number(browser.runtime.getManifest().version.split('.')[0]);

let onboardingComplete = true;

browser.storage.local.get(['version']).then(({ version = 0 }) => {
  if (version < VERSION) {
    onboardingComplete = false;
  }
});

browser.runtime.onMessage.addListener((message) => {
  if (message === 'onboarding-complete') {
    onboardingComplete = false;
    browser.storage.local.set({ version: VERSION });
    browser.webNavigation.onBeforeNavigate.removeListener(openOnboardingPage);
  }
});

function openOnboardingPage({ tabId, url }) {
  url = new URL(url);

  browser.tabs.update(tabId, {
    loadReplace: true,
    url: browser.runtime.getURL(
      `onboarding/index.html?version=${VERSION}&query=${
        url.searchParams.get('q') || ''
      }`,
    ),
  });
}

browser.webNavigation.onBeforeNavigate.addListener(openOnboardingPage, {
  url: [{ urlContains: 'glowstery.com/search?q=' }],
});
