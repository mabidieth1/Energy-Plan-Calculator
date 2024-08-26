import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import EnergyPlanForm from "./components/EnergyPlanForm";
import ResultsDisplay from "./components/ResultsDisplay";
import { useEnergyCalculator } from "./hooks/useEnergyCalculator";
import logo from "./assets/JustEnergyLogo.png";
import "./styles/App.css";

function App() {
  const { inputs, setInputs, results, calculateResults, error, isLoading } =
    useEnergyCalculator();
  const [showResults, setShowResults] = useState(false);

  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });

  const handleCalculate = () => {
    calculateResults();
    setShowResults(true);
  };

  return (
    <animated.div
      style={fadeIn}
      className="App bg-willow-brook text-madison min-h-screen"
    >
      <header className="bg-waikawa-gray text-white p-4 flex items-center justify-center flex-wrap">
        <img
          src={logo}
          alt="Just Energy logo"
          className="h-12 mr-4 mb-2 sm:mb-0"
        />
        <h1 className="text-2xl sm:text-3xl font-bold">
          Energy Plan Calculator
        </h1>
      </header>

      <main className="container mx-auto p-4">
        <section className="mb-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Enter Your Energy Usage Details
          </h2>
          <EnergyPlanForm
            inputs={inputs}
            setInputs={setInputs}
            onCalculate={handleCalculate}
            isLoading={isLoading}
          />
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

        {showResults && results && <ResultsDisplay results={results} />}
      </main>

      <footer className="bg-waikawa-gray text-white p-4 mt-8">
        <p className="text-center">
          &copy; 2024 Just Energy. All rights reserved.
        </p>
      </footer>
    </animated.div>
  );
}

export default App;
