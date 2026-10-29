(() => {
  const rateUrl = "/fx-rates.json";
  const countryUrl = "https://www.cloudflare.com/cdn-cgi/trace";
  const languageStorageKey = "kweb-language-override";
  const russianTimeZones = new Set([
    "Europe/Kaliningrad", "Europe/Moscow", "Europe/Samara", "Europe/Saratov",
    "Europe/Ulyanovsk", "Europe/Volgograd", "Asia/Anadyr", "Asia/Barnaul",
    "Asia/Chita", "Asia/Irkutsk", "Asia/Kamchatka", "Asia/Khandyga",
    "Asia/Krasnoyarsk", "Asia/Magadan", "Asia/Novokuznetsk", "Asia/Novosibirsk",
    "Asia/Omsk", "Asia/Sakhalin", "Asia/Srednekolymsk", "Asia/Tomsk",
    "Asia/Ust-Nera", "Asia/Vladivostok", "Asia/Yakutsk", "Asia/Yekaterinburg"
  ]);
  const homeTranslations = {
    "Прайс": "Pricing",
    "Пример работы": "Portfolio",
    "Контакты": "Contact",
    "Обсудить проект": "Discuss a project",
    "Разработка сайтов / 2026": "WEB DEVELOPMENT / 2026",
    "Сайт, который": "A website that",
    "работает": "works",
    "на бизнес.": "for your business.",
    "Собираю выразительные сайты под ключ для кафе, магазинов, студий, сервисов и других компаний — от первой идеи до публикации.": "I create distinctive turnkey websites for cafés, shops, studios, service businesses, and other companies — from the first idea to launch.",
    "Обсудить задачу": "Discuss your project",
    "Индивидуальный дизайн": "Custom design",
    "Адаптация под все экраны": "Responsive on every screen",
    "Ваш бизнес": "Your business",
    "в фокусе": "in focus",
    "Основной прайс-лист": "Main price list",
    "Прозрачно": "Transparent",
    "по стоимости.": "pricing.",
    "Создание сайта — 10 000 ₽. Первый месяц обслуживания бесплатно. Со второго месяца стоимость зависит от выбранного тарифа.": "Website creation — 10,000 ₽. The first month of maintenance is free. From the second month, the price depends on the plan you choose.",
    "Сайт под ключ": "Turnkey website",
    "Создание сайта — 10 000 ₽. Первый месяц обслуживания бесплатно.": "Website creation — 10,000 ₽. The first month of maintenance is free.",
    "Со второго месяца — 5 000 ₽/мес.": "From the second month — 5,000 ₽/month.",
    "Создание и публикация одностраничного сайта": "One-page website design and launch",
    "Адаптация под смартфоны": "Mobile-friendly design",
    "Информация о компании, товарах и услугах": "Company, product, and service information",
    "Цены, фотографии, контакты и график работы": "Prices, photos, contact details, and opening hours",
    "Карта, ссылки на соцсети и мессенджеры": "Map and links to social media and messaging apps",
    "Поддержание работоспособности сайта": "Website uptime monitoring",
    "Контроль доступности сайта и основных ссылок": "Availability checks for the website and key links",
    "Изменения сверх включённого обслуживания — 2 000 ₽ за согласованную задачу": "Work beyond the included maintenance — 2,000 ₽ per agreed task",
    "Выбрать формат": "Choose a plan",
    "Сайт + базовое обслуживание": "Website + basic maintenance",
    "Со второго месяца — 7 500 ₽/мес.": "From the second month — 7,500 ₽/month.",
    "Всё из тарифа «Сайт под ключ»": "Everything in the “Turnkey Website” plan",
    "Базовое обслуживание — 5 000 ₽/мес.": "Basic maintenance — 5,000 ₽/month",
    "Базовое сопровождение контента — 2 500 ₽/мес.": "Basic content support — 2,500 ₽/month",
    "Одно плановое обновление сайта в месяц": "One scheduled website update per month",
    "Изменение цен, меню и списка услуг": "Updates to prices, menus, and service lists",
    "Замена фотографий и текстов": "Photo and text updates",
    "Обновление акций и информации о компании": "Updates to promotions and company information",
    "Дополнительные задачи сверх месячного обновления — 2 000 ₽ за согласованную задачу": "Additional work beyond the monthly update — 2,000 ₽ per agreed task",
    "Сайт + активное сопровождение": "Website + active support",
    "Со второго месяца — 10 000 ₽/мес.": "From the second month — 10,000 ₽/month.",
    "Всё из предыдущих тарифов": "Everything in the previous plans",
    "Активное сопровождение — 5 000 ₽/мес.": "Active support — 5,000 ₽/month",
    "Три плановых обновления сайта в месяц": "Three scheduled website updates per month",
    "Регулярное обновление цен, меню и услуг": "Regular updates to prices, menus, and services",
    "Замена фотографий, текстов и информации об акциях": "Updates to photos, text, and promotional information",
    "Изменение контактных данных и ссылок": "Updates to contact details and links",
    "Небольшие изменения существующих блоков сайта": "Minor changes to existing website sections",
    "Новые страницы, сложный функционал и крупный редизайн оцениваются отдельно": "New pages, complex functionality, and major redesigns are quoted separately",
    "Условия": "Maintenance",
    "обслуживания": "terms",
    "Со второго месяца": "From the second month",
    "работы сайта — 5 000 ₽/мес. независимо от выбранного тарифа. Ежемесячное обслуживание оплачивается отдельно.": "website operation costs 5,000 ₽/month, regardless of the selected plan. Monthly maintenance is billed separately.",
    "Изменения сверх включённого обслуживания —": "Work beyond the included maintenance —",
    "2 000 ₽ за согласованную задачу": "2,000 ₽ per agreed task",
    ". Новые страницы, сложный функционал и крупный редизайн оцениваются отдельно.": ". New pages, complex functionality, and major redesigns are quoted separately.",
    "Важно": "Important",
    "Стоимость домена, платных сервисов и дополнительные расходы, если они потребуются, согласовываются индивидуально до начала работ.": "Domain fees, paid services, and any other required expenses are agreed individually before work begins.",
    "САЙТЫ ПОД КЛЮЧ": "TURNKEY WEBSITES",
    "ДЛЯ БИЗНЕСА": "FOR BUSINESS",
    "ДИЗАЙН + РАЗРАБОТКА": "DESIGN + DEVELOPMENT",
    "Реальный проект · Бургерная": "Featured project · Burger restaurant",
    "Телецбург": "Teletsburg",
    "Открыть сайт": "Visit website",
    "Под вашу нишу, стиль и цели соберу отдельную историю.": "I’ll build a distinct experience tailored to your industry, style, and goals.",
    "Расскажите,": "Tell me",
    "что запускаем?": "what shall we launch?",
    "Напишите в удобный мессенджер или на почту. Коротко обсудим задачу и поймём, с чего начать.": "Message me on your preferred messenger or by email. We’ll briefly discuss your project and decide how to get started.",
    "Написать в Телеграмм": "Message on Telegram",
    "Написать в MAX": "Message on MAX",
    "Написать на почту": "Email me",
    "Сайты под ключ для бизнеса · Все права защищены": "Turnkey websites for businesses · All rights reserved",
    "Наверх": "Back to top",
    "Направления и информация:": "Services and information:",
    "сайт для кафе": "website for a café",
    "сайт для магазина": "website for a shop",
    "сайт для студии": "website for a studio",
    "создание сайтов под ключ": "turnkey website development",
    "обслуживание сайтов": "website maintenance",
    "вопросы и ответы": "FAQs",
    "Разработка сайтов · дизайн · обслуживание": "Web development · design · maintenance",
    "Создание сайтов под ключ для бизнеса": "Turnkey website design for businesses",
    "Разрабатываю выразительные сайты для кафе, магазинов, студий, сервисов и других компаний — от идеи и индивидуального дизайна до публикации. Сайт адаптирован для смартфонов и помогает понятно представить ваши товары и услуги.": "I build distinctive websites for cafés, shops, studios, service businesses, and other companies — from the initial idea and custom design through launch. Every site is mobile-friendly and presents your products and services clearly.",
    "Посмотреть стоимость": "View pricing",
    "Сайт для компании: разработка и сопровождение": "Website design and support for your business",
    "Помогаю бизнесу запуститься или обновить присутствие в интернете. В работу могут входить структура страницы, дизайн, информация о компании, товарах и услугах, фотографии, цены, контакты, график работы, карта, ссылки на социальные сети и мессенджеры, а также публикация сайта.": "I help businesses launch or refresh their online presence. A project can include page structure and design, company information, product and service details, photos, prices, contact information, opening hours, a map, social and messaging links, and website launch.",
    "Одностраничные сайты для кафе, магазинов, студий и сервисных компаний.": "One-page websites for cafés, shops, studios, and service businesses.",
    "Индивидуальный дизайн и адаптация под телефоны, планшеты и компьютеры.": "Custom design adapted for phones, tablets, and desktop computers.",
    "Публикация сайта и проверка основных ссылок.": "Website launch and checks of key links.",
    "Обновление цен, меню, фотографий, текстов и информации об акциях.": "Updates to prices, menus, photos, text, and promotions.",
    "Стоимость создания сайта и обслуживания": "Website design and maintenance pricing",
    "Создание сайта — 10 000 ₽. Первый месяц обслуживания бесплатно. Со второго месяца выберите подходящий формат:": "Website creation — 10,000 ₽. The first month of maintenance is free. From the second month, choose the plan that suits you:",
    "Сайт + базовое обслуживание": "Website + basic maintenance",
    "Сайт + активное сопровождение": "Website + active support",
    "Дополнительная согласованная задача сверх обслуживания — 2 000 ₽. Новые страницы, сложный функционал, крупный редизайн, домен и платные сервисы оцениваются и согласовываются отдельно до начала работ.": "Additional agreed work beyond the maintenance plan — 2,000 ₽. New pages, complex functionality, major redesigns, domains, and paid services are scoped and approved separately before work begins.",
    "Пример работы": "Portfolio project",
    "Сайт для бургерной «Телецбург» — опубликованный проект в портфолио.": "A published portfolio website for Teletsburg burger restaurant.",
    "Открыть сайт «Телецбург»": "Visit the Teletsburg website",
    "Обсудить создание сайта": "Discuss your website project",
    "Напишите удобным способом. Коротко обсудим задачу, сроки и подходящий вариант.": "Contact me in whichever way is most convenient. We’ll briefly discuss your project, timeline, and the right plan.",
    "Электронная почта": "Email"
  };
  const records = new WeakMap();
  const amountPattern = /(\d[\d,\s\u00a0]*(?:\.\d+)?(?:\s*[–—-]\s*\d[\d,\s\u00a0]*(?:\.\d+)?)?)\s*(RUB|₽)/gi;
  const isHomePage = window.location.pathname === "/" || window.location.pathname === "/index.html";
  const languageOverride = readLanguageOverride();
  let rateData = null;
  let currentCurrency = isRussianDevice() ? "RUB" : "USD";
  let currentLanguage = isHomePage
    ? (languageOverride || (isRussianDevice() ? "ru" : "en"))
    : (document.documentElement.lang.toLowerCase().startsWith("en") ? "en" : "ru");
  let scheduled = false;

  function isRussianDevice() {
    const locales = [...(navigator.languages || []), navigator.language || ""];
    for (const locale of locales) {
      try {
        if (new Intl.Locale(locale).region === "RU") return true;
      } catch (_) {}
    }
    try {
      return russianTimeZones.has(Intl.DateTimeFormat().resolvedOptions().timeZone);
    } catch (_) {
      return false;
    }
  }

  function readLanguageOverride() {
    const requested = new URLSearchParams(window.location.search).get("lang");
    try {
      if (requested === "ru" || requested === "en") {
        localStorage.setItem(languageStorageKey, requested);
        return requested;
      }
      if (requested === "auto") {
        localStorage.removeItem(languageStorageKey);
        return null;
      }
      const saved = localStorage.getItem(languageStorageKey);
      return saved === "ru" || saved === "en" ? saved : null;
    } catch (_) {
      return requested === "ru" || requested === "en" ? requested : null;
    }
  }

  function isSearchBot() {
    return /(bot|crawler|spider|slurp|facebookexternalhit|twitterbot|linkedinbot|telegrambot)/i.test(navigator.userAgent || "");
  }

  function setHomeMetadata(language) {
    if (!isHomePage) return;
    const english = language === "en";
    document.documentElement.lang = english ? "en" : "ru";
    document.title = english ? "Turnkey Website Design for Businesses | k web" : "Создание сайтов под ключ для бизнеса — k web";
    const values = english ? {
      description: "Custom, mobile-friendly websites for cafés, shops, studios, and service businesses. Design, launch, and maintenance.",
      keywords: "turnkey website design, business website development, café website, shop website, website maintenance",
      ogTitle: "Turnkey Website Design for Businesses | k web",
      ogDescription: "Custom design, mobile-friendly development, launch, and maintenance for business websites.",
      twitterTitle: "Turnkey Website Design for Businesses | k web",
      twitterDescription: "Custom websites for small businesses, from concept and design to launch and support.",
      ogLocale: "en_US"
    } : {
      description: "Разработка сайтов под ключ для кафе, магазинов, студий и сервисов: индивидуальный дизайн, адаптация под смартфоны, публикация и обслуживание.",
      keywords: "создание сайтов, разработка сайтов под ключ, сайт для бизнеса, сайт для кафе, сайт для магазина, обслуживание сайтов, веб-дизайн",
      ogTitle: "Создание сайтов под ключ для бизнеса — k web",
      ogDescription: "Индивидуальный дизайн, адаптация под смартфоны, публикация и обслуживание сайтов для кафе, магазинов, студий и сервисов.",
      twitterTitle: "Создание сайтов под ключ для бизнеса — k web",
      twitterDescription: "Индивидуальный дизайн, мобильная адаптация, публикация и сопровождение сайтов для бизнеса.",
      ogLocale: "ru_RU"
    };
    document.querySelector('meta[name="description"]')?.setAttribute("content", values.description);
    document.querySelector('meta[name="keywords"]')?.setAttribute("content", values.keywords);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", values.ogTitle);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", values.ogDescription);
    document.querySelector('meta[property="og:locale"]')?.setAttribute("content", values.ogLocale);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", values.twitterTitle);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", values.twitterDescription);
  }

  function parseAmount(value) {
    return Number(value.replace(/[\s,\u00a0]/g, ""));
  }

  function usdText(rubles) {
    const amount = Math.round(rubles / rateData.rubPerUsd);
    return `≈ $${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(amount)}`;
  }

  function rubText(rubles) {
    return `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(rubles)} ₽`;
  }

  function renderDataPrices() {
    if (!rateData || !Number.isFinite(rateData.rubPerUsd) || rateData.rubPerUsd <= 0) return;
    document.querySelectorAll("[data-rub]").forEach((element) => {
      const values = (element.dataset.rub || "").split(/[;,]/).map(parseAmount).filter(Number.isFinite);
      if (!values.length) return;
      const unit = element.dataset.priceUnit || "";
      const valueText = values.map((value) => currentCurrency === "USD" ? usdText(value) : rubText(value)).join("–");
      const output = currentCurrency === "USD" ? `${valueText} USD${unit}` : `${valueText}${unit}`;
      if (element.textContent !== output) element.textContent = output;
    });
  }

  function convertText(text) {
    if (!rateData || currentCurrency !== "USD" || !Number.isFinite(rateData.rubPerUsd) || rateData.rubPerUsd <= 0) return text;
    return text.replace(amountPattern, (match, amount) => {
      const values = amount.split(/\s*[–—-]\s*/).map(parseAmount);
      if (!values.length || values.some((value) => !Number.isFinite(value))) return match;
      return `${values.map(usdText).join("–")} USD`;
    });
  }

  function normalizeText(text) {
    return text.replace(/\s+/g, " ").trim();
  }

  function localizeText(text) {
    if (!isHomePage || currentLanguage !== "en") return text;
    const normalized = normalizeText(text);
    const translated = homeTranslations[normalized];
    if (!translated) return text;
    const leading = text.match(/^\s*/)?.[0] || "";
    const trailing = text.match(/\s*$/)?.[0] || "";
    return `${leading}${translated}${trailing}`;
  }

  function processTextNode(node) {
    const parent = node.parentElement;
    if (!parent || parent.closest("script,style,noscript,textarea,input,select,option,button,[data-rub]")) return;
    const current = node.nodeValue;
    const record = records.get(node);
    const original = record && current === record.rendered ? record.original : current;
    const rendered = convertText(localizeText(original));
    if (rendered !== current) {
      records.set(node, { original, rendered });
      node.nodeValue = rendered;
    } else if (!record) {
      records.set(node, { original, rendered });
    }
  }

  function renderAll() {
    if (!document.body) return;
    renderDataPrices();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) processTextNode(node);
  }

  function queueRender() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      renderAll();
    });
  }

  function applyLanguage(language) {
    if (!isHomePage) return;
    const next = language === "en" ? "en" : "ru";
    if (currentLanguage !== next) currentLanguage = next;
    setHomeMetadata(currentLanguage);
    queueRender();
  }

  function setCountry(country) {
    if (!/^[A-Z]{2}$/.test(country)) return;
    const nextCurrency = country === "RU" ? "RUB" : "USD";
    let changed = false;
    if (nextCurrency !== currentCurrency) {
      currentCurrency = nextCurrency;
      changed = true;
    }
    if (isHomePage) {
      const nextLanguage = languageOverride || (isSearchBot() ? "ru" : (country === "RU" ? "ru" : "en"));
      if (nextLanguage !== currentLanguage) {
        currentLanguage = nextLanguage;
        setHomeMetadata(currentLanguage);
        changed = true;
      }
    }
    if (changed) queueRender();
  }

  function detectCountry() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    fetch(countryUrl, { cache: "no-store", mode: "cors", credentials: "omit", signal: controller.signal })
      .then((response) => response.ok ? response.text() : "")
      .then((trace) => {
        const match = trace.match(/(?:^|\n)loc=([A-Z]{2})(?:\r?\n|$)/);
        if (match) setCountry(match[1]);
        else setCountry(isRussianDevice() ? "RU" : "XX");
      })
      .catch(() => setCountry(isRussianDevice() ? "RU" : "XX"))
      .finally(() => clearTimeout(timeout));
  }

  applyLanguage(currentLanguage);
  fetch(rateUrl, { cache: "no-store", credentials: "same-origin" })
    .then((response) => {
      if (!response.ok) throw new Error("rate file unavailable");
      return response.json();
    })
    .then((data) => {
      const rate = Number(data.rubPerUsd);
      if (!Number.isFinite(rate) || rate <= 0) throw new Error("invalid rate");
      rateData = data;
      queueRender();
    })
    .catch(() => {});

  detectCountry();
  const observer = new MutationObserver(queueRender);
  if (document.documentElement) observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
