(() => {
  'use strict';

  const COUNTRY_API = 'https://api.country.is/';
  const RATE_API_BASE = 'https://api.frankfurter.dev/v2/rate/RUB/';
  const RATE_CACHE_PREFIX = 'kweb-rub-rate-v2:';
  const RATE_CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
  const FALLBACK_RATES = Object.freeze({
    USD: 0.012206,
    EUR: 0.011117,
    GBP: 0.0093185,
    CNY: 0.081385,
    JPY: 1.9417,
    CAD: 0.017487,
    AUD: 0.018376,
    MXN: 0.23356,
    BRL: 0.072609,
    CHF: 0.010258,
    INR: 1.1317,
    KRW: 16.3876,
    PLN: 0.049585,
    TRY: 0.61732,
    KZT: 5.5462
  });

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
    'WEB': 'WEB',
    'THAT': 'THAT',
    'MOVES.': 'MOVES.',
    'DESIGN / DEVELOPMENT': 'DESIGN / DEVELOPMENT',
    "LET'S": "LET'S",
    'MAKE': 'MAKE',
    'IT': 'IT',
    'REAL.': 'REAL.',
    'Реальный проект · Бургерная': 'Featured project · Burger restaurant',
    'Телецбург': 'Teletsburg',
    'Открыть сайт': 'View project',
    'Сайт для кафе': 'Café website service',
    'Под вашу нишу, стиль и цели соберу отдельную историю.': 'We create a distinctive digital experience tailored to your industry, style and goals.',
    'Расскажите,': 'Tell us,',
    'что запускаем?': 'what shall we build?',
    'Напишите в удобный мессенджер или на почту. Коротко обсудим задачу и поймём, с чего начать.': 'Message us on your preferred messenger or by email. We’ll discuss your project and find the best way to get started.',
    'Написать в Телеграмм': 'Message us on Telegram',
    'Написать в MAX': 'Message us on MAX',
    'Написать на почту': 'Email us',
    'Сайты под ключ для бизнеса · Все права защищены': 'Turnkey websites for businesses · All rights reserved',
    'Сайты под ключ для бизнеса · Все права защищены ·': 'Turnkey websites for businesses · All rights reserved ·',
    'Наверх': 'Back to top'
  });

  const ES = Object.freeze({
    'Прайс': 'Precios',
    'Пример работы': 'Proyectos',
    'Контакты': 'Contacto',
    'Обсудить проект': 'Hablemos del proyecto',
    'Разработка сайтов / 2026': 'Diseño y desarrollo web / 2026',
    'Создание сайтов': 'Creación de sitios web',
    'под ключ': 'llave en mano',
    'для бизнеса.': 'para empresas.',
    'Создадим для вашего бизнеса уникальный сайт под ключ. Наша команда дизайнеров и разработчиков продумывает идею, визуальный стиль и структуру — и доводит проект до запуска.': 'Creamos sitios web únicos y llave en mano para empresas. Nuestro equipo de diseño y desarrollo define la idea, la identidad visual y la estructura, y acompaña el proyecto hasta su lanzamiento.',
    'Обсудить задачу': 'Cuéntanos tu proyecto',
    'Индивидуальный дизайн': 'Diseño a medida',
    'Адаптация под все экраны': 'Adaptado a todas las pantallas',
    'Ваш бизнес': 'Tu negocio',
    'в фокусе': 'en primer plano',
    'Основной прайс-лист': 'Servicios y precios',
    'Прозрачно': 'Precios',
    'по стоимости.': 'claros.',
    'Создание сайта — 10 000 ₽. Первый месяц обслуживания бесплатно. Со второго месяца стоимость зависит от выбранного тарифа.': 'Creación del sitio web — {{RUB:10000}}. El primer mes de mantenimiento es gratis. Desde el segundo mes, el precio depende del plan elegido.',
    'Сайт под ключ': 'Sitio web llave en mano',
    'Создание сайта — 10 000 ₽. Первый месяц обслуживания бесплатно.': 'Creación del sitio web — {{RUB:10000}}. El primer mes de mantenimiento es gratis.',
    '10 000 ₽': '{{RUB:10000}}',
    'Со второго месяца — 5 000 ₽/мес.': 'Desde el segundo mes — {{RUB:5000}}/mes.',
    'Создание и публикация одностраничного сайта': 'Diseño y publicación de un sitio web de una sola página',
    'Адаптация под смартфоны': 'Adaptación para móviles',
    'Информация о компании, товарах и услугах': 'Información de la empresa, productos y servicios',
    'Цены, фотографии, контакты и график работы': 'Precios, fotos, contacto y horario de atención',
    'Карта, ссылки на соцсети и мессенджеры': 'Mapa y enlaces a redes sociales y mensajería',
    'Поддержание работоспособности сайта': 'Mantenimiento del sitio web',
    'Контроль доступности сайта и основных ссылок': 'Supervisión de la disponibilidad y los enlaces principales',
    'Изменения сверх включённого обслуживания — 2 000 ₽ за согласованную задачу': 'Cambios fuera del mantenimiento incluido — {{RUB:2000}} por tarea acordada',
    'Выбрать формат': 'Elegir un plan',
    'Сайт + базовое обслуживание': 'Sitio web + mantenimiento básico',
    'Со второго месяца — 7 500 ₽/мес.': 'Desde el segundo mes — {{RUB:7500}}/mes.',
    'Всё из тарифа «Сайт под ключ»': 'Todo lo incluido en el plan Sitio web llave en mano',
    'Базовое обслуживание — 5 000 ₽/мес.': 'Mantenimiento básico — {{RUB:5000}}/mes',
    'Базовое сопровождение контента — 2 500 ₽/мес.': 'Gestión básica de contenidos — {{RUB:2500}}/mes',
    'Одно плановое обновление сайта в месяц': 'Una actualización programada del sitio al mes',
    'Изменение цен, меню и списка услуг': 'Cambios en precios, menú y lista de servicios',
    'Замена фотографий и текстов': 'Actualización de fotos y textos',
    'Обновление акций и информации о компании': 'Actualización de promociones e información de la empresa',
    'Дополнительные задачи сверх месячного обновления — 2 000 ₽ за согласованную задачу': 'Tareas adicionales fuera de la actualización mensual — {{RUB:2000}} por tarea acordada',
    'Сайт + активное сопровождение': 'Sitio web + soporte activo',
    'Со второго месяца — 10 000 ₽/мес.': 'Desde el segundo mes — {{RUB:10000}}/mes.',
    'Всё из предыдущих тарифов': 'Todo lo incluido en los planes anteriores',
    'Активное сопровождение — 5 000 ₽/мес.': 'Soporte activo — {{RUB:5000}}/mes',
    'Три плановых обновления сайта в месяц': 'Tres actualizaciones programadas del sitio al mes',
    'Регулярное обновление цен, меню и услуг': 'Actualización periódica de precios, menú y servicios',
    'Замена фотографий, текстов и информации об акциях': 'Actualización de fotos, textos e información de promociones',
    'Изменение контактных данных и ссылок': 'Cambios en los datos de contacto y enlaces',
    'Небольшие изменения существующих блоков сайта': 'Pequeños cambios en las secciones existentes del sitio',
    'Новые страницы, сложный функционал и крупный редизайн оцениваются отдельно': 'Las páginas nuevas, las funciones complejas y los rediseños grandes se presupuestan por separado',
    'Условия': 'Condiciones',
    'обслуживания': 'de mantenimiento',
    'Со второго месяца': 'Desde el segundo mes,',
    'работы сайта — 5 000 ₽/мес. независимо от выбранного тарифа. Ежемесячное обслуживание оплачивается отдельно.': 'el mantenimiento del sitio cuesta {{RUB:5000}}/mes, independientemente del plan elegido. El mantenimiento mensual se cobra por separado.',
    'Изменения сверх включённого обслуживания —': 'Cambios fuera del mantenimiento incluido —',
    '2 000 ₽ за согласованную задачу': '{{RUB:2000}} por tarea acordada',
    '. Новые страницы, сложный функционал и крупный редизайн оцениваются отдельно.': '. Las páginas nuevas, las funciones complejas y los rediseños grandes se presupuestan por separado.',
    'Важно': 'Importante',
    'Стоимость домена, платных сервисов и дополнительные расходы, если они потребуются, согласовываются индивидуально до начала работ.': 'El dominio, los servicios de pago y cualquier coste adicional se acuerdan individualmente antes de empezar.',
    'САЙТЫ ПОД КЛЮЧ': 'SITIOS WEB LLAVE EN MANO',
    'ДЛЯ БИЗНЕСА': 'PARA EMPRESAS',
    'ДИЗАЙН + РАЗРАБОТКА': 'DISEÑO + DESARROLLO',
    'WEB': 'WEB',
    'THAT': 'QUE',
    'MOVES.': 'MUEVE.',
    'DESIGN / DEVELOPMENT': 'DISEÑO / DESARROLLO',
    "LET'S": 'HAZ',
    'MAKE': 'QUE',
    'IT': 'SEA',
    'REAL.': 'REAL.',
    'Реальный проект · Бургерная': 'Proyecto real · Hamburguesería',
    'Телецбург': 'Teletsburg',
    'Открыть сайт': 'Abrir el sitio',
    'Сайт для кафе': 'Sitio web para cafeterías',
    'Под вашу нишу, стиль и цели соберу отдельную историю.': 'Creamos una experiencia digital propia para tu sector, estilo y objetivos.',
    'Расскажите,': 'Cuéntanos,',
    'что запускаем?': '¿qué ponemos en marcha?',
    'Напишите в удобный мессенджер или на почту. Коротко обсудим задачу и поймём, с чего начать.': 'Escríbenos por tu mensajería favorita o por correo. Hablaremos brevemente del proyecto y veremos por dónde empezar.',
    'Написать в Телеграмм': 'Escribir por Telegram',
    'Написать в MAX': 'Escribir por MAX',
    'Написать на почту': 'Enviar un correo',
    'Сайты под ключ для бизнеса · Все права защищены': 'Sitios web llave en mano para empresas · Todos los derechos reservados',
    'Сайты под ключ для бизнеса · Все права защищены ·': 'Sitios web llave en mano para empresas · Todos los derechos reservados ·',
    'Наверх': 'Volver arriba'
  });

  const DE = Object.freeze({
    'Прайс': 'Preise',
    'Пример работы': 'Referenzen',
    'Контакты': 'Kontakt',
    'Обсудить проект': 'Projekt besprechen',
    'Разработка сайтов / 2026': 'Webdesign & Entwicklung / 2026',
    'Создание сайтов': 'Webseitenerstellung',
    'под ключ': 'schlüsselfertig',
    'для бизнеса.': 'für Unternehmen.',
    'Создадим для вашего бизнеса уникальный сайт под ключ. Наша команда дизайнеров и разработчиков продумывает идею, визуальный стиль и структуру — и доводит проект до запуска.': 'Wir erstellen individuelle, schlüsselfertige Websites für Unternehmen. Unser Design- und Entwicklungsteam erarbeitet Konzept, visuellen Stil und Struktur und begleitet das Projekt bis zum Start.',
    'Обсудить задачу': 'Projekt besprechen',
    'Индивидуальный дизайн': 'Individuelles Design',
    'Адаптация под все экраны': 'Für alle Bildschirmgrößen optimiert',
    'Ваш бизнес': 'Ihr Unternehmen',
    'в фокусе': 'im Mittelpunkt',
    'Основной прайс-лист': 'Leistungen & Preise',
    'Прозрачно': 'Transparent',
    'по стоимости.': 'kalkuliert.',
    'Создание сайта — 10 000 ₽. Первый месяц обслуживания бесплатно. Со второго месяца стоимость зависит от выбранного тарифа.': 'Website-Erstellung — {{RUB:10000}}. Der erste Wartungsmonat ist kostenlos. Ab dem zweiten Monat richtet sich der Preis nach dem gewählten Paket.',
    'Сайт под ключ': 'Website schlüsselfertig',
    'Создание сайта — 10 000 ₽. Первый месяц обслуживания бесплатно.': 'Website-Erstellung — {{RUB:10000}}. Der erste Wartungsmonat ist kostenlos.',
    '10 000 ₽': '{{RUB:10000}}',
    'Со второго месяца — 5 000 ₽/мес.': 'Ab dem zweiten Monat — {{RUB:5000}}/Monat.',
    'Создание и публикация одностраничного сайта': 'Erstellung und Veröffentlichung einer einseitigen Website',
    'Адаптация под смартфоны': 'Für Smartphones optimiert',
    'Информация о компании, товарах и услугах': 'Informationen zu Unternehmen, Produkten und Leistungen',
    'Цены, фотографии, контакты и график работы': 'Preise, Fotos, Kontaktdaten und Öffnungszeiten',
    'Карта, ссылки на соцсети и мессенджеры': 'Karte sowie Links zu sozialen Netzwerken und Messengern',
    'Поддержание работоспособности сайта': 'Technische Betreuung der Website',
    'Контроль доступности сайта и основных ссылок': 'Überwachung der Erreichbarkeit und wichtiger Links',
    'Изменения сверх включённого обслуживания — 2 000 ₽ за согласованную задачу': 'Änderungen außerhalb der vereinbarten Betreuung — {{RUB:2000}} je abgestimmter Aufgabe',
    'Выбрать формат': 'Paket auswählen',
    'Сайт + базовое обслуживание': 'Website + Basisbetreuung',
    'Со второго месяца — 7 500 ₽/мес.': 'Ab dem zweiten Monat — {{RUB:7500}}/Monat.',
    'Всё из тарифа «Сайт под ключ»': 'Alles aus dem Paket „Website schlüsselfertig“',
    'Базовое обслуживание — 5 000 ₽/мес.': 'Basisbetreuung — {{RUB:5000}}/Monat',
    'Базовое сопровождение контента — 2 500 ₽/мес.': 'Basisbetreuung der Inhalte — {{RUB:2500}}/Monat',
    'Одно плановое обновление сайта в месяц': 'Ein geplantes Website-Update pro Monat',
    'Изменение цен, меню и списка услуг': 'Aktualisierung von Preisen, Speisekarte und Leistungen',
    'Замена фотографий и текстов': 'Austausch von Fotos und Texten',
    'Обновление акций и информации о компании': 'Aktualisierung von Angeboten und Unternehmensinformationen',
    'Дополнительные задачи сверх месячного обновления — 2 000 ₽ за согласованную задачу': 'Zusätzliche Aufgaben außerhalb des Monatsupdates — {{RUB:2000}} je abgestimmter Aufgabe',
    'Сайт + активное сопровождение': 'Website + aktive Betreuung',
    'Со второго месяца — 10 000 ₽/мес.': 'Ab dem zweiten Monat — {{RUB:10000}}/Monat.',
    'Всё из предыдущих тарифов': 'Alles aus den vorherigen Paketen',
    'Активное сопровождение — 5 000 ₽/мес.': 'Aktive Betreuung — {{RUB:5000}}/Monat',
    'Три плановых обновления сайта в месяц': 'Drei geplante Website-Updates pro Monat',
    'Регулярное обновление цен, меню и услуг': 'Regelmäßige Aktualisierung von Preisen, Speisekarte und Leistungen',
    'Замена фотографий, текстов и информации об акциях': 'Austausch von Fotos, Texten und Aktionsinformationen',
    'Изменение контактных данных и ссылок': 'Änderung von Kontaktdaten und Links',
    'Небольшие изменения существующих блоков сайта': 'Kleinere Änderungen an bestehenden Website-Bereichen',
    'Новые страницы, сложный функционал и крупный редизайн оцениваются отдельно': 'Neue Seiten, komplexe Funktionen und größere Redesigns werden separat kalkuliert',
    'Условия': 'Wartungs-',
    'обслуживания': 'bedingungen',
    'Со второго месяца': 'Ab dem zweiten Monat',
    'работы сайта — 5 000 ₽/мес. независимо от выбранного тарифа. Ежемесячное обслуживание оплачивается отдельно.': 'kostet die laufende Website-Betreuung {{RUB:5000}}/Monat, unabhängig vom gewählten Paket. Die monatliche Betreuung wird separat berechnet.',
    'Изменения сверх включённого обслуживания —': 'Änderungen außerhalb der vereinbarten Betreuung —',
    '2 000 ₽ за согласованную задачу': '{{RUB:2000}} je abgestimmter Aufgabe',
    '. Новые страницы, сложный функционал и крупный редизайн оцениваются отдельно.': '. Neue Seiten, komplexe Funktionen und größere Redesigns werden separat kalkuliert.',
    'Важно': 'Wichtig',
    'Стоимость домена, платных сервисов и дополнительные расходы, если они потребуются, согласовываются индивидуально до начала работ.': 'Kosten für Domains, kostenpflichtige Dienste und weitere Ausgaben werden vor Arbeitsbeginn individuell vereinbart.',
    'САЙТЫ ПОД КЛЮЧ': 'SCHLÜSSELFERTIGE WEBSITES',
    'ДЛЯ БИЗНЕСА': 'FÜR UNTERNEHMEN',
    'ДИЗАЙН + РАЗРАБОТКА': 'DESIGN + ENTWICKLUNG',
    'WEB': 'WEB',
    'THAT': 'DIE',
    'MOVES.': 'BEWEGT.',
    'DESIGN / DEVELOPMENT': 'DESIGN / ENTWICKLUNG',
    "LET'S": 'MACH',
    'MAKE': 'ES',
    'IT': 'JETZT',
    'REAL.': 'REAL.',
    'Реальный проект · Бургерная': 'Referenzprojekt · Burgerrestaurant',
    'Телецбург': 'Teletsburg',
    'Открыть сайт': 'Website öffnen',
    'Сайт для кафе': 'Website für Cafés',
    'Под вашу нишу, стиль и цели соберу отдельную историю.': 'Wir entwickeln einen eigenständigen digitalen Auftritt passend zu Branche, Stil und Zielen.',
    'Расскажите,': 'Erzählen Sie,',
    'что запускаем?': 'was wir starten sollen.',
    'Напишите в удобный мессенджер или на почту. Коротко обсудим задачу и поймём, с чего начать.': 'Schreiben Sie uns über Ihren bevorzugten Messenger oder per E-Mail. Wir besprechen Ihr Vorhaben und finden den passenden Einstieg.',
    'Написать в Телеграмм': 'Über Telegram schreiben',
    'Написать в MAX': 'Über MAX schreiben',
    'Написать на почту': 'E-Mail schreiben',
    'Сайты под ключ для бизнеса · Все права защищены': 'Schlüsselfertige Websites für Unternehmen · Alle Rechte vorbehalten',
    'Сайты под ключ для бизнеса · Все права защищены ·': 'Schlüsselfertige Websites für Unternehmen · Alle Rechte vorbehalten ·',
    'Наверх': 'Nach oben'
  });

  const ZH = Object.freeze({
    'Прайс': '价格',
    'Пример работы': '案例',
    'Контакты': '联系',
    'Обсудить проект': '讨论项目',
    'Разработка сайтов / 2026': '网站设计与开发 / 2026',
    'Создание сайтов': '网站制作',
    'под ключ': '一站式',
    'для бизнеса.': '助力企业。',
    'Создадим для вашего бизнеса уникальный сайт под ключ. Наша команда дизайнеров и разработчиков продумывает идею, визуальный стиль и структуру — и доводит проект до запуска.': '为企业打造独特的一站式网站。我们的设计与开发团队负责构思、视觉风格和网站结构，并协助项目上线。',
    'Обсудить задачу': '沟通需求',
    'Индивидуальный дизайн': '定制设计',
    'Адаптация под все экраны': '适配各种屏幕',
    'Ваш бизнес': '让您的业务',
    'в фокусе': '成为焦点',
    'Основной прайс-лист': '服务与价格',
    'Прозрачно': '价格',
    'по стоимости.': '清晰透明。',
    'Создание сайта — 10 000 ₽. Первый месяц обслуживания бесплатно. Со второго месяца стоимость зависит от выбранного тарифа.': '网站制作 — {{RUB:10000}}。首月维护免费。自第二个月起，费用按所选方案计算。',
    'Сайт под ключ': '一站式网站',
    'Создание сайта — 10 000 ₽. Первый месяц обслуживания бесплатно.': '网站制作 — {{RUB:10000}}。首月维护免费。',
    '10 000 ₽': '{{RUB:10000}}',
    'Со второго месяца — 5 000 ₽/мес.': '自第二个月起 — 每月 {{RUB:5000}}。',
    'Создание и публикация одностраничного сайта': '单页网站设计与发布',
    'Адаптация под смартфоны': '适配智能手机',
    'Информация о компании, товарах и услугах': '公司、产品与服务信息',
    'Цены, фотографии, контакты и график работы': '价格、图片、联系方式与营业时间',
    'Карта, ссылки на соцсети и мессенджеры': '地图、社交媒体与即时通讯链接',
    'Поддержание работоспособности сайта': '网站运行维护',
    'Контроль доступности сайта и основных ссылок': '监测网站及主要链接的可访问性',
    'Изменения сверх включённого обслуживания — 2 000 ₽ за согласованную задачу': '超出维护范围的修改 — 每项协商任务 {{RUB:2000}}',
    'Выбрать формат': '选择方案',
    'Сайт + базовое обслуживание': '网站 + 基础维护',
    'Со второго месяца — 7 500 ₽/мес.': '自第二个月起 — 每月 {{RUB:7500}}。',
    'Всё из тарифа «Сайт под ключ»': '包含“一站式网站”方案的全部内容',
    'Базовое обслуживание — 5 000 ₽/мес.': '基础维护 — 每月 {{RUB:5000}}',
    'Базовое сопровождение контента — 2 500 ₽/мес.': '基础内容维护 — 每月 {{RUB:2500}}',
    'Одно плановое обновление сайта в месяц': '每月一次计划内网站更新',
    'Изменение цен, меню и списка услуг': '修改价格、菜单和服务列表',
    'Замена фотографий и текстов': '更换图片与文字',
    'Обновление акций и информации о компании': '更新促销活动与公司信息',
    'Дополнительные задачи сверх месячного обновления — 2 000 ₽ за согласованную задачу': '超出每月更新范围的额外任务 — 每项协商任务 {{RUB:2000}}',
    'Сайт + активное сопровождение': '网站 + 深度维护',
    'Со второго месяца — 10 000 ₽/мес.': '自第二个月起 — 每月 {{RUB:10000}}。',
    'Всё из предыдущих тарифов': '包含此前方案的全部内容',
    'Активное сопровождение — 5 000 ₽/мес.': '深度维护 — 每月 {{RUB:5000}}',
    'Три плановых обновления сайта в месяц': '每月三次计划内网站更新',
    'Регулярное обновление цен, меню и услуг': '定期更新价格、菜单和服务',
    'Замена фотографий, текстов и информации об акциях': '更换图片、文字及促销信息',
    'Изменение контактных данных и ссылок': '修改联系信息与链接',
    'Небольшие изменения существующих блоков сайта': '对现有网站模块进行小幅调整',
    'Новые страницы, сложный функционал и крупный редизайн оцениваются отдельно': '新增页面、复杂功能及大型改版另行报价',
    'Условия': '维护',
    'обслуживания': '条款',
    'Со второго месяца': '自第二个月起，',
    'работы сайта — 5 000 ₽/мес. независимо от выбранного тарифа. Ежемесячное обслуживание оплачивается отдельно.': '网站维护费用为每月 {{RUB:5000}}，与所选方案无关。月度维护费用另行支付。',
    'Изменения сверх включённого обслуживания —': '超出维护范围的修改 —',
    '2 000 ₽ за согласованную задачу': '每项协商任务 {{RUB:2000}}',
    '. Новые страницы, сложный функционал и крупный редизайн оцениваются отдельно.': '。新增页面、复杂功能及大型改版另行报价。',
    'Важно': '提示',
    'Стоимость домена, платных сервисов и дополнительные расходы, если они потребуются, согласовываются индивидуально до начала работ.': '域名、付费服务及可能产生的其他费用，将在开始工作前另行协商。',
    'САЙТЫ ПОД КЛЮЧ': '一站式网站',
    'ДЛЯ БИЗНЕСА': '企业服务',
    'ДИЗАЙН + РАЗРАБОТКА': '设计 + 开发',
    'WEB': '网站',
    'THAT': '活',
    'MOVES.': '起来',
    'DESIGN / DEVELOPMENT': '设计 / 开发',
    "LET'S": '一起',
    'MAKE': '让想法',
    'IT': '成为',
    'REAL.': '现实',
    'Реальный проект · Бургерная': '真实项目 · 汉堡店',
    'Телецбург': 'Teletsburg',
    'Открыть сайт': '访问网站',
    'Сайт для кафе': '咖啡馆网站',
    'Под вашу нишу, стиль и цели соберу отдельную историю.': '根据您的行业、风格与目标，打造独特的数字体验。',
    'Расскажите,': '告诉我们，',
    'что запускаем?': '您想启动什么项目？',
    'Напишите в удобный мессенджер или на почту. Коротко обсудим задачу и поймём, с чего начать.': '通过您常用的即时通讯工具或电子邮件联系我们。我们会简要了解需求并讨论如何开始。',
    'Написать в Телеграмм': '通过 Telegram 联系',
    'Написать в MAX': '通过 MAX 联系',
    'Написать на почту': '发送电子邮件',
    'Сайты под ключ для бизнеса · Все права защищены': '企业一站式网站 · 版权所有',
    'Сайты под ключ для бизнеса · Все права защищены ·': '企业一站式网站 · 版权所有 ·',
    'Наверх': '返回顶部'
  });

  const DICTIONARIES = Object.freeze({ en: EN, es: ES, de: DE, zh: ZH });
  const CASE_TRANSLATIONS = Object.freeze({
    es: Object.freeze({
      'Home': 'Inicio',
      'Portfolio': 'Portafolio',
      'Teletsburg case study': 'Caso Teletsburg',
      '01 / VISUAL': '01 / VISUAL',
      '02 / STRUCTURE': '02 / ESTRUCTURA',
      '03 / CONTACT': '03 / CONTACTO',
      'PORTFOLIO / REAL PROJECT': 'PORTAFOLIO / PROYECTO REAL',
      'Teletsburg restaurant website': 'Sitio web del restaurante Teletsburg',
      'A responsive one-page website for a burger restaurant. The page brings together the project’s visual presentation, essential venue information and clear routes to the restaurant’s current contact details.': 'Un sitio web adaptable de una sola página para una hamburguesería. Reúne la presentación visual del proyecto, información esencial del local y accesos claros a los datos de contacto actualizados del restaurante.',
      'Visit the live project': 'Visitar el sitio del proyecto',
      'THE BRIEF': 'EL OBJETIVO',
      'Present the venue clearly on one page.': 'Presentar el local con claridad en una sola página.',
      'The page helps visitors understand the restaurant, view its visual identity, find the location and opening hours, and continue to the restaurant’s separate live website. This is a web-design portfolio case study, not the restaurant’s official website.': 'La página ayuda a conocer el restaurante, ver su identidad visual, consultar la ubicación y el horario, y continuar al sitio web independiente del restaurante. Este es un caso de portafolio de diseño web, no el sitio oficial del restaurante.',
      'THE APPROACH': 'LA SOLUCIÓN',
      'What the project includes': 'Qué incluye el proyecto',
      'Visual direction': 'Dirección visual',
      'Product photography and bold accents support a distinctive visual identity for the burger restaurant.': 'Las fotografías de producto y los acentos gráficos refuerzan la identidad visual de la hamburguesería.',
      'One-page structure': 'Estructura de una sola página',
      'Essential information is organised into a concise page journey and adapted for smartphone screens.': 'La información esencial se organiza en un recorrido breve por la página, adaptado a las pantallas de los móviles.',
      'A clear next step': 'Un siguiente paso claro',
      'The location, opening hours and contact links help visitors move from discovery to a visit or enquiry.': 'La ubicación, el horario y los enlaces de contacto ayudan a pasar del primer vistazo a una visita o consulta.',
      'Website design for cafés and restaurants ↗': 'Diseño web para cafeterías y restaurantes ↗',
      'Need a website for your business?': '¿Necesitas un sitio web para tu negocio?',
      'Discuss a project': 'Hablar del proyecto',
      'k web · portfolio': 'k web · portafolio',
      'All rights reserved': 'Todos los derechos reservados',
      'Back to top ↑': 'Volver arriba ↑'
    }),
    de: Object.freeze({
      'Home': 'Startseite',
      'Portfolio': 'Portfolio',
      'Teletsburg case study': 'Teletsburg-Referenz',
      '01 / VISUAL': '01 / VISUELL',
      '02 / STRUCTURE': '02 / STRUKTUR',
      '03 / CONTACT': '03 / KONTAKT',
      'PORTFOLIO / REAL PROJECT': 'PORTFOLIO / ECHTES PROJEKT',
      'Teletsburg restaurant website': 'Website für das Restaurant Teletsburg',
      'A responsive one-page website for a burger restaurant. The page brings together the project’s visual presentation, essential venue information and clear routes to the restaurant’s current contact details.': 'Eine responsive einseitige Website für ein Burgerrestaurant. Sie vereint die visuelle Gestaltung des Projekts, wichtige Informationen zum Restaurant und direkte Wege zu aktuellen Kontaktdaten.',
      'Visit the live project': 'Live-Projekt ansehen',
      'THE BRIEF': 'DIE AUFGABE',
      'Present the venue clearly on one page.': 'Das Restaurant klar auf einer Seite präsentieren.',
      'The page helps visitors understand the restaurant, view its visual identity, find the location and opening hours, and continue to the restaurant’s separate live website. This is a web-design portfolio case study, not the restaurant’s official website.': 'Die Seite stellt das Restaurant und seine visuelle Identität vor, zeigt Standort und Öffnungszeiten und führt zur eigenständigen aktuellen Website des Restaurants. Dies ist eine Webdesign-Portfolio-Referenz, nicht die offizielle Restaurant-Website.',
      'THE APPROACH': 'DIE UMSETZUNG',
      'What the project includes': 'Was das Projekt umfasst',
      'Visual direction': 'Visuelle Gestaltung',
      'Product photography and bold accents support a distinctive visual identity for the burger restaurant.': 'Produktfotos und markante Akzente schaffen einen eigenständigen visuellen Auftritt für das Burgerrestaurant.',
      'One-page structure': 'Einseitige Struktur',
      'Essential information is organised into a concise page journey and adapted for smartphone screens.': 'Die wichtigsten Informationen sind in einem kompakten Seitenablauf zusammengefasst und für Smartphones optimiert.',
      'A clear next step': 'Klarer nächster Schritt',
      'The location, opening hours and contact links help visitors move from discovery to a visit or enquiry.': 'Standort, Öffnungszeiten und Kontaktlinks führen von der ersten Orientierung zu Besuch oder Anfrage.',
      'Website design for cafés and restaurants ↗': 'Webdesign für Cafés und Restaurants ↗',
      'Need a website for your business?': 'Sie brauchen eine Website für Ihr Unternehmen?',
      'Discuss a project': 'Projekt besprechen',
      'k web · portfolio': 'k web · Portfolio',
      'All rights reserved': 'Alle Rechte vorbehalten',
      'Back to top ↑': 'Nach oben ↑'
    }),
    zh: Object.freeze({
      'Home': '首页',
      'Portfolio': '作品集',
      'Teletsburg case study': 'Teletsburg 案例',
      '01 / VISUAL': '01 / 视觉',
      '02 / STRUCTURE': '02 / 结构',
      '03 / CONTACT': '03 / 联系',
      'PORTFOLIO / REAL PROJECT': '作品集 / 实际项目',
      'Teletsburg restaurant website': 'Teletsburg 餐厅网站',
      'A responsive one-page website for a burger restaurant. The page brings together the project’s visual presentation, essential venue information and clear routes to the restaurant’s current contact details.': '为汉堡店制作的响应式单页网站。页面展示项目视觉风格、餐厅关键信息，并清晰链接至餐厅当前的联系方式。',
      'Visit the live project': '访问项目网站',
      'THE BRIEF': '项目目标',
      'Present the venue clearly on one page.': '在一个页面上清晰展示餐厅。',
      'The page helps visitors understand the restaurant, view its visual identity, find the location and opening hours, and continue to the restaurant’s separate live website. This is a web-design portfolio case study, not the restaurant’s official website.': '此页面帮助访客了解餐厅、查看其视觉形象、查找地址与营业时间，并访问餐厅独立运营的网站。这是网页设计作品集案例，并非餐厅官方网站。',
      'THE APPROACH': '设计方案',
      'What the project includes': '项目内容',
      'Visual direction': '视觉设计',
      'Product photography and bold accents support a distinctive visual identity for the burger restaurant.': '产品摄影与鲜明的视觉细节塑造了汉堡店独特的品牌形象。',
      'One-page structure': '单页结构',
      'Essential information is organised into a concise page journey and adapted for smartphone screens.': '关键信息以简洁的浏览流程呈现，并适配手机屏幕。',
      'A clear next step': '清晰的下一步',
      'The location, opening hours and contact links help visitors move from discovery to a visit or enquiry.': '地址、营业时间和联系链接帮助访客进一步到店或咨询。',
      'Website design for cafés and restaurants ↗': '咖啡馆与餐厅网站设计 ↗',
      'Need a website for your business?': '您的企业需要网站吗？',
      'Discuss a project': '讨论项目',
      'k web · portfolio': 'k web · 作品集',
      'All rights reserved': '版权所有',
      'Back to top ↑': '返回顶部 ↑'
    })
  });
  const CASE_ACCESSIBLE_LABELS = Object.freeze({
    es: {
      title: 'Caso del sitio web de Teletsburg | k web',
      brand: 'k web — Inicio',
      navigation: 'Navegación de página',
      breadcrumb: 'Ruta de navegación',
      language: 'Versión en ruso',
      cta: 'Hablar sobre un proyecto web',
      imageAlt: 'Hamburguesa destacada del proyecto Teletsburg'
    },
    de: {
      title: 'Website-Referenz für Teletsburg | k web',
      brand: 'k web — Startseite',
      navigation: 'Seitennavigation',
      breadcrumb: 'Brotkrumennavigation',
      language: 'Russische Version',
      cta: 'Website-Projekt besprechen',
      imageAlt: 'Burger aus dem Teletsburg-Projekt'
    },
    zh: {
      title: 'Teletsburg 餐厅网站案例 | k web',
      brand: 'k web — 首页',
      navigation: '页面导航',
      breadcrumb: '面包屑导航',
      language: '俄语版本',
      cta: '讨论网站项目',
      imageAlt: 'Teletsburg 项目中的招牌汉堡'
    }
  });
  const META = Object.freeze({
    ru: {
      title: 'Сайт под ключ — создание сайтов для бизнеса | k web',
      description: 'Создание сайтов под ключ для бизнеса: индивидуальный дизайн, адаптация под смартфоны, публикация и сопровождение. Стоимость сайта — от 10 000 ₽.',
      ogDescription: 'Сайт под ключ для бизнеса: индивидуальный дизайн, адаптация под смартфоны, публикация и сопровождение.',
      twitterDescription: 'Создание сайтов под ключ для бизнеса — дизайн, публикация и сопровождение.'
    },
    en: {
      title: 'Turnkey Website — Website Design for Businesses | k web',
      description: 'Turnkey website creation for businesses: custom design, mobile-ready layouts, launch and ongoing maintenance.',
      ogDescription: 'Turnkey website design and development for businesses, from custom concept to launch and support.',
      twitterDescription: 'Turnkey websites for businesses: custom design, launch and ongoing maintenance.'
    },
    es: {
      title: 'Sitio web llave en mano — creación de sitios web | k web',
      description: 'Creación de sitios web llave en mano para empresas: diseño a medida, adaptación móvil, publicación y mantenimiento.',
      ogDescription: 'Diseño y desarrollo de sitios web para empresas, desde la idea hasta la publicación y el mantenimiento.',
      twitterDescription: 'Sitios web llave en mano para empresas: diseño, publicación y mantenimiento.'
    },
    de: {
      title: 'Website schlüsselfertig — Webseitenerstellung | k web',
      description: 'Schlüsselfertige Websites für Unternehmen: individuelles Design, mobile Optimierung, Veröffentlichung und Betreuung.',
      ogDescription: 'Individuelles Webdesign und Entwicklung für Unternehmen – vom Konzept bis zur Veröffentlichung und Betreuung.',
      twitterDescription: 'Schlüsselfertige Websites für Unternehmen: Design, Veröffentlichung und Betreuung.'
    },
    zh: {
      title: '一站式企业网站建设｜网站设计与开发 | k web',
      description: '为企业提供一站式网站建设：定制设计、移动端适配、网站发布与后续维护。',
      ogDescription: '为企业提供网站设计与开发，从定制方案到网站上线及维护。',
      twitterDescription: '企业一站式网站服务：定制设计、网站发布与维护。'
    }
  });

  const COUNTRY_LANGUAGE = Object.freeze({
    RU: 'ru',
    ES: 'es', MX: 'es', AR: 'es', BO: 'es', CL: 'es', CO: 'es', CR: 'es', CU: 'es',
    DO: 'es', EC: 'es', SV: 'es', GT: 'es', HN: 'es', NI: 'es', PA: 'es', PY: 'es',
    PE: 'es', PR: 'es', UY: 'es', VE: 'es', GQ: 'es',
    DE: 'de', AT: 'de', CH: 'de', LI: 'de',
    CN: 'zh', TW: 'zh', HK: 'zh', MO: 'zh'
  });

  const COUNTRY_CURRENCY = Object.freeze({
    US: 'USD', PR: 'USD', EC: 'USD', SV: 'USD', PA: 'USD', FM: 'USD', MH: 'USD', PW: 'USD',
    GB: 'GBP', IM: 'GBP', JE: 'GBP', GG: 'GBP',
    RU: 'RUB', BY: 'BYN', KZ: 'KZT', UA: 'UAH',
    DE: 'EUR', FR: 'EUR', ES: 'EUR', IT: 'EUR', NL: 'EUR', BE: 'EUR', AT: 'EUR',
    PT: 'EUR', GR: 'EUR', FI: 'EUR', IE: 'EUR', LU: 'EUR', EE: 'EUR', LV: 'EUR',
    LT: 'EUR', SK: 'EUR', SI: 'EUR', CY: 'EUR', MT: 'EUR', HR: 'EUR',
    CH: 'CHF', LI: 'CHF', CA: 'CAD', AU: 'AUD', NZ: 'NZD',
    CN: 'CNY', HK: 'HKD', MO: 'MOP', TW: 'TWD', JP: 'JPY', KR: 'KRW', IN: 'INR',
    MX: 'MXN', BR: 'BRL', AR: 'ARS', CL: 'CLP', CO: 'COP', PE: 'PEN', UY: 'UYU',
    BO: 'BOB', PY: 'PYG', ZA: 'ZAR', NG: 'NGN', KE: 'KES', GH: 'GHS', EG: 'EGP',
    MA: 'MAD', TR: 'TRY', IL: 'ILS', AE: 'AED', SA: 'SAR', TH: 'THB', ID: 'IDR',
    MY: 'MYR', SG: 'SGD', PH: 'PHP', VN: 'VND', PK: 'PKR', BD: 'BDT',
    PL: 'PLN', CZ: 'CZK', HU: 'HUF', RO: 'RON', BG: 'EUR', SE: 'SEK', NO: 'NOK',
    DK: 'DKK', IS: 'ISK', RS: 'RSD', MD: 'MDL', GE: 'GEL', AM: 'AMD', AZ: 'AZN',
    UZ: 'UZS', KG: 'KGS', TJ: 'TJS', TM: 'TMT'
  });

  const LOCALIZED_ROUTES = Object.freeze({
    '/sajt-dlya-kafe/': {
      ru: '/sajt-dlya-kafe/',
      en: '/en/website-for-cafes/',
      es: '/es/sitio-web-para-cafes/',
      de: '/de/website-fuer-cafes/',
      zh: '/zh/website-for-cafes/'
    },
    '/en/website-for-cafes/': {
      ru: '/sajt-dlya-kafe/',
      en: '/en/website-for-cafes/',
      es: '/es/sitio-web-para-cafes/',
      de: '/de/website-fuer-cafes/',
      zh: '/zh/website-for-cafes/'
    },
    '/es/sitio-web-para-cafes/': {
      ru: '/sajt-dlya-kafe/',
      en: '/en/website-for-cafes/',
      es: '/es/sitio-web-para-cafes/',
      de: '/de/website-fuer-cafes/',
      zh: '/zh/website-for-cafes/'
    },
    '/de/website-fuer-cafes/': {
      ru: '/sajt-dlya-kafe/',
      en: '/en/website-for-cafes/',
      es: '/es/sitio-web-para-cafes/',
      de: '/de/website-fuer-cafes/',
      zh: '/zh/website-for-cafes/'
    },
    '/zh/website-for-cafes/': {
      ru: '/sajt-dlya-kafe/',
      en: '/en/website-for-cafes/',
      es: '/es/sitio-web-para-cafes/',
      de: '/de/website-fuer-cafes/',
      zh: '/zh/website-for-cafes/'
    },
    '/portfolio/teletsburg/': {
      ru: '/portfolio/teletsburg/',
      en: '/en/portfolio/teletsburg/',
      es: '/en/portfolio/teletsburg/',
      de: '/en/portfolio/teletsburg/',
      zh: '/en/portfolio/teletsburg/'
    },
    '/en/portfolio/teletsburg/': {
      ru: '/portfolio/teletsburg/',
      en: '/en/portfolio/teletsburg/',
      es: '/en/portfolio/teletsburg/',
      de: '/en/portfolio/teletsburg/',
      zh: '/en/portfolio/teletsburg/'
    }
  });

  const isSearchBot = /Googlebot|Google-InspectionTool|Bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot/i
    .test(navigator.userAgent || '');
  if (isSearchBot) return;

  const pathname = window.location.pathname.replace(/index\.html$/i, '');
  const isHomePage = pathname === '/';
  const isCasePage = pathname === '/portfolio/teletsburg/' || pathname === '/en/portfolio/teletsburg/';
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

  function normalizeLanguage(value) {
    const normalized = String(value || '').toLowerCase();
    if (normalized === 'ru' || normalized.startsWith('ru-')) return 'ru';
    if (normalized === 'es' || normalized.startsWith('es-')) return 'es';
    if (normalized === 'de' || normalized.startsWith('de-')) return 'de';
    if (normalized === 'zh' || normalized.startsWith('zh-')) return 'zh';
    if (normalized === 'en' || normalized.startsWith('en-')) return 'en';
    return null;
  }

  function browserRegion() {
    const parts = String(navigator.language || '').match(/(?:^|-)([A-Z]{2})(?:-|$)/i);
    return parts ? parts[1].toUpperCase() : '';
  }

  function fallbackLanguage() {
    return normalizeLanguage(navigator.language) || 'en';
  }

  function languageForCountry(country) {
    return country ? (COUNTRY_LANGUAGE[country] || 'en') : fallbackLanguage();
  }

  function currencyForCountry(country) {
    return COUNTRY_CURRENCY[country] || COUNTRY_CURRENCY[browserRegion()] || 'USD';
  }

  function localeFor(language, country) {
    if (language === 'ru') return country === 'RU' ? 'ru-RU' : 'ru';
    if (language === 'es') {
      if (country === 'ES') return 'es-ES';
      if (country && ['MX', 'AR', 'CL', 'CO', 'PE', 'UY'].includes(country)) return `es-${country}`;
      return 'es-419';
    }
    if (language === 'de') {
      if (country === 'CH') return 'de-CH';
      if (country === 'AT') return 'de-AT';
      return 'de-DE';
    }
    if (language === 'zh') {
      if (country === 'TW') return 'zh-TW';
      if (country === 'HK' || country === 'MO') return 'zh-HK';
      return 'zh-CN';
    }
    const browserLocale = String(navigator.language || 'en-US');
    return browserLocale.toLowerCase().startsWith('en-') ? browserLocale : 'en-US';
  }

  function readCachedRate(currency) {
    if (currency === 'RUB') return 1;
    try {
      const cached = JSON.parse(window.localStorage.getItem(RATE_CACHE_PREFIX + currency) || 'null');
      if (cached && Number.isFinite(cached.rate) && cached.rate > 0 &&
          Number.isFinite(cached.savedAt) && Date.now() - cached.savedAt < RATE_CACHE_MAX_AGE) {
        return cached.rate;
      }
    } catch (_) {
      // Storage may be disabled; use the embedded reference rates when available.
    }
    return FALLBACK_RATES[currency] || null;
  }

  function formatLocalPrice(rubles, currency, rate, locale) {
    if (currency === 'RUB' || !Number.isFinite(rate) || rate <= 0) return null;
    const amount = Math.round(Number(rubles) * rate);
    try {
      return `≈ ${new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        currencyDisplay: 'code',
        maximumFractionDigits: 0
      }).format(amount)}`;
    } catch (_) {
      return `≈ ${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(amount)} ${currency}`;
    }
  }

  function replaceRubles(text, currency, rate, locale) {
    if (currency === 'RUB' || !Number.isFinite(rate) || rate <= 0) return text;
    return text.replace(/(\d[\d\s\u00a0\u202f.,]*)\s*₽/gu, (match, digits) => {
      const amount = Number(digits.replace(/\D/g, ''));
      return Number.isFinite(amount) && amount > 0
        ? (formatLocalPrice(amount, currency, rate, locale) || match)
        : match;
    }).replace(/\bRUB\s*(\d[\d\s\u00a0\u202f.,]*)/giu, (match, digits) => {
      const amount = Number(digits.replace(/\D/g, ''));
      return Number.isFinite(amount) && amount > 0
        ? (formatLocalPrice(amount, currency, rate, locale) || match)
        : match;
    });
  }

  function updateMeta(language) {
    const meta = META[language] || META.en;
    const htmlLanguage = language === 'zh' ? 'zh-Hans' : language;
    document.documentElement.lang = htmlLanguage;
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
        data.inLanguage = htmlLanguage;
        structuredData.textContent = JSON.stringify(data);
      } catch (_) {
        // Keep page rendering independent from structured-data parsing.
      }
    }
  }

  function updateAccessibleLabels(language) {
    const labels = {
      ru: ['k web — на главную', 'Основная навигация', 'Открыть меню', 'Закрыть меню', 'Направления работы', 'Обсудить свой проект'],
      en: ['k web — Home', 'Main navigation', 'Open menu', 'Close menu', 'Services', 'Discuss my project'],
      es: ['k web — Inicio', 'Navegación principal', 'Abrir menú', 'Cerrar menú', 'Áreas de trabajo', 'Hablar de mi proyecto'],
      de: ['k web — Startseite', 'Hauptnavigation', 'Menü öffnen', 'Menü schließen', 'Leistungsbereiche', 'Eigenes Projekt besprechen'],
      zh: ['k web — 首页', '主导航', '打开菜单', '关闭菜单', '服务方向', '讨论我的项目']
    }[language] || ['k web — Home', 'Main navigation', 'Open menu', 'Close menu', 'Services', 'Discuss my project'];
    const brand = document.querySelector('a.brand');
    const nav = document.querySelector('nav.main-nav');
    const menu = document.querySelector('.menu-toggle');
    const services = document.querySelector('.marquee-band');
    const projectCta = document.querySelector('.more-work a');
    if (brand) brand.setAttribute('aria-label', labels[0]);
    if (nav) nav.setAttribute('aria-label', labels[1]);
    if (services) services.setAttribute('aria-label', labels[4]);
    if (projectCta) projectCta.setAttribute('aria-label', labels[5]);
    if (menu) {
      menu.setAttribute('aria-label', menu.getAttribute('aria-expanded') === 'true' ? labels[3] : labels[2]);
    }
  }

  function updateCaseAccessibleLabels(language) {
    const labels = CASE_ACCESSIBLE_LABELS[language];
    if (!labels) return;
    const setLabel = (selector, value) => {
      const element = document.querySelector(selector);
      if (element) element.setAttribute('aria-label', value);
    };
    setLabel('.case-brand', labels.brand);
    setLabel('.case-header nav', labels.navigation);
    setLabel('.case-breadcrumbs', labels.breadcrumb);
    setLabel('.case-header .nav-language', labels.language);
    setLabel('.case-cta', labels.cta);
    const image = document.querySelector('.case-media img');
    if (image) image.setAttribute('alt', labels.imageAlt);
  }

  function applyLanguage(language, currency, rate, country) {
    const dictionary = DICTIONARIES[language];
    const locale = localeFor(language, country);
    for (const { node, value } of originalTextNodes) {
      const leading = (value.match(/^\s*/) || [''])[0];
      const trailing = (value.match(/\s*$/) || [''])[0];
      const key = value.trim().replace(/\s+/g, ' ');
      let text = key;
      if ((isHomePage || isCasePage) && language !== 'ru') {
        text = isCasePage
          ? ((CASE_TRANSLATIONS[language] && CASE_TRANSLATIONS[language][key]) || key)
          : ((dictionary && dictionary[key]) || EN[key] || key);
        text = text.replace(/\{\{RUB:(\d+)\}\}/g, (match, amount) => {
          return formatLocalPrice(amount, currency, rate, locale) || `${amount} ₽`;
        });
      }
      text = replaceRubles(text, currency, rate, locale);
      node.nodeValue = `${leading}${text}${trailing}`;
    }
    if (isCasePage) {
      document.documentElement.lang = language === 'zh' ? 'zh-Hans' : language;
      const caseLabels = CASE_ACCESSIBLE_LABELS[language];
      if (caseLabels) document.title = caseLabels.title;
      updateCaseAccessibleLabels(language);
    }
    if (isHomePage) {
      updateMeta(language);
      updateAccessibleLabels(language);
    }
    document.documentElement.dataset.siteLanguage = language;
    document.documentElement.dataset.siteCurrency = currency;
  }

  function redirectServicePage(language) {
    if (isHomePage) return false;
    const variants = LOCALIZED_ROUTES[pathname];
    if (!variants) return false;
    const destination = variants[language] || variants.en;
    if (!destination || destination === pathname) return false;
    const params = new URLSearchParams(window.location.search);
    if (params.has('lang')) params.set('lang', language === 'zh' ? 'zh-Hans' : language);
    const query = params.toString();
    window.location.replace(`${destination}${query ? `?${query}` : ''}`);
    return true;
  }

  async function freshRate(currency) {
    if (currency === 'RUB') return 1;
    try {
      const data = await withTimeout(`${RATE_API_BASE}${encodeURIComponent(currency)}`, 3500);
      const rate = Number(data && data.rate);
      if (!Number.isFinite(rate) || rate <= 0) throw new Error('Invalid rate');
      try {
        window.localStorage.setItem(RATE_CACHE_PREFIX + currency, JSON.stringify({
          rate,
          date: data.date,
          savedAt: Date.now()
        }));
      } catch (_) {
        // Continue without persistent storage.
      }
      return rate;
    } catch (_) {
      return readCachedRate(currency);
    }
  }

  async function initialize() {
    const requested = normalizeLanguage(new URLSearchParams(window.location.search).get('lang'));
    const initialCountry = browserRegion();
    const initialLanguage = requested || languageForCountry(initialCountry);
    const initialCurrency = currencyForCountry(initialCountry);
    let activeLanguage = initialLanguage;
    let activeCurrency = initialCurrency;
    let activeCountry = initialCountry;
    let activeRate = readCachedRate(activeCurrency);

    applyLanguage(activeLanguage, activeCurrency, activeRate, activeCountry);

    let detectedCountry = '';
    try {
      const location = await withTimeout(COUNTRY_API, 1800);
      detectedCountry = String(location && location.country || '').toUpperCase();
    } catch (_) {
      // Browser language and region remain the fallback when country lookup is unavailable.
    }

    activeCountry = detectedCountry || initialCountry;
    activeLanguage = requested || languageForCountry(activeCountry);
    activeCurrency = currencyForCountry(activeCountry);
    if (redirectServicePage(activeLanguage)) return;
    activeRate = readCachedRate(activeCurrency);
    applyLanguage(activeLanguage, activeCurrency, activeRate, activeCountry);
    activeRate = await freshRate(activeCurrency);
    applyLanguage(activeLanguage, activeCurrency, activeRate, activeCountry);
  }

  initialize();
})();
