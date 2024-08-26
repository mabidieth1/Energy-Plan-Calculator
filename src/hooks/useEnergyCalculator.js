import { useState } from "react";
import {
  PRICE_INCREASE_SCENARIOS,
  calculateTotalCosts,
  calculateSavings,
  calculateBreakEven,
  calculateChartData,
} from "../utils/calculations";

export function useEnergyCalculator() {
  const [inputs, setInputs] = useState({
    baseRate: 0.1,
    monthlyUsage: 1000,
    TDUCharge: 3.42,
    usageCharge: 0.046384,
    minUsageFee: 4.99,
    contractLength: 5,
    ETF: 100,
    priceIncreaseScenario: "MODERATE_CASE",
  });

  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculateResults = () => {
    console.log("Calculating results..."); // Debugging
    setIsLoading(true);
    setError(null);

    try {
      const priceIncrease =
        PRICE_INCREASE_SCENARIOS[inputs.priceIncreaseScenario];
      console.log("Price increase:", priceIncrease); // Debugging

      // Validate inputs
      if (
        inputs.baseRate <= 0 ||
        inputs.monthlyUsage <= 0 ||
        inputs.contractLength <= 0
      ) {
        throw new Error("Invalid input values. Please check your entries.");
      }

      const totalCosts = calculateTotalCosts(inputs, priceIncrease);
      console.log("Total costs:", totalCosts); // Debugging

      const savings = calculateSavings(totalCosts);
      const breakEvenMonths = calculateBreakEven(
        savings,
        inputs.ETF,
        inputs.contractLength
      );
      const chartData = calculateChartData(inputs, priceIncrease);

      const recommendedPlan =
        totalCosts.energySavers < totalCosts.freeWeekends
          ? "Energy Savers"
          : "Free Weekends";

      const newResults = {
        currentPlanTotalCost: totalCosts.currentPlan,
        energySaversTotalCost: totalCosts.energySavers,
        freeWeekendsTotalCost: totalCosts.freeWeekends,
        potentialSavings: savings,
        breakEvenPoint: breakEvenMonths,
        chartData: chartData,
        inputs: inputs,
        recommendedChoice:
          savings > 0
            ? `You could be saving $${(
                savings /
                (inputs.contractLength * 12)
              ).toFixed(
                2
              )} per month! Switch to the ${recommendedPlan} plan for optimal savings.`
            : "Your current plan appears to be the most cost-effective option at this time.",
        recommendedPlan,
      };

      console.log("New results:", newResults); // Debugging
      setResults(newResults);
    } catch (err) {
      console.error("Error in calculations:", err); // Debugging
      setError(err.message);
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    inputs,
    setInputs,
    results,
    calculateResults,
    error,
    isLoading,
  };
}
