(() => {
  const button = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  if (!button || !nav) return;

  const setMenuOpen = (open) => {
    nav.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
    const isEnglish = document.documentElement.lang === 'en';
    button.setAttribute(
      'aria-label',
      isEnglish ? (open ? 'Close menu' : 'Open menu') : (open ? 'Закрыть меню' : 'Открыть меню')
    );
  };

  button.addEventListener('click', () => {
    setMenuOpen(button.getAttribute('aria-expanded') !== 'true');
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenuOpen(false);
  });

  document.addEventListener('click', (event) => {
    if (!nav.contains(event.target) && !button.contains(event.target)) {
      setMenuOpen(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenuOpen(false);
  });

  window.matchMedia('(min-width: 641px)').addEventListener('change', () => {
    setMenuOpen(false);
  });
})();
