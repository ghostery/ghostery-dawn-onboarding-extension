const searchParams = new URLSearchParams(window.location.search);

const version = Number(searchParams.get('version'));
const query = searchParams.get('query');

// Translate content
document.querySelectorAll('[data-i18n]').forEach((element) => {
  element.textContent = browser.i18n.getMessage(element.dataset.i18n);
});

async function submit() {
  const searchEngineName = document.querySelector('input:checked').value;

  browser.ghostery?.setDefaultSearchEngine(searchEngineName);

  await browser.runtime.sendMessage('onboarding-complete');
  const currentTab = await browser.tabs.getCurrent();

  const searchTab = await browser.tabs.create({});

  browser.search.search({
    query,
    engine: searchEngineName,
    tabId: searchTab.id,
  });

  browser.tabs.remove(currentTab.id);
}

document.querySelector('button').addEventListener('click', submit);

document.querySelectorAll('input[name="search"]').forEach((elem) => {
  elem.addEventListener('change', (event) => {
    const id = event.target.id;
    [...document.querySelectorAll('.description, .icon')].forEach((e) =>
      e.classList.add('hidden'),
    );
    [
      ...document.querySelectorAll(
        `.description[data-description-for=${id}], .icon[for=${id}]`,
      ),
    ].forEach((e) => e.classList.remove('hidden'));
  });
});

const firstInput = document.querySelector('input');
firstInput.checked = true;
firstInput.dispatchEvent(new Event('change'));
