// Кастомные скрипты
console.log('site.js загружен');
// Автоскрытие alert-сообщений с классом .auto-dismiss
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.alert.auto-dismiss').forEach(function (el) {
        setTimeout(function () {
            // Bootstrap 5: плавное скрытие через класс .fade и удаление
            el.classList.remove('show');
            setTimeout(function () { el.remove(); }, 300);
        }, 3000); // 3000 мс = 3 сек
    });
});

// Автоскрытие alert-сообщений с классом .auto-dismiss
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.alert.auto-dismiss').forEach(function (el) {
        setTimeout(function () {
            el.classList.remove('show');
            setTimeout(function () { el.remove(); }, 300);
        }, 3000);
    });
});

// ===== Тег-фильтр: мгновенная визуальная подсветка при клике =====
document.addEventListener('DOMContentLoaded', function () {
    const filters = document.querySelectorAll('.tag-filter');
    if (!filters.length) return;

    filters.forEach(function (btn) {
        btn.addEventListener('click', function () {
            // Мгновенно снимаем active со всех...
            filters.forEach(function (b) { b.classList.remove('active'); });
            // ...и вешаем на нажатый (до перехода по ссылке)
            this.classList.add('active');
            // Дальше браузер сам откроет href — сервер вернёт уже отфильтрованный список
        });
    });
});