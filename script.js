// Seleciona o botão do menu mobile e o menu principal.
const menuToggle = document.querySelector('.menu-toggle');
const navs = document.querySelectorAll('.main-nav');
const siteHeader = document.querySelector('.site-header');
const navWrap = document.querySelector('.nav-wrap');
const brandItem = document.querySelector('.brand-item');

// Reúne os dois grupos de links em um único painel apenas no comportamento mobile.
let mobileMenuPanel = null;
if (navWrap && brandItem && navs.length) {
  mobileMenuPanel = document.createElement('div');
  mobileMenuPanel.className = 'mobile-menu-panel';
  navWrap.insertBefore(mobileMenuPanel, brandItem);
  navs.forEach(nav => mobileMenuPanel.appendChild(nav));
}

// Muda a cor do header após passar pelo carrossel
window.addEventListener('scroll', () => {
  if (siteHeader) {
    if (window.scrollY > window.innerHeight * 0.1) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }
});

// Só executa a lógica se os elementos existirem na página.
if (menuToggle && navs.length && mobileMenuPanel) {
  // Quando o botão for clicado, alterna o estado do menu.
  menuToggle.addEventListener('click', () => {
    // Toggle adiciona ou remove a classe 'open' no menu.
    const isOpen = !navs[0].classList.contains('open');
    navs.forEach(nav => nav.classList.toggle('open', isOpen));
    mobileMenuPanel.classList.toggle('open', isOpen);
    menuToggle.classList.toggle('is-open', isOpen);
    // Atualiza o atributo aria-expanded para acessibilidade.
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');

  });

  navs.forEach(nav => nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      navs.forEach(item => item.classList.remove('open'));
      mobileMenuPanel.classList.remove('open');
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menu');
    }
  }));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navs[0].classList.contains('open')) {
      navs.forEach(nav => nav.classList.remove('open'));
      mobileMenuPanel.classList.remove('open');
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menu');
      menuToggle.focus();
    }
  });
}

// Seleciona o track e todas as imagens do slider da home.
// Função para inicializar cada slider independentemente
const initSlider = (sliderElement) => {
  const sliderTrack = sliderElement.querySelector('.pure-slider-track');
  const sliderImages = Array.from(sliderElement.querySelectorAll('.pure-slider-track img'));
  const prevButton = sliderElement.querySelector('.slider-btn.prev');
  const nextButton = sliderElement.querySelector('.slider-btn.next');

  // Só inicializa o controle do slider se houver imagens no carrossel.
  if (sliderTrack && sliderImages.length > 0) {
    // Define o índice atual da imagem visible no slider.
    let currentIndex = 0;

    // Função responsável por mover a faixa para a imagem correta.
    const showSlide = (index) => {
      // Ajusta o índice para girar no ciclo quando chegar no fim ou no começo.
      const normalizedIndex = (index + sliderImages.length) % sliderImages.length;
      currentIndex = normalizedIndex;
      // Move a faixa para a esquerda de acordo com o número da imagem atual.
      sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
    };

    // Avança para a próxima imagem do slider.
    const nextSlide = () => showSlide(currentIndex + 1);

    // Volta para a imagem anterior do slider.
    const prevSlide = () => showSlide(currentIndex - 1);

    // Reinicia o autoplay sempre que o cliente usar as setas.
    let autoplayId = setInterval(nextSlide, 4000);
    const restartAutoplay = () => {
      clearInterval(autoplayId);
      autoplayId = setInterval(nextSlide, 4000);
    };

    // Quando clicar na seta da esquerda, volta uma imagem e reinicia o tempo.
    prevButton?.addEventListener('click', () => {
      prevSlide();
      restartAutoplay();
    });

    // Quando clicar na seta da direita, avança uma imagem e reinicia o tempo.
    nextButton?.addEventListener('click', () => {
      nextSlide();
      restartAutoplay();
    });
  }
};

// Inicializa todos os sliders (desktop e mobile)
document.querySelectorAll('.pure-slider').forEach(slider => {
  initSlider(slider);
});

// Inicializa o carrossel de imagens da página Porcelinox.
document.querySelectorAll('.porcelinox-carousel, .colunas-carousel').forEach((carousel) => {
  const track = carousel.querySelector('.porcelinox-carousel-track, .colunas-carousel-track');
  const images = Array.from(carousel.querySelectorAll('.porcelinox-carousel-track img, .colunas-carousel-track img'));
  const previousButton = carousel.querySelector('.slider-btn.prev');
  const nextButton = carousel.querySelector('.slider-btn.next');
  let currentIndex = 0;

  if (!track || !images.length) return;

  const getVisibleImages = () => 1;
  const showSlide = (index) => {
    const visibleImages = getVisibleImages();
    const lastIndex = Math.max(0, images.length - visibleImages);
    currentIndex = Math.min(Math.max(index, 0), lastIndex);
    track.style.transform = `translate3d(-${currentIndex * 100}%, 0, 0)`;
  };

  showSlide(0);

  previousButton?.addEventListener('click', () => showSlide(currentIndex - 1));
  nextButton?.addEventListener('click', () => showSlide(currentIndex + 1));
  window.addEventListener('resize', () => showSlide(currentIndex));

  const advanceSlide = () => {
    const visibleImages = getVisibleImages();
    const lastIndex = Math.max(0, images.length - visibleImages);
    showSlide(currentIndex >= lastIndex ? 0 : currentIndex + 1);
  };

  setInterval(advanceSlide, 4000);
});

// Seleciona o formulário de newsletter, se ele existir.
document.querySelector('.newsletter-form')?.addEventListener('submit', (event) => {
  // Evita o envio padrão do formulário.
  event.preventDefault();
  // Busca o botão e o campo de email dentro do formulário.
  const button = event.currentTarget.querySelector('button');
  const input = event.currentTarget.querySelector('input');

  // Só executa se o campo tiver algum valor preenchido.
  if (input.value.trim()) {
    button.textContent = 'Enviado';
    button.disabled = true;
    input.value = '';
  }
});

document.querySelectorAll('.contact-dropdown').forEach((menu) => {
  menu.querySelectorAll('input[type="radio"]').forEach((option) => {
    option.addEventListener('change', () => {
      menu.querySelector('summary').textContent = option.value;
      menu.open = false;
    });
  });
});

document.querySelectorAll('.footer-bottom-inner').forEach((footerBottom) => {
  if (footerBottom.querySelector('.footer-note')) return;

  const note = document.createElement('span');
  note.className = 'footer-note';
  note.textContent = 'As tonalidades das cores podem variar conforme a incidência e a refração da luz. Para uma escolha precisa, solicite seu catálogo de amostras. Imagens ilustrativas.';
  footerBottom.insertBefore(note, footerBottom.firstChild);
});

