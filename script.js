// Seleciona o botão do menu mobile e o menu principal.
const menuToggle = document.querySelector('.menu-toggle');
const navs = document.querySelectorAll('.main-nav');
const siteHeader = document.querySelector('.site-header');
const navWrap = document.querySelector('.nav-wrap');
const brandItem = document.querySelector('.brand-item');

if (siteHeader && navWrap && !navWrap.querySelector('.header-social-links')) {
  const socialLinks = document.createElement('div');
  socialLinks.className = 'header-social-links';
  socialLinks.setAttribute('aria-label', 'Redes sociais');
  socialLinks.style.cssText = 'position:absolute;left:12px;top:50%;transform:translateY(-50%);display:flex;align-items:center;gap:10px;z-index:2;';
  socialLinks.innerHTML = `
    <a href="https://instagram.com/inoxcolor" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style="display:flex;align-items:center;justify-content:center;width:22px;height:22px;color:#d3b77f;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r=".75" fill="currentColor" stroke="none"></circle>
      </svg>
    </a>
    <a href="https://www.linkedin.com/in/inoxcolor-a%C3%A7os-inoxidaveis-coloridos-s-a-a86ba4387?utm_source=share_via&amp;utm_content=profile&amp;utm_medium=member_android" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style="display:flex;align-items:center;justify-content:center;width:22px;height:22px;color:#d3b77f;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM8.34 18V9.6H5.55V18h2.79ZM6.95 8.45a1.61 1.61 0 1 0 0-3.22 1.61 1.61 0 0 0 0 3.22ZM18.45 18v-4.6c0-2.46-1.31-3.6-3.06-3.6a2.64 2.64 0 0 0-2.38 1.31V9.6h-2.79V18h2.79v-4.16c0-1.1.21-2.17 1.58-2.17 1.36 0 1.38 1.27 1.38 2.24V18h2.48Z"></path>
      </svg>
    </a>`;
  navWrap.insertBefore(socialLinks, navWrap.firstChild);
}

// Reúne os dois grupos de links em um único painel apenas no comportamento mobile.
let mobileMenuPanel = null;
if (navWrap && navs.length) {
  mobileMenuPanel = document.createElement('div');
  mobileMenuPanel.className = 'mobile-menu-panel';
  navWrap.insertBefore(mobileMenuPanel, brandItem || navs[0]);
  navs.forEach(nav => mobileMenuPanel.appendChild(nav));

  const mobileBudgetLink = document.createElement('a');
  mobileBudgetLink.className = 'mobile-budget-link';
  const contactPageLink = Array.from(navWrap.querySelectorAll('a[href]')).find(link =>
    new URL(link.href).pathname.endsWith('/contato.html')
  );
  mobileBudgetLink.href = contactPageLink ? contactPageLink.getAttribute('href') : 'contato.html';
  mobileBudgetLink.textContent = 'Orçamento';
  navs[navs.length - 1].appendChild(mobileBudgetLink);

  const mobileContactLinks = Array.from(mobileMenuPanel.querySelectorAll('a')).filter(link =>
    link !== mobileBudgetLink &&
    new URL(link.href).pathname.endsWith('/contato.html') &&
    link.textContent.trim().toLowerCase() === 'contato'
  );
  const updateMobileBudgetVisibility = () => {
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    mobileBudgetLink.style.display = isMobile ? '' : 'none';
    mobileContactLinks.forEach(link => {
      link.style.display = isMobile ? 'none' : '';
    });
  };
  updateMobileBudgetVisibility();
  window.addEventListener('resize', updateMobileBudgetVisibility);
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
