const VERSION = Number(browser.runtime.getManifest().version.split('.')[0]);

let onboardingComplete = undefined;

browser.storage.local.get(['version']).then(({ version = 0 }) => {
  onboardingComplete = version === VERSION;
});

browser.runtime.onMessage.addListener((message) => {
  if (message === 'onboarding-complete') {
    onboardingComplete = true;
    browser.storage.local.set({ version: VERSION });
    browser.webNavigation.onBeforeNavigate.removeListener(openOnboardingPage);
  }
});

function openOnboardingPage({ tabId, url }) {
  if (onboardingComplete) {
    browser.webNavigation.onBeforeNavigate.removeListener(openOnboardingPage);
    return;
  }

  browser.tabs.update(tabId, {
    loadReplace: true,
    url: browser.runtime.getURL(
      `onboarding/index.html?version=${VERSION}&query=${
        new URL(url).searchParams.get('q') || ''
      }`,
    ),
  });
}

browser.webNavigation.onBeforeNavigate.addListener(openOnboardingPage, {
  url: [{ urlContains: 'glowstery.com/search?q=' }],
});
