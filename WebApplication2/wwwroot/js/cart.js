// ================================================================
// AJAX-добавление товаров в корзину + обновление счётчика
// ================================================================

document.addEventListener('DOMContentLoaded', function () {

    const grid = document.getElementById('catalogGrid');
    const badge = document.getElementById('cartBadge');

    // ---------- 1. Подтягиваем актуальный счётчик при загрузке ----------
    loadCartCount();

    // ---------- 2. Event delegation: один слушатель на контейнер ----------
    if (grid) {
        grid.addEventListener('click', function (e) {
            const btn = e.target.closest('.add-to-cart');
            if (!btn || btn.disabled) return;

            const productId = btn.dataset.productId;
            addToCart(productId, btn);
        });
    }

    // ---------- 3. Загрузить начальное значение бейджа ----------
    async function loadCartCount() {
        if (!badge) return;
        try {
            const response = await fetch('/Catalog?handler=GetCartCount');
            if (!response.ok) return;

            const data = await response.json();
            badge.textContent = data.count;
            toggleBadgeVisibility(data.count);
        } catch (error) {
            console.error('Cart count load failed:', error);
        }
    }

    // ---------- 4. Главная функция добавления ----------
    async function addToCart(productId, button) {
        const originalText = button.textContent;
        const originalClass = button.className;

        // Блокируем кнопку и показываем спиннер
        button.disabled = true;
        button.innerHTML =
            '<span class="spinner-border spinner-border-sm me-1"></span> Добавление...';

        try {
            // Берём antiforgery-токен из meta-тега
            const token = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content') || '';

            // POST-запрос
            const response = await fetch('/Catalog?handler=AddToCart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'RequestVerificationToken': token
                },
                body: 'id=' + encodeURIComponent(productId)
            });

            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }

            const data = await response.json();

            if (data.success) {
                // Обновляем бейдж
                if (badge) {
                    badge.textContent = data.cartCount;
                    toggleBadgeVisibility(data.cartCount);
                    pulseBadge();
                }

                // Кнопка становится зелёной с галочкой
                button.innerHTML = 'Добавлено ✓';
                button.classList.remove('btn-primary');
                button.classList.add('btn-success');

                // Показываем всплывашку справа снизу
                showToast(`«${data.productName}» добавлен в корзину`);

                // Через 1.8 сек возвращаем исходное состояние
                setTimeout(function () {
                    button.innerHTML = originalText;
                    button.className = originalClass;
                    button.disabled = false;
                }, 1800);
            } else {
                // Товар не найден или другая логическая ошибка
                showToast(data.message || 'Ошибка добавления', 'danger');
                button.textContent = originalText;
                button.className = originalClass;
                button.disabled = false;
            }
        } catch (error) {
            console.error('AddToCart error:', error);
            button.textContent = 'Ошибка';
            button.classList.remove('btn-primary');
            button.classList.add('btn-danger');

            showToast('Не удалось добавить товар. Попробуйте ещё раз.', 'danger');

            setTimeout(function () {
                button.textContent = originalText;
                button.className = originalClass;
                button.disabled = false;
            }, 1800);
        }
    }

    // ---------- 5. Скрываем бейдж, если корзина пуста ----------
    function toggleBadgeVisibility(count) {
        if (!badge) return;
        badge.style.display = count > 0 ? '' : 'none';
    }

    // ---------- 6. Анимация «пульса» бейджа при добавлении ----------
    function pulseBadge() {
        if (!badge) return;
        badge.classList.add('badge-pulse');
        setTimeout(function () {
            badge.classList.remove('badge-pulse');
        }, 600);
    }

    // ---------- 7. Мини-тост в правом нижнем углу ----------
    function showToast(message, type) {
        type = type || 'success';

        const container = document.getElementById('toastContainer');
        if (!container) return;

        const el = document.createElement('div');
        el.className = 'alert alert-' + type + ' shadow-sm mb-2 toast-message';
        el.setAttribute('role', 'alert');
        el.textContent = message;

        container.appendChild(el);

        // Автоскрытие через 2.5 сек
        setTimeout(function () {
            el.classList.add('toast-hide');
            setTimeout(function () { el.remove(); }, 400);
        }, 2500);
    }
});