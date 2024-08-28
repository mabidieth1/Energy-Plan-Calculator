import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import EnergyPlanForm from "./components/EnergyPlanForm";
import ResultsDisplay from "./components/ResultsDisplay";
import { useEnergyCalculator } from "./hooks/useEnergyCalculator";
import logo from "./assets/JustEnergyLogo.png";
import "./styles/App.css";

function App() {
  const { inputs, results, calculate, error, isLoading } =
    useEnergyCalculator();
  const [showResults, setShowResults] = useState(false);

  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });

  const handleCalculate = (values, { setSubmitting }) => {
    calculate(values);
    setShowResults(true);
    setSubmitting(false);
  };

  // Data processing for charts
  const formattedChartData =
    results?.chartData.map((dataPoint, index) => ({
      year: index + 1,
      currentPlan: dataPoint.currentPlan,
      energySavers: dataPoint.energySavers,
      freeWeekends: dataPoint.freeWeekends,
    })) || [];

  return (
    <animated.div
      style={fadeIn}
      className="App bg-willow-brook text-madison min-h-screen"
    >
      <header className="bg-waikawa-gray text-white p-4 flex items-center justify-center flex-wrap">
        <img
          src={logo}
          alt="Just Energy logo"
          className="App-logo h-24 w-auto max-w-[70%] sm:max-w-[50%] md:max-w-[40%] lg:max-w-[30%] xl:max-w-[25%]"
        />
        <h1 className="text-2xl sm:text-3xl font-bold">
          Energy Plan Calculator
        </h1>
      </header>

      <main className="container mx-auto p-4">
        <section className="mb-8 bg-white rounded-lg shadow-lg p-6">
          <EnergyPlanForm onSubmit={handleCalculate} initialValues={inputs} />
        </section>

        {isLoading && (
          <div className="flex justify-center items-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-madison"></div>
          </div>
        )}

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {showResults && results && (
          <ResultsDisplay
            results={{
              ...results,
              currentPlanTotalCost: results.planCosts.currentPlan,
              energySaversTotalCost: results.planCosts.energySavers,
              freeWeekendsTotalCost: results.planCosts.freeWeekends,
              chartData: formattedChartData,
            }}
          />
        )}
      </main>

      <footer className="bg-waikawa-gray text-white p-4 mt-8">
        <p className="text-center">
          © 2024 Texas Energy Calculator. All rights reserved.
        </p>
        {/* Disclaimer */}
        <p className="text-center text-[8px] mt-24 mb-4 mx-auto max-w-2xl text-gray-500">
          Disclaimer: The Energy Plan Calculator provides estimated savings
          based on the information provided and current market rates. Actual
          savings may vary. This tool is for informational purposes only and
          should not be considered as financial advice. We do not guarantee the
          accuracy of the results and are not liable for any decisions made
          based on this calculator's outputs. Please consult with a professional
          for personalized advice.
        </p>
      </footer>
    </animated.div>
  );
}

export default App;
