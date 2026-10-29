(() => {
  const rateUrl = "/fx-rates.json";
  const storageKey = "kweb-currency-override";
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
  let currentCurrency = "RUB";
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

  function getOverride() {
    try {
      const value = localStorage.getItem(storageKey);
      return value === "RUB" || value === "USD" ? value : "AUTO";
    } catch (_) {
      return "AUTO";
    }
  }

  function setOverride(value) {
    try {
      if (value === "AUTO") localStorage.removeItem(storageKey);
      else localStorage.setItem(storageKey, value);
    } catch (_) {}
  }

  function chosenCurrency() {
    const override = getOverride();
    if (override === "RUB" || override === "USD") return override;
    return isRussianDevice() ? "RUB" : "USD";
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
    const rendered = currentCurrency === "RUB" ? original : convertText(original);
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
    updateToggle();
  }

  function queueRender() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      renderAll();
    });
  }

  function dateLabel() {
    const value = rateData?.rateDate || rateData?.checkedOn;
    if (!value) return "latest available daily rate";
    const parts = value.split("-");
    if (parts.length !== 3) return value;
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  }

  function ensureToggle() {
    if (!document.body || document.getElementById("kweb-currency-toggle")) return;
    const button = document.createElement("button");
    button.id = "kweb-currency-toggle";
    button.type = "button";
    button.style.cssText = "position:fixed;right:14px;bottom:14px;z-index:99999;border:1px solid #9bb92d;border-radius:999px;background:#d8fb55;color:#14160d;padding:9px 14px;font:600 13px/1.1 system-ui,-apple-system,Segoe UI,sans-serif;box-shadow:0 2px 12px #0003;cursor:pointer;";
    button.addEventListener("click", () => {
      const override = getOverride();
      const next = override === "AUTO" ? (currentCurrency === "RUB" ? "USD" : "RUB") : override === "RUB" ? "USD" : "AUTO";
      setOverride(next);
      currentCurrency = chosenCurrency();
      queueRender();
    });
    document.body.appendChild(button);
    updateToggle();
  }

  function updateToggle() {
    const button = document.getElementById("kweb-currency-toggle");
    if (!button) return;
    const override = getOverride();
    const automatic = override === "AUTO";
    const label = `${currentCurrency === "RUB" ? "₽ RUB" : "$ USD"}${automatic ? " · auto" : ""}`;
    if (button.textContent !== label) button.textContent = label;
    button.title = `${automatic ? "Currency selected from your device region/time zone." : "Manual currency selection."} Click to switch. USD values are approximate equivalents using the Bank of Russia daily rate${rateData ? ` (${dateLabel()})` : ""}. Final quote and payment currency are agreed individually.`;
    button.setAttribute("aria-label", button.title);
  }

  currentCurrency = chosenCurrency();
  ensureToggle();
  fetch(rateUrl, { cache: "no-store", credentials: "same-origin" })
    .then((response) => {
      if (!response.ok) throw new Error("rate file unavailable");
      return response.json();
    })
    .then((data) => {
      const rate = Number(data.rubPerUsd);
      if (!Number.isFinite(rate) || rate <= 0) throw new Error("invalid rate");
      rateData = data;
      currentCurrency = chosenCurrency();
      queueRender();
    })
    .catch(() => {
      updateToggle();
    });

  const observer = new MutationObserver(queueRender);
  if (document.documentElement) observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
