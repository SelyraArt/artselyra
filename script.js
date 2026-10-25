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
const yearElement = document.getElementById('year');
if (yearElement) yearElement.textContent = new Date().getFullYear();


// Guardar las preferencias elegidas y mostrar las banderas de forma consistente en todos los navegadores.
const languageSelect = document.getElementById('language-select');
const currencySelect = document.getElementById('currency-select');
const languagePickerButton = document.getElementById('language-picker-button');
const languagePickerMenu = document.getElementById('language-picker-menu');
const languageCurrentFlag = document.getElementById('language-current-flag');
const languageCurrentName = document.getElementById('language-current-name');
const languageDetails = {
  es: { flag: '🇪🇸', name: 'Español' },
  en: { flag: '🇬🇧', name: 'English' },
  fr: { flag: '🇫🇷', name: 'Français' },
  de: { flag: '🇩🇪', name: 'Deutsch' },
  it: { flag: '🇮🇹', name: 'Italiano' },
  pt: { flag: '🇵🇹', name: 'Português' },
  nl: { flag: '🇳🇱', name: 'Nederlands' },
  sv: { flag: '🇸🇪', name: 'Svenska' },
  da: { flag: '🇩🇰', name: 'Dansk' },
  no: { flag: '🇳🇴', name: 'Norsk' },
  ja: { flag: '🇯🇵', name: '日本語' },
  zh: { flag: '🇨🇳', name: '中文' }
};
function updateLanguagePicker() {
  if (!languageSelect) return;
  const language = languageDetails[languageSelect.value] || languageDetails.es;
  if (languageCurrentFlag) languageCurrentFlag.textContent = language.flag;
  if (languageCurrentName) languageCurrentName.textContent = language.name;
  if (languagePickerMenu) {
    languagePickerMenu.querySelectorAll('[data-language]').forEach(option => {
      option.setAttribute('aria-selected', String(option.dataset.language === languageSelect.value));
    });
  }
}
if (languageSelect) {
  const savedLanguage = localStorage.getItem('selyra-language');
  if (savedLanguage && [...languageSelect.options].some(option => option.value === savedLanguage)) {
    languageSelect.value = savedLanguage;
  }
  updateLanguagePicker();
  languageSelect.addEventListener('change', () => {
    localStorage.setItem('selyra-language', languageSelect.value);
    updateLanguagePicker();
  });
}
if (languagePickerButton && languagePickerMenu) {
  languagePickerButton.addEventListener('click', () => {
    const isOpen = languagePickerButton.getAttribute('aria-expanded') === 'true';
    languagePickerButton.setAttribute('aria-expanded', String(!isOpen));
    languagePickerMenu.hidden = isOpen;
  });
  languagePickerMenu.querySelectorAll('[data-language]').forEach(option => {
    option.addEventListener('click', () => {
      if (languageSelect) {
        languageSelect.value = option.dataset.language;
        languageSelect.dispatchEvent(new Event('change'));
      }
      languagePickerMenu.hidden = true;
      languagePickerButton.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.language-picker')) {
      languagePickerMenu.hidden = true;
      languagePickerButton.setAttribute('aria-expanded', 'false');
    }
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


// Formulario de contacto: prepara un correo en la aplicación de correo de la persona.
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const subject = String(formData.get('subject') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const mailSubject = subject ? `Selyra — ${subject}` : 'Mensaje desde la web de Selyra';
    const mailBody = `Nombre: ${name}\nCorreo: ${email}\nMotivo: ${subject}\n\nMensaje:\n${message}`;
    window.location.href = `mailto:contact@artselyra.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
  });
}
