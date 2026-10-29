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
  const records = new WeakMap();
  const amountPattern = /(\d[\d,\s\u00a0]*(?:\.\d+)?(?:\s*[–—-]\s*\d[\d,\s\u00a0]*(?:\.\d+)?)?)\s*(RUB|₽)/gi;
  let rateData = null;
  let currentCurrency = isRussianDevice() ? "RUB" : "USD";
  const languageOverride = readLanguageOverride();
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

  function processTextNode(node) {
    const parent = node.parentElement;
    if (!parent || parent.closest("script,style,noscript,textarea,input,select,option,button,[data-rub]")) return;
    const current = node.nodeValue;
    const record = records.get(node);
    const original = record && current === record.rendered ? record.original : current;
    const rendered = convertText(original);
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

  function setCountry(country) {
    if (!/^[A-Z]{2}$/.test(country)) return;
    const nextCurrency = country === "RU" ? "RUB" : "USD";
    if (nextCurrency !== currentCurrency) {
      currentCurrency = nextCurrency;
      queueRender();
    }
    maybeRedirectLanguage(country);
  }

  function maybeRedirectLanguage(country) {
    if (/(bot|crawler|spider|slurp|facebookexternalhit|twitterbot|linkedinbot|telegrambot)/i.test(navigator.userAgent || "")) return;
    const isEnglishPath = /^\/en(?:\/|$)/.test(window.location.pathname);
    const wantsEnglish = languageOverride ? languageOverride === "en" : country !== "RU";
    if (wantsEnglish && !isEnglishPath) {
      const params = new URLSearchParams(window.location.search);
      params.delete("lang");
      const query = params.toString();
      const target = `/en/${query ? `?${query}` : ""}${window.location.hash}`;
      window.location.replace(target);
    } else if (languageOverride === "ru" && isEnglishPath) {
      const params = new URLSearchParams(window.location.search);
      params.delete("lang");
      const query = params.toString();
      const target = `/${query ? `?${query}` : ""}${window.location.hash}`;
      window.location.replace(target);
    }
  }

  function detectCountry() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    fetch(countryUrl, { cache: "no-store", mode: "cors", credentials: "omit", signal: controller.signal })
      .then((response) => response.ok ? response.text() : "")
      .then((trace) => {
        const match = trace.match(/(?:^|\n)loc=([A-Z]{2})(?:\r?\n|$)/);
        if (match) setCountry(match[1]);
        else maybeRedirectLanguage(isRussianDevice() ? "RU" : "XX");
      })
      .catch(() => maybeRedirectLanguage(isRussianDevice() ? "RU" : "XX"))
      .finally(() => clearTimeout(timeout));
  }

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
