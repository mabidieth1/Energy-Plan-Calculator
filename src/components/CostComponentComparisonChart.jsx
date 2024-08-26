// src/components/CostComponentComparisonChart.jsx
import React, { useRef, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import Chart from "chart.js/auto";

function CostComponentComparisonChart({ data, inputs }) {
  const canvasRef = useRef(null);
  const chartInstance = useRef(null);

  const animationProps = useSpring({
    opacity: 1,
    transform: "translateX(0px)",
    from: { opacity: 0, transform: "translateX(-50px)" },
    delay: 300,
  });

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Base Rate", "Usage Charge", "TDU Charge", "Min. Usage Fee"],
        datasets: [
          {
            label: "Current Plan",
            data: [
              inputs.baseRate * inputs.monthlyUsage,
              inputs.usageCharge * inputs.monthlyUsage,
              inputs.TDUCharge,
              inputs.minUsageFee,
            ],
            backgroundColor: "#0b3069",
            borderRadius: 5,
            barPercentage: 0.6,
          },
          {
            label: "Energy Savers",
            data: [
              inputs.baseRate * 0.95 * inputs.monthlyUsage,
              inputs.usageCharge * inputs.monthlyUsage,
              inputs.TDUCharge,
              inputs.minUsageFee,
            ],
            backgroundColor: "#87ba14",
            borderRadius: 5,
            barPercentage: 0.6,
          },
          {
            label: "Free Weekends",
            data: [
              inputs.baseRate * 0.98 * (0.7 * inputs.monthlyUsage),
              inputs.usageCharge * inputs.monthlyUsage,
              inputs.TDUCharge,
              inputs.minUsageFee,
            ],
            backgroundColor: "#586c8e",
            borderRadius: 5,
            barPercentage: 0.6,
          },
        ],
      },
      options: {
        responsive: true,
        animation: {
          duration: 2000,
          easing: "easeOutQuart",
        },
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Cost Component Breakdown",
            font: {
              size: 16,
              weight: "bold",
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Monthly Cost ($)",
            },
            ticks: {
              callback: function (value, index, values) {
                return "$" + value.toFixed(2);
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, inputs]);

  return (
    <animated.div style={animationProps} className="chart-container">
      <canvas
        ref={canvasRef}
        style={{ maxHeight: "350px", maxWidth: "100%" }}
      />
    </animated.div>
  );
}

export default CostComponentComparisonChart;
