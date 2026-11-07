# k web — статический сайт

Маркетинговый сайт k web работает на HTML/CSS/JavaScript без обязательного backend. Главная `/` сохранена в исходном виде и автоматически выбирает русский или английский язык через `localization.js`; `/en/` перенаправляет на главную и не индексируется отдельно.

Для услуги создания сайта кафе и ресторанов есть статические страницы на русском `/sajt-dlya-kafe/`, английском `/en/website-for-cafes/`, испанском `/es/sitio-web-para-cafes/`, немецком `/de/website-fuer-cafes/` и упрощённом китайском `/zh/website-for-cafes/`. Они связаны через canonical, `hreflang` и sitemap. Кейс «Телецбург» находится отдельно от сайта ресторана: `/portfolio/teletsburg/` и `/en/portfolio/teletsburg/`. Сам сайт ресторана доступен по `/Teletsburg/`; домен `teletsburg.site` сейчас не разрешается DNS.

## Публикация

GitHub Pages публикует статический сайт из корня репозитория. GitHub Actions публикует тот же набор файлов в Cloudflare Pages (`kxxweb-site`) при каждом push в `main`. Перед отправкой Cloudflare workflow синхронизирует каталог `public/` из корня командой `node .github/scripts/sync-public.mjs`; изменения сайта следует вносить в корневые файлы и каталоги. Скрипт исключает GitHub-настройки, `CNAME`, README и сам каталог `public/`, но копирует страницы, ресурсы, favicon, sitemap и robots.txt.

Сайт доступен без сборки приложения. `sitemap.xml` перечисляет только публичные индексируемые страницы; `/en/` и старый адрес кейса `/en/Teletsburg/` в карту не входят.
