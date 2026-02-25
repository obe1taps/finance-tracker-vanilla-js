export function handleListClick({
  e,
  state,
  modal,
  formatRub,
  showToast,
  rerender,
  startEdit,
  deleteTransactionWithUndo,
  undoLastDelete,
}) {
  const removeBtn = e.target.closest("button[data-action='remove']");
  if (removeBtn) {
    const li = removeBtn.closest("li[data-id]");
    if (!li) return;

    const id = li.dataset.id;
    const ok = confirm("Удалить операцию?");
    if (!ok) return;

    const res = deleteTransactionWithUndo(state, id);
    if (!res) return;

    rerender();

    showToast({
      title: "Операция удалена",
      text: `${res.tx.type === "income" ? "Доход" : "Расход"}: ${formatRub(res.tx.amount)} • ${res.tx.category}`,
      type: "danger",
      ms: res.ms,
      actionText: "Отменить",
      onAction: () => {
        if (!undoLastDelete(state)) return;
        rerender();
        showToast({ title: "Удаление отменено", type: "success" });
      },
    });
    return;
  }

  const li = e.target.closest("li[data-id]");
  if (!li) return;

  const id = li.dataset.id;
  const tx = state.transactions.find((t) => t.id === id);
  if (!tx) return;

  startEdit(tx);
  rerender();
  modal.open();
}