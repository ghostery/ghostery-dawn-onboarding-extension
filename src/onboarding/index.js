const searchParams = new URLSearchParams(window.location.search);

const version = Number(searchParams.get('version'));
const query = searchParams.get('query');

(function setupStep1() {
  const TIMER = 3000;

  const step1 = document.querySelector('.tab1');
  const step2 = document.querySelector('.tab2');

  const timer = setTimeout(nextPage, TIMER);

  function nextPage() {
    clearInterval(timer);
    step1.classList.add('hidden');
    step2.classList.remove('hidden');
  }
})();

(function setupStep2() {
  async function submit() {
    const searchEngineName = document.querySelector(
      '.tab2 input:checked',
    ).value;

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

  document.querySelector('.tab2 button').addEventListener('click', submit);

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

  (function selectFirstInput() {
    const firstInput = document.querySelector('.tab2 input');
    firstInput.checked = true;
    firstInput.dispatchEvent(new Event('change'));
  })();
})();
