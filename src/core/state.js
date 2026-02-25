export const state = {
  transactions: [],
  editingId: null,

  filters: {
    type: "all",
    category: "all",
    query: "",
    sort: "desc",
    period: "all",
    from: "",
    to: "",
  },

  paging: { limit: 10, step: 10 },

  lastDeleted: null,
  lastCleared: null,
  currency: "RUB",
};