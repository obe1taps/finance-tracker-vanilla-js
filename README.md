## 🔗 Live Demo
https://finance-tracker-vanilla-js.vercel.app

# 💰 Finance Tracker (Vanilla JS)

Небольшой трекер личных финансов: добавляй доходы и расходы, смотри итоги, фильтруй операции, анализируй категории и экспортируй данные в CSV.

---

## 🚀 Features

- ✅ CRUD операций: добавить / редактировать / удалить  
- ✅ Undo для удаления операции и очистки списка  
- ✅ Хранение данных в **localStorage**  
- ✅ Фильтры: тип, категория, поиск по заметке  
- ✅ Расширенный поиск: комментарий, категория, дата, сумма и тип операции
- ✅ Период: 7 дней / 30 дней / месяц / год / кастомный диапазон  
- ✅ Месячный бюджет с прогрессом и остатком
- ✅ Обзор месяца: доход, баланс, средний расход, крупная трата и количество операций
- ✅ Быстрые суммы в форме добавления операции
- ✅ Сортировка по дате  
- ✅ Валюта: **RUB / USD / BYN**  
- ✅ Тема: light / dark / auto  
- ✅ Donut-графики по категориям + tooltip  
- ✅ Экспорт списка в CSV (Excel-friendly: `;` + UTF-8 BOM)  
- ✅ Пагинация “Load more”  
- ✅ Модалка, тосты, адаптив  

---

## 🛠 Tech Stack

- Vanilla JavaScript (ES Modules)
- Vite
- HTML / CSS (разделено по файлам + CSS Layers)
- Canvas API (без внешних библиотек)

---

## ⚙️ Getting Started

### 1. Install

```bash
npm install
```

### 2. Run (development)

```bash
npm run dev
```

Открой в браузере:

```
http://localhost:5173
```

### 3. Build

```bash
npm run build
```

### 4. Preview production build

```bash
npm run preview
```

---

## 📁 Структура проекта

```text
src/
  main.js                # точка входа (Vite)

  app/
    app.js               # инициализация приложения
    bindEvents.js        # централизованная привязка событий
    dom.js               # ссылки на DOM-элементы

  controllers/
    formController.js    # чтение и валидация формы
    listController.js    # обработка кликов по списку (edit/remove)

  core/
    state.js             # состояние приложения
    actions.js           # add/update/delete/undo/persist

  domain/
    filters.js           # логика фильтрации и периодов (pure functions)
    export.js            # экспорт в CSV
    selectors.js         # вычисление итогов и агрегированных данных

  ui/
    ui.js                # рендер списка, итогов и статистики
    charts.js            # donut-графики
    donutTooltip.js      # tooltip для графиков
    modal.js             # логика модального окна
    toast.js             # система уведомлений
    theme.js             # управление темой
    filtersAccordion.js  # аккордеон фильтров
    filtersUi.js         # синхронизация фильтров с DOM
    categoryOptions.js   # обновление категорий по типу операции

  utils/
    storage.js           # работа с localStorage
    utils.js             # вспомогательные функции

  styles/
    index.css
    tokens.css
    base.css
    layout.css
    controls.css
    filters.css
    cards.css
    transactions.css
    stats.css
    modal.css
    toasts.css
    responsive.css
```

---

## ♿ UX / Accessibility

- `Escape` закрывает модалку и фильтры  
- Фокус восстанавливается при закрытии модального окна  
- Toast поддерживает кнопку действия “Отменить”  

---

## 📦 Data Format

```js
{
  id: "t_...",
  type: "income" | "expense",
  amount: number,
  category: string,
  date: "YYYY-MM-DD",
  note: string
}
```

Данные сохраняются в `localStorage`.

---

## 📄 License

For portfolio use.
