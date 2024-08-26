// src/components/CostComparisonChart.jsx
import React, { useRef, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import Chart from "chart.js/auto";
import "chartjs-plugin-datalabels";
import { motion } from "framer-motion"; // Import motion

function CostComparisonChart({ data }) {
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
      type: "line",
      data: {
        labels: data.currentPlanCosts.map((_, index) => `Year ${index + 1}`),
        datasets: [
          {
            label: "Current Plan",
            data: data.currentPlanCosts,
            borderColor: "#0b3069",
            tension: 0.4,
            datalabels: {
              display: false,
            },
          },
          {
            label: "Energy Savers Plan",
            data: data.energySaversCosts,
            borderColor: "#87ba14",
            tension: 0.4,
            datalabels: {
              display: true,
              formatter: (value, context) => {
                const planIndex = context.dataIndex;
                const savings =
                  data.currentPlanCosts[planIndex] -
                  data.energySaversCosts[planIndex];
                const percentSavings = (
                  (savings / data.currentPlanCosts[planIndex]) *
                  100
                ).toFixed(2);
                return `${percentSavings}%`;
              },
              color: "green",
              anchor: "end",
              align: "top",
              font: {
                weight: "bold",
              },
            },
          },
          {
            label: "Free Weekends Plan",
            data: data.freeWeekendsCosts,
            borderColor: "#586c8e",
            tension: 0.4,
            datalabels: {
              display: true,
              formatter: (value, context) => {
                const planIndex = context.dataIndex;
                const savings =
                  data.currentPlanCosts[planIndex] -
                  data.freeWeekendsCosts[planIndex];
                const percentSavings = (
                  (savings / data.currentPlanCosts[planIndex]) *
                  100
                ).toFixed(2);
                return `${percentSavings}%`;
              },
              color: "green",
              anchor: "end",
              align: "top",
              font: {
                weight: "bold",
              },
            },
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Prevents chart from being squeezed
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
            text: "Total Cost Comparison Over Time",
            font: {
              size: 16,
              weight: "bold",
            },
          },
          datalabels: {
            // Configuration options for datalabels plugin
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Cost ($)",
            },
            ticks: {
              // Format y-axis tick labels as currency
              callback: function (value, index, values) {
                return "$" + value.toFixed(2);
              },
              stepSize: 500,
            },
          },
          x: {
            title: {
              display: true,
              text: "Year",
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
    <motion.div // Use motion.div for the animation
      style={animationProps}
      className="chart-container"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <animated.canvas
        ref={canvasRef}
        style={{ maxHeight: "300px", maxWidth: "100%" }}
      />
    </motion.div>
  );
}

export default CostComparisonChart;
