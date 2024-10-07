import React, { useEffect, useState } from 'react';
import './TypingEffect.css'; // Custom CSS

const AnimatedText = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const words = ['By', 'For', 'Of'];

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2000); // Change word every 2 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="mt-4 text-xl relative">
      <p className="inline-block ">
        {/* Animated words */}
        {words.map((word, index) => (
          <span key={index} className={`fade-text ${wordIndex === index ? 'fade-in' : 'fade-out'} mr-4`}>
            {word}
          </span>
        ))}
        <span className="static-text"> the Students</span>
      </p>
    </div>
  );
};

export default AnimatedText;
