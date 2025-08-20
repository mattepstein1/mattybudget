import React from "react";

const NUM_PARTICLES = 80;

const ParticleBackground: React.FC = () => (
  <div className="particle-bg">
    {Array.from({ length: NUM_PARTICLES }).map((_, i) => {
      const size = Math.random() * 8 + 4; // 4px to 12px
      const left = Math.random() * 100; // vw
      const delay = Math.random() * 30; // seconds
      return (
        <div
          key={i}
          className="particle"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}vw`,
            top: "0",
            animationDelay: `${delay}s`
          }}
        />
      );
    })}
  </div>
);

export default ParticleBackground;
