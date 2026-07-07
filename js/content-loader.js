(async () => {
  let content;
  try {
    const res = await fetch('https://orange-mouse-b123.sitemakery.workers.dev');
    if (!res.ok) return;
    content = await res.json();
  } catch {
    return; // фолбэк: тексты из HTML остаются как есть
  }

  // Достаём значение по точечному ключу вида "section.key"
  function get(key) {
    return key.split('.').reduce((o, k) => o?.[k], content);
  }

  // Безопасная замена содержимого: \n → <br>, остальное экранируется
  function esc(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function setContent(el, value) {
    if (value.includes('\n')) {
      el.innerHTML = value.split('\n').map(esc).join('<br>');
    } else {
      el.textContent = value;
    }
  }

  document.querySelectorAll('[data-content-key]').forEach(el => {
    const value = get(el.dataset.contentKey);
    if (typeof value === 'string') setContent(el, value);
  });
})();
