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
  AreaChart,
  Area,
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
    number: results.potentialSavings,
    from: { number: 0 },
    config: config.molasses,
  });

  const breakEvenAnimation = useSpring({
    number: results.breakEvenPoint,
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
      cost: results.currentPlanTotalCost,
      fill: COLORS.red,
    },
    {
      name: "Energy Savers",
      cost: results.energySaversTotalCost,
      fill: COLORS.lima,
    },
    {
      name: "Free Weekends",
      cost: results.freeWeekendsTotalCost,
      fill: COLORS.waikawaGray,
    },
  ];

  const savingsOverTimeData = results.chartData.years.map((year, index) => ({
    year,
    currentPlan: results.chartData.currentPlanCosts[index],
    energySavers: results.chartData.energySaversCosts[index],
    freeWeekends: results.chartData.freeWeekendsCosts[index],
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
      <h3
        className="text-3xl font-bold mb-6 text-center"
        style={{ color: COLORS.madison }}
      >
        Your Energy Plan Comparison Results
      </h3>

      <div
        className="bg-lightLima border-l-4 p-6 mb-8 rounded-lg"
        style={{ borderColor: COLORS.lima }}
      >
        <h4
          className="text-2xl font-semibold mb-2"
          style={{ color: COLORS.madison }}
        >
          Potential Savings
        </h4>
        <animated.p
          className="font-bold text-5xl"
          style={{ color: COLORS.lima }}
        >
          {savingsAnimation.number.to((val) => formatCurrency(val))}
        </animated.p>
        <p
          className="font-bold text-xl mt-2"
          style={{ color: COLORS.waikawaGray }}
        >
          over {results.inputs.contractLength} years!
        </p>
      </div>

      <div
        className="bg-lightLima border-l-4 p-6 mb-8 rounded-lg"
        style={{ borderColor: COLORS.madison }}
      >
        <h4
          className="text-2xl font-semibold mb-2"
          style={{ color: COLORS.madison }}
        >
          Break-Even Point
        </h4>
        <animated.p
          className="font-bold text-5xl"
          style={{ color: COLORS.madison }}
        >
          {breakEvenAnimation.number.to((val) => Math.round(val))}
        </animated.p>
        <p
          className="font-bold text-xl mt-2"
          style={{ color: COLORS.waikawaGray }}
        >
          months until you start saving!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {totalCostData.map((plan) => (
          <div key={plan.name} className="bg-white p-6 rounded-lg shadow-md">
            <h4
              className="text-xl font-semibold mb-2"
              style={{ color: COLORS.madison }}
            >
              {plan.name}
            </h4>
            <p className="text-3xl font-bold" style={{ color: plan.fill }}>
              {formatCurrency(plan.cost)}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h4
          className="text-2xl font-semibold mb-4"
          style={{ color: COLORS.madison }}
        >
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
        <h4
          className="text-2xl font-semibold mb-4"
          style={{ color: COLORS.madison }}
        >
          Savings Over Time
        </h4>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={savingsOverTimeData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.waikawaGray} />
            <XAxis
              dataKey="year"
              tick={{ fill: COLORS.madison, fontSize: 14 }}
            />
            <YAxis
              tickFormatter={formatCurrency}
              tick={{ fill: COLORS.madison, fontSize: 14 }}
            />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="currentPlan"
              stackId="1"
              stroke={COLORS.red}
              fill={COLORS.red}
            />
            <Area
              type="monotone"
              dataKey="energySavers"
              stackId="1"
              stroke={COLORS.lima}
              fill={COLORS.lima}
            />
            <Area
              type="monotone"
              dataKey="freeWeekends"
              stackId="1"
              stroke={COLORS.waikawaGray}
              fill={COLORS.waikawaGray}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="text-center p-6 bg-lightLima rounded-lg">
        <p className="text-3xl font-bold" style={{ color: COLORS.madison }}>
          {results.recommendedChoice}
        </p>
      </div>

      {showConfetti && (
        <Confetti
          colors={[COLORS.madison, COLORS.lima, COLORS.waikawaGray]}
          isVisible={true}
        />
      )}
    </animated.div>
  );
}

export default ResultsDisplay;
