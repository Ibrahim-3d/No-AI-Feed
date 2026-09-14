(() => {
  const advanced = document.getElementById('openAdvancedSettings');
  const manage = document.getElementById('manageFilters');
  const advancedTab = document.getElementById('advancedTabButton');

  advanced?.addEventListener('click', () => {
    manage?.click();
    advancedTab?.click();
  });
})();
