import { parseMoneyInput, todayISO } from "../utils/utils.js";

export function readForm(form) {
  return {
    type: form.elements.type.value,
    category: form.elements.category.value,
    date: form.elements.date.value,
    note: form.elements.note.value.trim(),
    amount: parseMoneyInput(form.elements.amount.value),
  };
}

export function validateForm(data) {
  if (!data.date) return "Укажи дату.";
  if (!data.category) return "Выбери категорию.";
  if (!data.type) return "Выбери тип операции.";

  if (!Number.isFinite(data.amount)) return "Введите корректную сумму.";
  if (data.amount <= 0) return "Сумма должна быть больше 0.";

  return "";
}

export function resetFormToDefault(form) {
  form.reset();
  form.elements.date.value = todayISO();
}