const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    toggle.textContent = open ? '×' : '☰';
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = '☰';
  }));
}
document.getElementById('year').textContent = new Date().getFullYear();


// Guardar las preferencias elegidas para conservarlas al volver a la web.
const languageSelect = document.getElementById('language-select');
const currencySelect = document.getElementById('currency-select');
if (languageSelect) {
  const savedLanguage = localStorage.getItem('selyra-language');
  if (savedLanguage && [...languageSelect.options].some(option => option.value === savedLanguage)) {
    languageSelect.value = savedLanguage;
  }
  languageSelect.addEventListener('change', () => {
    localStorage.setItem('selyra-language', languageSelect.value);
  });
}
if (currencySelect) {
  const savedCurrency = localStorage.getItem('selyra-currency');
  if (savedCurrency && [...currencySelect.options].some(option => option.value === savedCurrency)) {
    currencySelect.value = savedCurrency;
  }
  currencySelect.addEventListener('change', () => {
    localStorage.setItem('selyra-currency', currencySelect.value);
  });
}
