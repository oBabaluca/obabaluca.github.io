// Menu para celular: mantém os estados visual e acessível sincronizados.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');

function closeMenu() {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  navigation.classList.toggle('is-open', !isOpen);
  menuButton.setAttribute('aria-expanded', String(!isOpen));
});

navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.header-inner')) closeMenu();
});
window.matchMedia('(max-width: 560px)').addEventListener('change', closeMenu);

// Indica a seção atual na navegação, sem interferir na navegação por teclado.
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navigation.querySelectorAll('a').forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
  document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
}

// O contato por e-mail funciona mesmo sem JavaScript.
const copyButton = document.querySelector('.copy-email');
const copyFeedback = document.querySelector('.copy-feedback');
let feedbackTimer;
copyButton.addEventListener('click', async () => {
  try {
    if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(copyButton.dataset.email);
    copyFeedback.textContent = 'E-mail copiado!';
  } catch {
    copyFeedback.textContent = `Copie o endereço: ${copyButton.dataset.email}`;
  }
  window.clearTimeout(feedbackTimer);
  feedbackTimer = window.setTimeout(() => { copyFeedback.textContent = ''; }, 8000);
});

// A assinatura aparece como alternativa caso a arte local não carregue.
const identityArt = document.querySelector('.identity-art');
function showArtFallback() {
  identityArt.hidden = true;
  identityArt.style.display = 'none';
  document.querySelector('.art-fallback').hidden = false;
}
identityArt.addEventListener('error', showArtFallback);
if (identityArt.complete && identityArt.naturalWidth === 0) showArtFallback();
document.querySelectorAll('.project-visual img').forEach(image => {
  const handleError = () => { image.style.visibility = 'hidden'; };
  image.addEventListener('error', handleError);
  if (image.complete && image.naturalWidth === 0) handleError();
});

document.querySelector('#year').textContent = new Date().getFullYear();
