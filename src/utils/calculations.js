export const calculateMonthlyCost = (inputs) => {
  const { averagePricePerKw, monthlyUsage, baseCharge } = inputs;
  const averagePricePerKwDollars = averagePricePerKw / 100;
  return averagePricePerKwDollars * monthlyUsage + baseCharge;
};

export const calculateTotalCost = (inputs) => {
  const { contractLength } = inputs;
  const monthlyCost = calculateMonthlyCost(inputs);
  return monthlyCost * contractLength * 12;
};

export const calculatePlanCosts = (inputs) => {
  const currentPlanCost = calculateTotalCost(inputs);
  const energySaversPlanCost = currentPlanCost * 0.95;
  const freeWeekendsPlanCost = calculateTotalCost({
    ...inputs,
    monthlyUsage: inputs.monthlyUsage * 0.8,
  });

  return {
    currentPlan: currentPlanCost,
    energySavers: energySaversPlanCost,
    freeWeekends: freeWeekendsPlanCost,
  };
};

export const calculateSavings = (planCosts) => {
  const { currentPlan, energySavers, freeWeekends } = planCosts;
  const bestAlternativeCost = Math.min(energySavers, freeWeekends);
  return currentPlan - bestAlternativeCost;
};

export const generateChartData = (inputs) => {
  const planCosts = calculatePlanCosts(inputs);

  const chartData = [];
  let accumulatedEnergySaversSavings = 0;
  let accumulatedFreeWeekendsSavings = 0;

  for (let year = 1; year <= 5; year++) {
    // Calculate yearly savings for each plan:
    const energySaversYearlySavings =
      (planCosts.currentPlan - planCosts.energySavers) / 5;
    const freeWeekendsYearlySavings =
      (planCosts.currentPlan - planCosts.freeWeekends) / 5;

    // Accumulate savings
    accumulatedEnergySaversSavings += energySaversYearlySavings;
    accumulatedFreeWeekendsSavings += freeWeekendsYearlySavings;

    chartData.push({
      year: year,
      energySavers: accumulatedEnergySaversSavings,
      freeWeekends: accumulatedFreeWeekendsSavings,
    });
  }

  return chartData;
};

export const calculateResults = (inputs) => {
  const planCosts = calculatePlanCosts(inputs);
  const savings = calculateSavings(planCosts);
  const chartData = generateChartData(inputs);

  return {
    planCosts,
    savings,
    chartData,
    recommendedPlan:
      planCosts.energySavers < planCosts.freeWeekends
        ? "Energy Savers"
        : "Free Weekends",
  };
};
