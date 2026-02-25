💰 Finance Tracker (Vanilla JS)

Небольшой трекер личных финансов: добавляй доходы и расходы, смотри итоги, фильтруй операции, анализируй категории и экспортируй данные в CSV.

🚀 Features

✅ CRUD операций: добавить / редактировать / удалить

✅ Undo для удаления операции и очистки списка

✅ Хранение данных в localStorage

✅ Фильтры: тип, категория, поиск по заметке

✅ Период: 7 дней / 30 дней / месяц / год / кастомный диапазон

✅ Сортировка по дате

✅ Валюта: RUB / USD / BYN

✅ Тема: light / dark / auto (с сохранением выбора)

✅ Donut-графики по категориям + tooltip

✅ Экспорт списка в CSV (совместимо с Excel, разделитель ;, BOM UTF-8)

✅ Пагинация “Load more”

✅ UI-компоненты: модалка, тосты, адаптивная верстка

🛠 Tech Stack

Vanilla JavaScript (ES Modules)

Vite

HTML / CSS (разделение по файлам + CSS Layers)

Canvas (графики без внешних библиотек)

⚙️ Getting Started
1. Install
npm install
2. Run (dev)
npm run dev

Открой адрес из терминала (обычно http://localhost:5173).

3. Build
npm run build
4. Preview production build
npm run preview
📁 Project Structure
src/
  app/
    app.js              # сборка логики приложения
    dom.js              # DOM refs
    bindEvents.js       # централизованная привязка событий

  controllers/
    formController.js   # чтение и валидация формы
    listController.js   # обработка кликов (edit/remove)

  core/
    state.js            # состояние приложения
    actions.js          # add/update/delete/undo/persist

  domain/
    filters.js          # фильтрация (pure functions)
    export.js           # CSV export
    selectors.js        # totals / category totals / top+other

  ui/
    ui.js               # рендер списка, итогов, статистики
    charts.js           # donut chart + hit test
    donutTooltip.js     # tooltip для графика
    modal.js            # модалка + восстановление фокуса
    toast.js            # система уведомлений
    theme.js            # логика темы
    filtersAccordion.js # accordion для фильтров
    filtersUi.js        # синхронизация UI фильтров
    categoryOptions.js  # категории по типу операции

  utils/
    storage.js          # localStorage helpers
    utils.js            # format / escape helpers

  styles/
    index.css
    tokens.css
    base.css
    layout.css
    components...
♿ UX / Accessibility Notes

Escape закрывает модалку и фильтры

Фокус восстанавливается при закрытии модального окна

Toast поддерживает action-кнопку “Отменить”

📦 Data Format
{
  id: "t_...",
  type: "income" | "expense",
  amount: number,
  category: string,
  date: "YYYY-MM-DD",
  note: string
}

Данные сохраняются в localStorage (версионированный ключ для возможных миграций).

📄 License

For portfolio use.