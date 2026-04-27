/**
 * @typedef {"income" | "expense"} TransactionType
 *
 * @typedef {object} Transaction
 * @property {string} id
 * @property {TransactionType} type
 * @property {number} amount
 * @property {string} category
 * @property {string} date ISO date in YYYY-MM-DD format.
 * @property {string} note
 *
 * @typedef {object} Filters
 * @property {"all" | TransactionType} type
 * @property {string} category
 * @property {string} query
 * @property {"asc" | "desc"} sort
 * @property {"all" | "7d" | "30d" | "month" | "year" | "custom"} period
 * @property {string} from
 * @property {string} to
 */

export {};
