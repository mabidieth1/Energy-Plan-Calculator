import React, { useState, useEffect, useCallback } from "react";
import { animated, useSpring, config } from "@react-spring/web";

const Confetti = ({ isVisible, colors }) => {
  const [pieces, setPieces] = useState([]);

  const springProps = useSpring({
    from: { opacity: 0 },
    to: { opacity: isVisible ? 1 : 0 },
    config: config.gentle,
    onRest: () => {
      if (!isVisible) setPieces([]);
    },
  });

  const generateConfetti = useCallback(() => {
    const newPieces = [];
    for (let i = 0; i < 200; i++) {
      newPieces.push({
        x: Math.random() * window.innerWidth,
        y: -Math.random() * window.innerHeight,
        size: Math.random() * 10 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        xVelocity: (Math.random() - 0.5) * 3,
        yVelocity: Math.random() * 3 + 1,
      });
    }
    setPieces(newPieces);
  }, [colors]);

  useEffect(() => {
    if (isVisible) {
      generateConfetti();
      const interval = setInterval(generateConfetti, 3000);
      return () => clearInterval(interval);
    }
  }, [isVisible, generateConfetti]);

  useEffect(() => {
    if (isVisible) {
      const animationFrame = requestAnimationFrame(function animate() {
        setPieces((pieces) =>
          pieces
            .map((piece) => ({
              ...piece,
              x: piece.x + piece.xVelocity,
              y: piece.y + piece.yVelocity,
              rotation: piece.rotation + 2,
            }))
            .filter((piece) => piece.y < window.innerHeight)
        );
        requestAnimationFrame(animate);
      });
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [isVisible]);

  return (
    <animated.div
      style={{
        ...springProps,
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      {pieces.map((piece, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: piece.x,
            top: piece.y,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: "50%",
            transform: `rotate(${piece.rotation}deg)`,
          }}
        />
      ))}
    </animated.div>
  );
};

export default Confetti;
