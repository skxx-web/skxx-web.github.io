(function () {
  'use strict';

  var slides = [
    { src: 'assets/hero-main.webp', fallback: 'assets/hero-main.jpg', alt: 'Бургер Телецбург крупным планом' },
    { src: 'assets/hero-alt.webp', fallback: 'assets/hero-alt.jpg', alt: 'Бургер с сыром и начинкой на исходной странице Телецбурга' }
  ];
  var activeSlide = 0;
  var image = document.querySelector('#hero-photo');
  var heroVisual = document.querySelector('#hero-visual');
  var slideNumber = document.querySelector('#slide-current');
  var transitionTimer;

  function setSlideImage(slide) {
    if (!image) return;
    image.onerror = function () {
      if (image.getAttribute('src') !== slide.fallback) image.setAttribute('src', slide.fallback);
    };
    image.setAttribute('data-fallback', slide.fallback);
    image.setAttribute('src', slide.src);
    image.setAttribute('alt', slide.alt);
  }

  function showSlide(nextIndex) {
    activeSlide = (nextIndex + slides.length) % slides.length;
    if (heroVisual) heroVisual.classList.add('is-changing');
    window.clearTimeout(transitionTimer);
    transitionTimer = window.setTimeout(function () {
      setSlideImage(slides[activeSlide]);
      if (slideNumber) slideNumber.textContent = String(activeSlide + 1).padStart(2, '0');
      window.requestAnimationFrame(function () {
        if (heroVisual) heroVisual.classList.remove('is-changing');
      });
    }, 170);
  }

  var next = document.querySelector('#photo-next');
  var prev = document.querySelector('#photo-prev');
  if (next) next.addEventListener('click', function () { showSlide(activeSlide + 1); });
  if (prev) prev.addEventListener('click', function () { showSlide(activeSlide - 1); });

  var menuToggle = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('#mobile-nav');
  function closeMenu() {
    if (mobileNav) mobileNav.hidden = true;
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Открыть меню');
    }
  }
  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      var isOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
      if (mobileNav) mobileNav.hidden = !isOpen;
    });
  }
  if (mobileNav) {
    var links = mobileNav.querySelectorAll('a');
    for (var i = 0; i < links.length; i += 1) links[i].addEventListener('click', closeMenu);
  }
  window.addEventListener('resize', function () {
    if (window.innerWidth > 620) closeMenu();
  });
}());
