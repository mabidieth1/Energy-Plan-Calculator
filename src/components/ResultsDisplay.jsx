import React, { useState, useEffect } from "react";
import { useSpring, animated, config } from "react-spring";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import Confetti from "./Confetti";

const COLORS = {
  madison: "#0b3069",
  lima: "#87ba14",
  waikawaGray: "#586c8e",
  lightLima: "#e6f0d9",
  willowBrook: "#eef4e9",
  red: "#FF6B6B",
};

function ResultsDisplay({ results }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });

  const savingsAnimation = useSpring({
    number: results?.potentialSavings || 0,
    from: { number: 0 },
    config: config.molasses,
  });

  useEffect(() => {
    if (results) {
      setTimeout(() => setShowConfetti(true), 3000);
    }
  }, [results]);

  const formatCurrency = (value) => `$${value.toFixed(2)}`;

  const totalCostData = [
    {
      name: "Current Plan",
      cost: results?.currentPlanTotalCost || 0,
      fill: COLORS.red,
    },
    {
      name: "Energy Savers",
      cost: results?.energySaversTotalCost || 0,
      fill: COLORS.lima,
    },
    {
      name: "Free Weekends",
      cost: results?.freeWeekendsTotalCost || 0,
      fill: COLORS.waikawaGray,
    },
  ];

  const savingsOverTimeData = (results?.chartData || []).map((yearData) => ({
    year: `Year ${yearData.year}`,
    energySavers: parseFloat(yearData.energySavers.toFixed(2)),
    freeWeekends: parseFloat(yearData.freeWeekends.toFixed(2)),
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const currentPlan = payload.find(
        (p) => p.dataKey === "cost" && p.name === "Current Plan"
      );
      const alternativePlan = payload.find(
        (p) => p.dataKey === "cost" && p.name !== "Current Plan"
      );

      if (!currentPlan || !alternativePlan) {
        return null;
      }

      const savings = currentPlan.value - alternativePlan.value;

      return (
        <div className="bg-white p-4 border rounded shadow-lg">
          <p className="font-bold">{`${label}: ${formatCurrency(
            alternativePlan.value
          )}`}</p>
          <p className="text-green-600 font-bold text-lg">{`Savings: ${formatCurrency(
            savings
          )}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <animated.div
      style={fadeIn}
      className="bg-white rounded-lg shadow-lg p-6 mt-6"
    >
      <div className="mb-8 text-center">
        <p className="text-6xl font-bold text-madison">
          Unlock immediate savings of{" "}
          <span className="text-lima text-7xl">
            <strong>{formatCurrency(results.monthlySavings)}</strong>
          </span>{" "}
          each month! Switch to the{" "}
          <span className="text-lima text-7xl">{results.recommendedPlan}</span>{" "}
          plan today and start maximizing your savings instantly.
        </p>
      </div>

      <h3 className="text-5xl font-bold mb-6 text-center text-madison">
        Your Detailed Energy Plan Comparison Results
      </h3>

      <div className="bg-lightLima border-l-4 border-lima p-6 mb-8 rounded-lg">
        <h4 className="text-3xl font-semibold mb-2 text-madison">
          Potential Savings
        </h4>
        <animated.p className="font-bold text-6xl text-lima">
          {savingsAnimation.number.to(formatCurrency)}
        </animated.p>
        <p className="font-bold text-xl mt-2 text-waikawaGray">over 5 years!</p>
      </div>

      <div className="bg-lightLima border-l-4 border-lima p-6 mb-8 rounded-lg">
        <h4 className="text-2xl font-semibold mb-2 text-madison">
          Monthly Savings
        </h4>
        <p className="font-bold text-5xl text-lima">
          {formatCurrency(results.monthlySavings)}
        </p>
      </div>

      <div className="mb-4">
        <h4 className="text-2xl font-semibold text-madison">Current Plan</h4>
        <p className="text-3xl font-bold text-red">
          {formatCurrency(results?.currentPlanTotalCost || 0)}
        </p>
      </div>
      <div className="mb-4">
        <h4 className="text-2xl font-semibold text-madison">Energy Savers</h4>
        <p className="text-3xl font-bold text-lima">
          {formatCurrency(results?.energySaversTotalCost || 0)}
        </p>
      </div>
      <div className="mb-4">
        <h4 className="text-2xl font-semibold text-madison">Free Weekends</h4>
        <p className="text-3xl font-bold text-waikawaGray">
          {formatCurrency(results?.freeWeekendsTotalCost || 0)}
        </p>
      </div>

      <div className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h4 className="text-2xl font-semibold mb-4 text-madison">
          Total Cost Comparison
        </h4>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={totalCostData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.waikawaGray} />
            <XAxis
              dataKey="name"
              tick={{ fill: COLORS.madison, fontSize: 14 }}
            />
            <YAxis
              domain={[0, (results?.currentPlanTotalCost || 0) + 100]} // Adjusted YAxis domain
              tickFormatter={formatCurrency}
              tick={{ fill: COLORS.madison, fontSize: 14 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="cost" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h4 className="text-2xl font-semibold mb-4 text-madison">
          Savings Over Time
        </h4>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={savingsOverTimeData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.waikawaGray} />
            <XAxis
              dataKey="year"
              tick={{ fill: COLORS.madison, fontSize: 14 }}
            />
            <YAxis
              domain={[0, "dataMax + 200"]}
              tickFormatter={formatCurrency}
              tick={{ fill: COLORS.madison, fontSize: 14 }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="energySavers"
              stroke={COLORS.lima}
              fill={COLORS.lima}
            />
            <Line
              type="monotone"
              dataKey="freeWeekends"
              stroke={COLORS.waikawaGray}
              fill={COLORS.waikawaGray}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="text-center p-6 bg-lightLima rounded-lg">
        <p className="text-3xl font-bold text-madison">
          {results.recommendedPlan}
        </p>
      </div>

      {showConfetti && (
        <Confetti
          colors={[COLORS.madison, COLORS.lima, COLORS.waikawaGray]}
          isVisible={true}
        />
      )}

      {/* Texas Electricity Patterns Button */}
      <div className="mt-8 text-center">
        <button
          onClick={() =>
            window.open("/texas-electricity-patterns.html", "_blank")
          }
          className="py-2 px-4 bg-madison text-white rounded hover:bg-waikawaGray transition duration-300"
        >
          View Texas Electricity Consumption Patterns
        </button>
      </div>
    </animated.div>
  );
}

export default ResultsDisplay;
