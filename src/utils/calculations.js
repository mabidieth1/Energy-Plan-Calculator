export const PRICE_INCREASE_SCENARIOS = {
  BEST_CASE: 0.015,
  MODERATE_CASE: 0.03,
  WORST_CASE: 0.05,
};

// Interest rate projections for the next 5 years
const INTEREST_RATE_PROJECTIONS = [
  0.04875, // 2024: (4.75 + 5.00) / 2
  0.03375, // 2025: (3.00 + 3.75) / 2
  0.0255, // 2026: (2.00 + 3.10) / 2
  0.029, // 2027
  0.029, // 2028
];

export function calculateMonthlyCost(
  baseRate,
  monthlyUsage,
  usageCharge,
  TDUCharge,
  minUsageFee
) {
  return (
    baseRate * monthlyUsage +
    usageCharge * monthlyUsage +
    TDUCharge +
    minUsageFee
  );
}

export function calculateEnergySaversCost(inputs) {
  const { baseRate, monthlyUsage, usageCharge, TDUCharge, minUsageFee } =
    inputs;
  return calculateMonthlyCost(
    baseRate * 0.95,
    monthlyUsage,
    usageCharge,
    TDUCharge,
    minUsageFee
  );
}

export function calculateFreeWeekendsCost(inputs) {
  const { baseRate, monthlyUsage, usageCharge, TDUCharge, minUsageFee } =
    inputs;
  const weekdayUsage = 0.7 * monthlyUsage;
  const weekendUsage = 0.3 * monthlyUsage;
  return (
    calculateMonthlyCost(
      baseRate * 0.98,
      weekdayUsage,
      usageCharge,
      TDUCharge,
      minUsageFee
    ) + calculateMonthlyCost(0, weekendUsage, usageCharge, TDUCharge, 0)
  );
}

export function calculateTotalCosts(inputs, priceIncrease) {
  const monthlyCurrentPlanCost = calculateMonthlyCost(
    inputs.baseRate,
    inputs.monthlyUsage,
    inputs.usageCharge,
    inputs.TDUCharge,
    inputs.minUsageFee
  );
  const monthlyEnergySaversCost = calculateEnergySaversCost(inputs);
  const monthlyFreeWeekendsCost = calculateFreeWeekendsCost(inputs);

  let currentPlanTotal = 0;
  let energySaversTotal = 0;
  let freeWeekendsTotal = 0;
  const currentPlanYearly = [];
  const energySaversYearly = [];
  const freeWeekendsYearly = [];

  for (let year = 0; year < inputs.contractLength; year++) {
    const priceMultiplier = Math.pow(1 + priceIncrease, year);
    const interestRate =
      INTEREST_RATE_PROJECTIONS[
        Math.min(year, INTEREST_RATE_PROJECTIONS.length - 1)
      ];
    const interestMultiplier = 1 + interestRate;

    const currentYearlyCost =
      monthlyCurrentPlanCost * 12 * priceMultiplier * interestMultiplier;
    const energySaversYearlyCost =
      monthlyEnergySaversCost * 12 * priceMultiplier * interestMultiplier;
    const freeWeekendsYearlyCost =
      monthlyFreeWeekendsCost * 12 * priceMultiplier * interestMultiplier;

    currentPlanTotal += currentYearlyCost;
    energySaversTotal += energySaversYearlyCost;
    freeWeekendsTotal += freeWeekendsYearlyCost;

    currentPlanYearly.push(currentYearlyCost);
    energySaversYearly.push(energySaversYearlyCost);
    freeWeekendsYearly.push(freeWeekendsYearlyCost);
  }

  return {
    currentPlan: currentPlanTotal,
    energySavers: energySaversTotal,
    freeWeekends: freeWeekendsTotal,
    currentPlanYearly,
    energySaversYearly,
    freeWeekendsYearly,
  };
}

export function calculateSavings(totalCosts) {
  return Math.max(
    totalCosts.currentPlan - totalCosts.energySavers,
    totalCosts.currentPlan - totalCosts.freeWeekends
  );
}

export function calculateBreakEven(savings, ETF, contractLength) {
  const monthlySavings = savings / (contractLength * 12);
  return monthlySavings > 0 ? Math.ceil(ETF / monthlySavings) : Infinity;
}

export function calculateChartData(inputs, priceIncrease) {
  const totalCosts = calculateTotalCosts(inputs, priceIncrease);
  const years = Array.from({ length: inputs.contractLength }, (_, i) => i + 1);

  return {
    years,
    currentPlanCosts: totalCosts.currentPlanYearly,
    energySaversCosts: totalCosts.energySaversYearly,
    freeWeekendsCosts: totalCosts.freeWeekendsYearly,
  };
}
