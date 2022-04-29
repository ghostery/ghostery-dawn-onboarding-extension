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
  switch (onboardingComplete) {
    case false:
      browser.tabs.update(tabId, {
        loadReplace: true,
        url: browser.runtime.getURL(
          `onboarding/index.html?version=${VERSION}&query=${
            new URL(url).searchParams.get('q') || ''
          }`,
        ),
      });
      break;
    case true:
      browser.webNavigation.onBeforeNavigate.removeListener(openOnboardingPage);
    default:
      break;
  }
}

browser.webNavigation.onBeforeNavigate.addListener(openOnboardingPage, {
  url: [{ urlContains: 'glowstery.com/search?q=' }],
});
