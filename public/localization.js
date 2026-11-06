(() => {
  'use strict';

  const COUNTRY_API = 'https://api.country.is/';
  const RATE_API = 'https://api.frankfurter.dev/v2/rate/RUB/USD';
  const RATE_CACHE_KEY = 'kweb-rub-usd-rate-v1';
  const RATE_CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
  const FALLBACK_RUB_TO_USD = 0.01223; // Last verified daily reference rate; display remains approximate.

  const EN = Object.freeze({
    'Прайс': 'Pricing',
    'Пример работы': 'Selected work',
    'Контакты': 'Contact',
    'Обсудить проект': 'Discuss a project',
    'Разработка сайтов / 2026': 'Website design & development / 2026',
    'Создание сайтов': 'Websites',
    'под ключ': 'built to',
    'для бизнеса.': 'fit your business.',
    'Создадим для вашего бизнеса уникальный сайт под ключ. Наша команда дизайнеров и разработчиков продумывает идею, визуальный стиль и структуру — и доводит проект до запуска.': 'We create distinctive, turnkey websites for businesses. Our design and development team shapes the concept, visual identity and structure — then takes each project through launch.',
    'Обсудить задачу': 'Discuss your project',
    'Индивидуальный дизайн': 'Custom design',
    'Адаптация под все экраны': 'Responsive on every screen',
    'Ваш бизнес': 'Your business',
    'в фокусе': 'in focus',
    'Основной прайс-лист': 'Services & pricing',
    'Прозрачно': 'Clear',
    'по стоимости.': 'pricing.',
    'Создание сайта — 10 000 ₽. Первый месяц обслуживания бесплатно. Со второго месяца стоимость зависит от выбранного тарифа.': 'Website creation — {{RUB:10000}}. Your first month of maintenance is free. From month two, the price depends on the selected plan.',
    'Сайт под ключ': 'Turnkey website',
    'Создание сайта — 10 000 ₽. Первый месяц обслуживания бесплатно.': 'Website creation — {{RUB:10000}}. Your first month of maintenance is free.',
    '10 000 ₽': '{{RUB:10000}}',
    'Со второго месяца — 5 000 ₽/мес.': 'From month two — {{RUB:5000}}/month.',
    'Создание и публикация одностраничного сайта': 'Design and launch of a one-page website',
    'Адаптация под смартфоны': 'Optimized for smartphones',
    'Информация о компании, товарах и услугах': 'Information about your company, products and services',
    'Цены, фотографии, контакты и график работы': 'Pricing, photos, contact details and opening hours',
    'Карта, ссылки на соцсети и мессенджеры': 'Map, social media and messenger links',
    'Поддержание работоспособности сайта': 'Website maintenance',
    'Контроль доступности сайта и основных ссылок': 'Monitoring website availability and key links',
    'Изменения сверх включённого обслуживания — 2 000 ₽ за согласованную задачу': 'Changes beyond included maintenance — {{RUB:2000}} per agreed task',
    'Выбрать формат': 'Choose a plan',
    'Сайт + базовое обслуживание': 'Website + essential maintenance',
    'Со второго месяца — 7 500 ₽/мес.': 'From month two — {{RUB:7500}}/month.',
    'Всё из тарифа «Сайт под ключ»': 'Everything in the Turnkey Website plan',
    'Базовое обслуживание — 5 000 ₽/мес.': 'Essential maintenance — {{RUB:5000}}/month',
    'Базовое сопровождение контента — 2 500 ₽/мес.': 'Basic content support — {{RUB:2500}}/month',
    'Одно плановое обновление сайта в месяц': 'One scheduled website update per month',
    'Изменение цен, меню и списка услуг': 'Updates to pricing, menus and service lists',
    'Замена фотографий и текстов': 'Photo and copy updates',
    'Обновление акций и информации о компании': 'Updates to promotions and company information',
    'Дополнительные задачи сверх месячного обновления — 2 000 ₽ за согласованную задачу': 'Additional tasks beyond the monthly update — {{RUB:2000}} per agreed task',
    'Сайт + активное сопровождение': 'Website + ongoing support',
    'Со второго месяца — 10 000 ₽/мес.': 'From month two — {{RUB:10000}}/month.',
    'Всё из предыдущих тарифов': 'Everything in the previous plans',
    'Активное сопровождение — 5 000 ₽/мес.': 'Ongoing support — {{RUB:5000}}/month',
    'Три плановых обновления сайта в месяц': 'Three scheduled website updates per month',
    'Регулярное обновление цен, меню и услуг': 'Regular updates to pricing, menus and services',
    'Замена фотографий, текстов и информации об акциях': 'Updates to photos, copy and promotion details',
    'Изменение контактных данных и ссылок': 'Updates to contact details and links',
    'Небольшие изменения существующих блоков сайта': 'Small changes to existing website sections',
    'Новые страницы, сложный функционал и крупный редизайн оцениваются отдельно': 'New pages, complex features and major redesigns are quoted separately',
    'Условия': 'Maintenance',
    'обслуживания': 'terms',
    'Со второго месяца': 'From month two,',
    'работы сайта — 5 000 ₽/мес. независимо от выбранного тарифа. Ежемесячное обслуживание оплачивается отдельно.': 'ongoing website maintenance is {{RUB:5000}}/month, regardless of the selected plan. Monthly maintenance is billed separately.',
    'Изменения сверх включённого обслуживания —': 'Changes beyond included maintenance —',
    '2 000 ₽ за согласованную задачу': '{{RUB:2000}} per agreed task',
    '. Новые страницы, сложный функционал и крупный редизайн оцениваются отдельно.': '. New pages, complex features and major redesigns are quoted separately.',
    'Важно': 'Good to know',
    'Стоимость домена, платных сервисов и дополнительные расходы, если они потребуются, согласовываются индивидуально до начала работ.': 'Domain fees, paid services and any additional costs will be discussed and agreed before work begins.',
    'САЙТЫ ПОД КЛЮЧ': 'TURNKEY WEBSITES',
    'ДЛЯ БИЗНЕСА': 'FOR BUSINESS',
    'ДИЗАЙН + РАЗРАБОТКА': 'DESIGN + DEVELOPMENT',
    'Реальный проект · Бургерная': 'Featured project · Burger restaurant',
    'Телецбург': 'Teletsburg',
    'Открыть сайт': 'View project',
    'Под вашу нишу, стиль и цели соберу отдельную историю.': 'We create a distinctive digital experience tailored to your industry, style and goals.',
    'Расскажите,': 'Tell us,',
    'что запускаем?': 'what shall we build?',
    'Напишите в удобный мессенджер или на почту. Коротко обсудим задачу и поймём, с чего начать.': 'Message us on your preferred messenger or by email. We’ll discuss your project and find the best way to get started.',
    'Написать в Телеграмм': 'Message us on Telegram',
    'Написать в MAX': 'Message us on MAX',
    'Написать на почту': 'Email us',
    'Сайты под ключ для бизнеса · Все права защищены': 'Turnkey websites for businesses · All rights reserved',
    'Наверх': 'Back to top'
  });

  const RU_META = {
    title: 'Создание сайтов под ключ для бизнеса | k web',
    description: 'Создание сайтов под ключ для бизнеса. Команда дизайнеров и разработчиков создаёт адаптивные сайты, помогает с запуском и сопровождением.',
    ogDescription: 'Команда дизайнеров и разработчиков создаёт уникальные сайты под ключ для бизнеса — от идеи до запуска.',
    twitterDescription: 'Команда дизайнеров и разработчиков создаёт уникальные сайты под ключ для бизнеса.'
  };
  const EN_META = {
    title: 'Turnkey Website Design & Development for Businesses | k web',
    description: 'A team of designers and developers creates distinctive, responsive turnkey websites for businesses — from the initial concept to launch.',
    ogDescription: 'Our design and development team creates distinctive turnkey websites for businesses — from concept to launch.',
    twitterDescription: 'Distinctive turnkey websites for businesses, created by our design and development team.'
  };

  const originalTextNodes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const parent = node.parentElement;
    if (!parent || parent.closest('script,style,svg,noscript')) continue;
    originalTextNodes.push({ node, value: node.nodeValue });
  }

  function withTimeout(url, milliseconds) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), milliseconds);
    return fetch(url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-store',
      referrerPolicy: 'no-referrer',
      headers: { Accept: 'application/json' },
      signal: controller.signal
    }).then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    }).finally(() => window.clearTimeout(timer));
  }

  function readCachedRate() {
    try {
      const cached = JSON.parse(window.localStorage.getItem(RATE_CACHE_KEY) || 'null');
      if (cached && Number.isFinite(cached.rate) && cached.rate > 0 &&
          Number.isFinite(cached.savedAt) && Date.now() - cached.savedAt < RATE_CACHE_MAX_AGE) {
        return cached.rate;
      }
    } catch (_) {
      // Storage may be disabled; continue with the embedded fallback rate.
    }
    return FALLBACK_RUB_TO_USD;
  }

  function formatUsd(rubles, rate) {
    const amount = Math.round(Number(rubles) * rate);
    return `≈ USD ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(amount)}`;
  }

  function updateMeta(language) {
    const meta = language === 'en' ? EN_META : RU_META;
    document.documentElement.lang = language;
    document.title = meta.title;
    const setContent = (selector, value) => {
      const element = document.querySelector(selector);
      if (element) element.setAttribute('content', value);
    };
    setContent('meta[name="description"]', meta.description);
    setContent('meta[property="og:title"]', meta.title);
    setContent('meta[property="og:description"]', meta.ogDescription);
    setContent('meta[name="twitter:title"]', meta.title);
    setContent('meta[name="twitter:description"]', meta.twitterDescription);
    const structuredData = document.querySelector('script[type="application/ld+json"]');
    if (structuredData) {
      try {
        const data = JSON.parse(structuredData.textContent);
        data.inLanguage = language;
        structuredData.textContent = JSON.stringify(data);
      } catch (_) {
        // Do not let metadata parsing affect page rendering.
      }
    }
  }

  function updateAccessibleLabels(language) {
    const brand = document.querySelector('a.brand');
    const nav = document.querySelector('nav.main-nav');
    const menu = document.querySelector('.menu-toggle');
    if (brand) brand.setAttribute('aria-label', language === 'en' ? 'k web — Home' : 'k web — на главную');
    if (nav) nav.setAttribute('aria-label', language === 'en' ? 'Main navigation' : 'Основная навигация');
    if (menu) {
      const isOpen = menu.getAttribute('aria-expanded') === 'true';
      menu.setAttribute('aria-label', language === 'en'
        ? (isOpen ? 'Close menu' : 'Open menu')
        : (isOpen ? 'Закрыть меню' : 'Открыть меню'));
    }
  }

  function applyLanguage(language, rubToUsd) {
    const useEnglish = language === 'en';
    const rate = Number.isFinite(rubToUsd) && rubToUsd > 0 ? rubToUsd : FALLBACK_RUB_TO_USD;
    for (const { node, value } of originalTextNodes) {
      const leading = (value.match(/^\s*/) || [''])[0];
      const trailing = (value.match(/\s*$/) || [''])[0];
      const key = value.trim().replace(/\s+/g, ' ');
      let translated = useEnglish ? EN[key] : undefined;
      if (translated === undefined) translated = key;
      if (useEnglish) {
        translated = translated.replace(/\{\{RUB:(\d+)\}\}/g, (_, amount) => formatUsd(amount, rate));
      }
      node.nodeValue = `${leading}${translated}${trailing}`;
    }
    updateMeta(language);
    updateAccessibleLabels(language);
    document.documentElement.dataset.siteLanguage = language;
  }

  function fallbackLanguage() {
    const language = String(navigator.language || '').toLowerCase();
    if (language === 'ru' || language.startsWith('ru-')) return 'ru';
    return 'en';
  }

  async function freshRate() {
    try {
      const data = await withTimeout(RATE_API, 2500);
      const rate = Number(data && data.rate);
      if (!Number.isFinite(rate) || rate <= 0) throw new Error('Invalid rate');
      try {
        window.localStorage.setItem(RATE_CACHE_KEY, JSON.stringify({ rate, date: data.date, savedAt: Date.now() }));
      } catch (_) {
        // Continue without persistent storage.
      }
      return rate;
    } catch (_) {
      return readCachedRate();
    }
  }

  async function initialize() {
    const requestedLanguage = new URLSearchParams(window.location.search).get('lang');
    if (requestedLanguage === 'ru') {
      applyLanguage('ru', null);
      return;
    }
    if (requestedLanguage === 'en') {
      applyLanguage('en', readCachedRate());
      applyLanguage('en', await freshRate());
      return;
    }

    try {
      const location = await withTimeout(COUNTRY_API, 1800);
      const language = String(location && location.country).toUpperCase() === 'RU' ? 'ru' : 'en';
      if (language === 'ru') {
        applyLanguage('ru', null);
        return;
      }
      applyLanguage('en', readCachedRate());
      applyLanguage('en', await freshRate());
    } catch (_) {
      const language = fallbackLanguage();
      if (language === 'ru') {
        applyLanguage('ru', null);
      } else {
        applyLanguage('en', readCachedRate());
        applyLanguage('en', await freshRate());
      }
    }
  }

  initialize();
})();
