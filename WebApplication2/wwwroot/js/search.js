// ================================================================
// Live-поиск по каталогу через fetch (без jQuery, только vanilla JS)
// ================================================================

document.addEventListener('DOMContentLoaded', function () {

    const input = document.getElementById('searchInput');
    const grid = document.getElementById('catalogGrid');

    // Если мы не на странице каталога — ничего не делаем
    if (!input || !grid) return;

    let timeoutId = null;

    // ---------- Обработчик ввода с дебаунсом ----------
    input.addEventListener('input', function () {
        clearTimeout(timeoutId);

        const query = input.value.trim();

        // Если ввели 0–1 символ — показываем весь каталог (без перезагрузки)
        if (query.length < 2) {
            timeoutId = setTimeout(function () {
                loadAllProducts();
            }, 300);
            return;
        }

        // Иначе — ждём 300 мс после последнего нажатия и шлём запрос
        timeoutId = setTimeout(function () {
            searchProducts(query);
        }, 300);
    });

    // ---------- Загрузка всех товаров (пустой query) ----------
    async function loadAllProducts() {
        grid.innerHTML =
            '<div class="text-center py-5">' +
            '  <div class="spinner-border text-primary" role="status"></div>' +
            '</div>';

        try {
            const response = await fetch('/Catalog?handler=Search');
            if (!response.ok) throw new Error('HTTP ' + response.status);

            const html = await response.text();
            grid.innerHTML = html;

            // Обновим бейдж с количеством (если есть)
            updateProductCountBadge();
        } catch (error) {
            grid.innerHTML = '<div class="alert alert-danger">Ошибка загрузки каталога</div>';
            console.error(error);
        }
    }

    // ---------- Поиск ----------
    async function searchProducts(query) {
        // 1. Показываем спиннер
        grid.innerHTML =
            '<div class="text-center py-5">' +
            '  <div class="spinner-border text-primary" role="status"></div>' +
            '  <div class="text-muted mt-2">Поиск...</div>' +
            '</div>';

        try {
            // 2. Отправляем запрос к серверу
            const url = '/Catalog?handler=Search&query=' + encodeURIComponent(query);
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }

            // 3. Читаем HTML из ответа
            const html = await response.text();

            // 4. Смотрим — пустой ответ или нет
            if (!html.trim() || html.includes('Ничего не найдено')) {
                grid.innerHTML =
                    '<div class="alert alert-info text-center">' +
                    '  Ничего не найдено по запросу «' +
                    escapeHtml(query) +
                    '»' +
                    '</div>';
            } else {
                // 5. Вставляем HTML с карточками
                grid.innerHTML = html;
            }

            // 6. Обновляем бейдж «N товаров»
            updateProductCountBadge();

        } catch (error) {
            // 7. Показываем ошибку
            grid.innerHTML =
                '<div class="alert alert-danger">' +
                '  Ошибка поиска. Попробуйте ещё раз.' +
                '</div>';
            console.error('Search error:', error);
        }
    }

    // ---------- Подсчёт товаров в текущей выдаче ----------
    function updateProductCountBadge() {
        const badge = document.getElementById('product-count-badge');
        if (!badge) return;

        const cards = grid.querySelectorAll('.product-card');
        const n = cards.length;
        // Простое склонение: "товар / товара / товаров"
        let word = 'товаров';
        if (n % 10 === 1 && n % 100 !== 11) word = 'товар';
        else if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) word = 'товара';

        badge.textContent = n + ' ' + word;
    }

    // ---------- Мини-хелпер для безопасной вставки текста ----------
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ---------- Кнопка «Очистить» ----------
    const clearBtn = document.getElementById('searchClear');
    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            input.value = '';
            clearTimeout(timeoutId);
            loadAllProducts();
            input.focus();
        });
    }
});