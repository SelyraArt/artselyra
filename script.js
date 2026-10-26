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
    applySelyraLanguage();
    renderSelyraCart();
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
    refreshCurrencyDisplay();
    renderSelyraCart();
  });
}



// Traducción inmediata de la interfaz, sin servicios externos ni textos inventados.
const originalTexts = new WeakMap();
function selyraTranslate(text) {
  const lang = localStorage.getItem('selyra-language') || 'es';
  const dictionary = (window.SELYRA_TRANSLATIONS || {})[lang] || {};
  return dictionary[text] || text;
}
function applySelyraLanguage() {
  const lang = localStorage.getItem('selyra-language') || 'es';
  document.documentElement.lang = lang;
  const dictionary = (window.SELYRA_TRANSLATIONS || {})[lang] || {};
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.parentElement || node.parentElement.closest('script,style,svg,.language-picker,#language-picker-menu,#language-current-name,#language-current-flag')) return NodeFilter.FILTER_REJECT;
      return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  let node;
  while ((node = walker.nextNode())) {
    if (!originalTexts.has(node)) originalTexts.set(node, node.textContent);
    const original = originalTexts.get(node);
    const clean = original.trim();
    const replacement = dictionary[clean] || clean;
    node.textContent = original.replace(clean, replacement);
  }
  document.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(input => {
    if (!input.dataset.originalPlaceholder) input.dataset.originalPlaceholder = input.placeholder;
    input.placeholder = dictionary[input.dataset.originalPlaceholder] || input.dataset.originalPlaceholder;
  });
  document.querySelectorAll('[data-original-label]').forEach(el => {
    el.setAttribute('aria-label', dictionary[el.dataset.originalLabel] || el.dataset.originalLabel);
  });
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.textContent = dictionary['Añadir al carrito'] || 'Añadir al carrito';
  });
}
function refreshCurrencyDisplay() {
  // No hay precios publicados: no calcular conversiones sin un precio base ni una tasa verificable.
  const currency = (currencySelect && currencySelect.value) || localStorage.getItem('selyra-currency') || 'EUR';
  document.documentElement.dataset.currency = currency;
  document.querySelectorAll('[data-price-eur]').forEach(element => {
    // Los precios futuros deben publicarse con su importe en EUR y una fuente de cambio fiable.
    element.textContent = 'Precio por confirmar';
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


// Una sola barra visible: cabecera completa al inicio, barra fina al subir.
const siteHeader = document.querySelector('.site-header');
const compactNavigation = document.getElementById('compact-navigation');
let lastScrollY = window.scrollY;
let scrollTicking = false;
function updateNavigationOnScroll() {
  const currentY = window.scrollY;
  const cartIsOpen = document.body.classList.contains('cart-open');
  const atTop = currentY < 110;
  const goingUp = currentY < lastScrollY - 2;
  const goingDown = currentY > lastScrollY + 5;
  if (siteHeader) {
    siteHeader.classList.toggle('header-hidden', !atTop);
    siteHeader.classList.toggle('header-visible', atTop);
  }
  if (compactNavigation) {
    if (atTop) compactNavigation.classList.remove('is-visible');
    else if (goingUp || cartIsOpen) compactNavigation.classList.add('is-visible');
    else if (goingDown) compactNavigation.classList.remove('is-visible');
  }
  lastScrollY = currentY;
}
if (siteHeader) {
  updateNavigationOnScroll();
  window.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(() => {
      updateNavigationOnScroll();
      scrollTicking = false;
    });
  }, { passive: true });
}

// Carrito de selección local. Los artículos se conservan en este navegador.
const cartOpenButton = document.getElementById('cart-open');
const compactCartOpenButton = document.getElementById('compact-cart-open');
const compactCartCount = document.getElementById('compact-cart-count');
const cartCloseButton = document.getElementById('cart-close');
const cartPanel = document.getElementById('cart-panel');
const cartBackdrop = document.getElementById('cart-backdrop');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartHeadingCount = document.getElementById('cart-heading-count');
const cartTotal = document.getElementById('cart-total');
const cartCheckout = document.getElementById('cart-checkout');
const cartClear = document.getElementById('cart-clear');
let selyraCart = [];
try {
  const storedCart = JSON.parse(localStorage.getItem('selyra-cart') || '[]');
  if (Array.isArray(storedCart)) selyraCart = storedCart.filter(item => item && item.id && item.name);
} catch (error) {
  selyraCart = [];
}
function saveSelyraCart() {
  try { localStorage.setItem('selyra-cart', JSON.stringify(selyraCart)); } catch (error) {}
}
function renderSelyraCart() {
  const count = selyraCart.length;
  if (cartCount) cartCount.textContent = String(count);
  if (compactCartCount) compactCartCount.textContent = String(count);
  if (cartHeadingCount) cartHeadingCount.textContent = '(' + count + ')';
  if (cartTotal) cartTotal.textContent = (count ? selyraTranslate('Precio por confirmar') : selyraTranslate('Precio por confirmar')) + ' · ' + (localStorage.getItem('selyra-currency') || 'EUR');
  if (cartItemsContainer) {
    if (!count) {
      cartItemsContainer.innerHTML = '<p class="cart-empty"></p>';
      cartItemsContainer.querySelector('.cart-empty').textContent = selyraTranslate('Tu carrito está vacío.');
    } else {
      cartItemsContainer.innerHTML = selyraCart.map(item =>
        '<div class="cart-item"><div><p class="cart-item-name"></p><p class="cart-item-detail">Precio por confirmar</p></div><button type="button" class="cart-item-remove" data-remove-id="' + encodeURIComponent(item.id) + '">Quitar</button></div>'
      ).join('');
      cartItemsContainer.querySelectorAll('.cart-item').forEach((row, index) => {
        row.querySelector('.cart-item-detail').textContent = selyraTranslate('Precio por confirmar');
        row.querySelector('.cart-item-remove').textContent = selyraTranslate('Quitar');
        const name = row.querySelector('.cart-item-name');
        if (name) name.textContent = selyraCart[index].name;
      });
    }
  }
  if (cartCheckout) cartCheckout.disabled = count === 0;
}
function openSelyraCart() {
  if (!cartPanel || !cartBackdrop) return;
  cartPanel.hidden = false;
  cartBackdrop.hidden = false;
  cartPanel.setAttribute('aria-hidden', 'false');
  if (cartOpenButton) cartOpenButton.setAttribute('aria-expanded', 'true');
  if (compactCartOpenButton) compactCartOpenButton.setAttribute('aria-expanded', 'true');
  document.body.classList.add('cart-open');
  if (cartCloseButton) cartCloseButton.focus();
}
function closeSelyraCart() {
  if (!cartPanel || !cartBackdrop) return;
  cartPanel.hidden = true;
  cartBackdrop.hidden = true;
  cartPanel.setAttribute('aria-hidden', 'true');
  if (cartOpenButton) {
    cartOpenButton.setAttribute('aria-expanded', 'false');
    cartOpenButton.focus();
  }
  if (compactCartOpenButton) compactCartOpenButton.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('cart-open');
}
if (cartOpenButton) cartOpenButton.addEventListener('click', openSelyraCart);
if (compactCartOpenButton) compactCartOpenButton.addEventListener('click', openSelyraCart);
if (cartCloseButton) cartCloseButton.addEventListener('click', closeSelyraCart);
if (cartBackdrop) cartBackdrop.addEventListener('click', closeSelyraCart);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && cartPanel && !cartPanel.hidden) closeSelyraCart();
});
document.addEventListener('click', event => {
  const addButton = event.target.closest('.add-to-cart');
  if (addButton) {
    const id = addButton.dataset.productId;
    const name = addButton.dataset.productName;
    if (id && name && !selyraCart.some(item => item.id === id)) selyraCart.push({ id, name });
    saveSelyraCart();
    renderSelyraCart();
    openSelyraCart();
    return;
  }
  const removeButton = event.target.closest('[data-remove-id]');
  if (removeButton) {
    const id = decodeURIComponent(removeButton.dataset.removeId);
    selyraCart = selyraCart.filter(item => item.id !== id);
    saveSelyraCart();
    renderSelyraCart();
  }
});
if (cartClear) cartClear.addEventListener('click', () => {
  selyraCart = [];
  saveSelyraCart();
  renderSelyraCart();
});
if (cartCheckout) cartCheckout.addEventListener('click', () => {
  if (!selyraCart.length) return;
  const selection = selyraCart.map((item, index) => (index + 1) + '. ' + item.name).join('\n');
  const subject = encodeURIComponent('Consulta de compra — Selyra');
  const body = encodeURIComponent('Hola Selyra, me interesa consultar disponibilidad y precio de estas obras:\n\n' + selection + '\n\n¿Podrías indicarme precio final, envío y forma de pago?');
  window.location.href = 'mailto:contact@artselyra.com?subject=' + subject + '&body=' + body;
});
renderSelyraCart();

applySelyraLanguage();
refreshCurrencyDisplay();
