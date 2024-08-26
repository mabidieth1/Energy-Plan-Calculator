// src/components/TotalCostBarChart.jsx
import React, { useRef, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import Chart from "chart.js/auto";

function TotalCostBarChart({ data }) {
  const canvasRef = useRef(null);
  const chartInstance = useRef(null);

  const animationProps = useSpring({
    opacity: 1,
    transform: "translateY(0px)",
    from: { opacity: 0, transform: "translateY(50px)" },
  });

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Current Plan", "Energy Savers", "Free Weekends"],
        datasets: [
          {
            label: "Total Cost over Contract",
            data: [
              data.currentPlanCosts.reduce((sum, val) => sum + val, 0),
              data.energySaversCosts.reduce((sum, val) => sum + val, 0),
              data.freeWeekendsCosts.reduce((sum, val) => sum + val, 0),
            ],
            backgroundColor: ["#0b3069", "#87ba14", "#586c8e"],
            borderWidth: 1,
            borderRadius: 5, // Added rounded corners to bars
            barPercentage: 0.6, // Adjust bar width
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
            display: false,
          },
          title: {
            display: true,
            text: "Total Plan Cost Comparison",
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
              text: "Total Cost ($)",
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
  }, [data]);

  return (
    <animated.div style={animationProps} className="chart-container">
      <canvas
        ref={canvasRef}
        style={{ maxHeight: "300px", maxWidth: "100%" }}
      />
    </animated.div>
  );
}

export default TotalCostBarChart;
