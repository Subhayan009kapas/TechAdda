import React, { useEffect, useRef } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
  const circleRef = useRef(null);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="splash-container">
      <div 
        ref={circleRef}
        className="bouncing-circle"
      >
        <div className="text-container">
          {"TechAdda".split("").map((letter, index) => (
            <span
              key={index}
              className={`logo-letter ${index < 4 ? 'tech-part' : 'adda-part'}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>
      <div className="line-loader-container">
        <div className="line-loader"></div>
      </div>
    </div>
  );
};

export default SplashScreen;