const VERSION = Number(browser.runtime.getManifest().version.split('.')[0]);

browser.storage.local.get(['version']).then(({ version = 0 }) => {
  if (version < VERSION) {
    browser.tabs.create({
      url: browser.runtime.getURL(`onboarding/index.html?version=${VERSION}`),
      active: true,
    });
  }
});
