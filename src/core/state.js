import {
  DEFAULT_CURRENCY,
  DEFAULT_FILTERS,
  DEFAULT_PAGING,
} from "../config/appConfig.js";

export const state = {
  transactions: [],
  editingId: null,

  filters: { ...DEFAULT_FILTERS },

  paging: { ...DEFAULT_PAGING },

  lastDeleted: null,
  lastCleared: null,
  currency: DEFAULT_CURRENCY,
  monthlyBudget: 0,
};
