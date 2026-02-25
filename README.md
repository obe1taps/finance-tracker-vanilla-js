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

✅ Тема: light / dark / auto

✅ Donut-графики по категориям + tooltip

✅ Экспорт списка в CSV

✅ Пагинация “Load more”

✅ Модалка, тосты, адаптив

🛠 Tech Stack

Vanilla JavaScript (ES Modules)

Vite

HTML / CSS (разделено по файлам + CSS Layers)

Canvas API (без внешних библиотек)

⚙️ Getting Started
1. Install
npm install
2. Run (development)
npm run dev

Открой в браузере:

http://localhost:5173
3. Build
npm run build
4. Preview production build
npm run preview
📁 Project Structure
src/
  app/
    app.js
    dom.js
    bindEvents.js

  controllers/
    formController.js
    listController.js

  core/
    state.js
    actions.js

  domain/
    filters.js
    export.js
    selectors.js

  ui/
    ui.js
    charts.js
    donutTooltip.js
    modal.js
    toast.js
    theme.js
    filtersAccordion.js
    filtersUi.js
    categoryOptions.js

  utils/
    storage.js
    utils.js

  styles/
    index.css
    tokens.css
    base.css
    layout.css
    components/
♿ UX / Accessibility

Escape закрывает модалку и фильтры

Фокус восстанавливается при закрытии модального окна

Toast поддерживает кнопку действия “Отменить”

📦 Data Format
{
  id: "t_...",
  type: "income" | "expense",
  amount: number,
  category: string,
  date: "YYYY-MM-DD",
  note: string
}

Данные сохраняются в localStorage.

📄 License

For portfolio use.