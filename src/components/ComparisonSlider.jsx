import React, { useState } from "react";
import { useSpring, animated } from "react-spring";

const COLORS = {
  madison: "#0b3069",
  lima: "#87ba14",
  waikawaGray: "#586c8e",
  lightLima: "#e6f0d9",
  willowBrook: "#eef4e9",
};

function ComparisonSlider({ currentPlanCost, newPlanCost, planName }) {
  const [sliderPosition, setSliderPosition] = useState(50);

  const currentWidth = useSpring({ width: `${sliderPosition}%` });
  const newWidth = useSpring({ width: `${100 - sliderPosition}%` });

  const formatCurrency = (value) => `$${value.toFixed(2)}`;

  const handleSliderChange = (e) => {
    setSliderPosition(e.target.value);
  };

  return (
    <div className="mb-8 bg-willowBrook p-4 rounded-lg">
      <h4
        className="text-xl font-semibold mb-4"
        style={{ color: COLORS.madison }}
      >
        Cost Comparison: Current Plan vs {planName}
      </h4>
      <div className="relative h-20 mb-4">
        <animated.div
          style={{
            ...currentWidth,
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            backgroundColor: COLORS.madison,
          }}
        >
          <span className="absolute inset-0 flex items-center justify-center text-white font-bold">
            Current Plan: {formatCurrency(currentPlanCost)}
          </span>
        </animated.div>
        <animated.div
          style={{
            ...newWidth,
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: COLORS.lima,
          }}
        >
          <span className="absolute inset-0 flex items-center justify-center text-white font-bold">
            {planName}: {formatCurrency(newPlanCost)}
          </span>
        </animated.div>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={handleSliderChange}
        className="w-full"
      />
      <p className="text-center mt-2" style={{ color: COLORS.waikawaGray }}>
        Slide to compare costs
      </p>
    </div>
  );
}

export default ComparisonSlider;
