import { BUDGET_PROGRESS } from "../config/appConfig.js";

export function getBudgetSummary(monthlyBudget, spent) {
  const budget = Number(monthlyBudget) || 0;
  const expense = Number(spent) || 0;
  const left = budget - expense;
  const progress =
    budget > 0
      ? Math.min((expense / budget) * 100, BUDGET_PROGRESS.maxPct)
      : 0;

  let status = "empty";
  if (budget > 0 && left < 0) status = "danger";
  else if (budget > 0 && progress >= BUDGET_PROGRESS.warningPct) {
    status = "warning";
  } else if (budget > 0) {
    status = "good";
  }

  return {
    budget,
    left,
    progress,
    status,
    isOverLimit: left < 0,
    isWarning:
      status === "warning" || status === "danger",
  };
}
