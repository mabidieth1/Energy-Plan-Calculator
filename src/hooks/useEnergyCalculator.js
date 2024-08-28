import { useState } from "react";
import { calculateResults, calculateMonthlyCost } from "../utils/calculations";

export function useEnergyCalculator() {
  // eslint-disable-next-line no-unused-vars
  const [inputs, setInputs] = useState({
    averagePricePerKw: "",
    monthlyUsage: "",
    baseCharge: "",
    contractLength: 5,
  });

  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculate = (formValues) => {
    console.log("Calculating results...");
    setIsLoading(true);
    setError(null);

    try {
      const averagePricePerKw = parseFloat(formValues.averagePricePerKw);
      const monthlyUsage = parseInt(formValues.monthlyUsage, 10);
      const baseCharge = parseFloat(formValues.baseCharge);

      if (
        (formValues.averagePricePerKw !== "" &&
          (isNaN(averagePricePerKw) || averagePricePerKw <= 0)) ||
        (formValues.monthlyUsage !== "" &&
          (isNaN(monthlyUsage) || monthlyUsage <= 0)) ||
        (formValues.baseCharge !== "" && (isNaN(baseCharge) || baseCharge < 0))
      ) {
        throw new Error("Invalid input values. Please check your entries.");
      }

      const calculationResults = calculateResults({
        averagePricePerKw,
        monthlyUsage,
        baseCharge,
        contractLength: 5,
      });
      console.log("Calculation results:", calculationResults);

      console.log("chartData:", calculationResults.chartData);

      const monthlySavingsCurrent = calculateMonthlyCost({
        averagePricePerKw,
        monthlyUsage,
        baseCharge,
      });
      const monthlySavingsEnergySavers = calculateMonthlyCost({
        averagePricePerKw: averagePricePerKw * 0.95,
        monthlyUsage,
        baseCharge,
      });
      const monthlySavingsFreeWeekends = calculateMonthlyCost({
        averagePricePerKw,
        monthlyUsage: monthlyUsage * 0.8,
        baseCharge,
      });

      const bestMonthlySavings = Math.max(
        monthlySavingsCurrent - monthlySavingsEnergySavers,
        monthlySavingsCurrent - monthlySavingsFreeWeekends
      );

      setResults({
        ...calculationResults,
        potentialSavings: calculationResults.savings,
        monthlySavings: bestMonthlySavings,
        inputs: {
          averagePricePerKw,
          monthlyUsage,
          baseCharge,
          contractLength: 5,
        },
      });
    } catch (err) {
      console.error("Error in calculations:", err);
      setError(err.message);
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    inputs,
    results,
    calculate,
    error,
    isLoading,
  };
}
