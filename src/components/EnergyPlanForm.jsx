import React from "react";
import { useTrail, animated } from "react-spring";

const inputFields = [
  {
    name: "baseRate",
    label: "Base Rate ($/kWh)",
    type: "number",
    step: "0.000001",
  },
  { name: "monthlyUsage", label: "Monthly Usage (kWh)", type: "number" },
  { name: "TDUCharge", label: "TDU Charge ($)", type: "number", step: "0.01" },
  {
    name: "usageCharge",
    label: "Usage Charge ($/kWh)",
    type: "number",
    step: "0.000001",
  },
  {
    name: "minUsageFee",
    label: "Minimum Usage Fee ($)",
    type: "number",
    step: "0.01",
  },
  { name: "contractLength", label: "Contract Length (years)", type: "number" },
  {
    name: "ETF",
    label: "Early Termination Fee ($)",
    type: "number",
    step: "0.01",
  },
];

const priceIncreaseOptions = [
  { value: "BEST_CASE", label: "Best Case (1.5%)" },
  { value: "MODERATE_CASE", label: "Moderate Case (3.0%)" },
  { value: "WORST_CASE", label: "Worst Case (5.0%)" },
];

function EnergyPlanForm({ inputs, setInputs, onCalculate, isLoading }) {
  const trail = useTrail(inputFields.length + 2, {
    from: { opacity: 0, transform: "translate3d(0, 40px, 0)" },
    to: { opacity: 1, transform: "translate3d(0, 0, 0)" },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onCalculate();
      }}
      className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trail.map((props, index) => {
          if (index < inputFields.length) {
            const field = inputFields[index];
            return (
              <animated.div
                key={field.name}
                style={props}
                className="flex flex-col"
              >
                <label
                  htmlFor={field.name}
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  {field.label}
                </label>
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={inputs[field.name]}
                  onChange={handleChange}
                  step={field.step}
                  className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-lima focus:border-lima"
                  required
                />
              </animated.div>
            );
          } else if (index === inputFields.length) {
            return (
              <animated.div
                key="priceIncrease"
                style={props}
                className="flex flex-col md:col-span-2"
              >
                <label
                  htmlFor="priceIncreaseScenario"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  Annual Price Increase:
                </label>
                <select
                  id="priceIncreaseScenario"
                  name="priceIncreaseScenario"
                  value={inputs.priceIncreaseScenario}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-lima focus:border-lima"
                >
                  {priceIncreaseOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </animated.div>
            );
          } else {
            return (
              <animated.div
                key="submit"
                style={props}
                className="md:col-span-2 mt-6"
              >
                <button
                  type="submit"
                  className="w-full bg-madison text-white p-3 rounded-md hover:bg-opacity-90 transition-colors text-lg font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Calculating..." : "Calculate"}
                </button>
              </animated.div>
            );
          }
        })}
      </div>
    </form>
  );
}

export default EnergyPlanForm;
