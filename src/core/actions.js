import { saveTransactions } from "../utils/storage.js";
import { generateId } from "../utils/utils.js";

const UNDO_MS = 5000;

const round2 = (n) => Math.round(n * 100) / 100;

export function persist(state) {
  saveTransactions(state.transactions);
}

export function addTransaction(state, { type, amount, category, date, note }) {
  const tx = {
    id: generateId(),
    type,
    amount: round2(Number(amount) || 0),
    category,
    date,
    note,
  };

  state.transactions = [tx, ...state.transactions];
  persist(state);
  return tx;
}

export function updateTransaction(state, id, patch) {
  state.transactions = state.transactions.map((t) => {
    if (t.id !== id) return t;

    const next = { ...t, ...patch };

    if (Object.prototype.hasOwnProperty.call(patch, "amount")) {
      const a = Number(patch.amount);
      next.amount = round2(Number.isFinite(a) ? a : 0);
    }

    return next;
  });

  persist(state);
}

export function deleteTransactionWithUndo(state, id) {
  const index = state.transactions.findIndex((t) => t.id === id);
  if (index === -1) return null;

  const tx = state.transactions[index];
  state.transactions = state.transactions.filter((t) => t.id !== id);
  persist(state);

  state.lastDeleted = {
    tx,
    index,
    expiresAt: Date.now() + UNDO_MS,
  };

  return { tx, index, ms: UNDO_MS };
}

export function undoLastDelete(state) {
  if (!state.lastDeleted || Date.now() > state.lastDeleted.expiresAt) return false;

  const { tx, index } = state.lastDeleted;
  const safeIndex = Math.min(Math.max(index, 0), state.transactions.length);
  state.transactions.splice(safeIndex, 0, tx);

  state.lastDeleted = null;
  persist(state);
  return true;
}

export function clearAllWithUndo(state) {
  if (state.transactions.length === 0) return null;

  state.lastCleared = {
    list: [...state.transactions],
    expiresAt: Date.now() + UNDO_MS,
  };

  state.transactions = [];
  persist(state);

  return { count: state.lastCleared.list.length, ms: UNDO_MS };
}

export function undoClearAll(state) {
  if (!state.lastCleared || Date.now() > state.lastCleared.expiresAt) return false;

  state.transactions = [...state.lastCleared.list];
  state.lastCleared = null;
  persist(state);
  return true;
}

export function resetPaging(state, limit = 10) {
  state.paging.limit = limit;
}