import React from 'react';
import heroimg from '../assets/pdeuhero2_edge.png';

const HeroSection = () => {

  return (
    
    <section className="relative min-h-screen flex items-center justify-center">
    <div
        className="absolute inset-0 bg-cover bg-center opacity-35 z-0" // Adjust opacity here
        style={{
          backgroundImage: `url(${heroimg})`,
        }}
      ></div>
      
      <div className="relative z-10 text-center text-black">
        <h1 className="text-6xl font-bold">
          Student Portal @PDEU
        </h1>
        <p className="mt-4 text-xl">
          By the Students, For the Students, Of the Students
        </p>
        
        <button
          className="mt-8 px-6 py-3 bg-white text-purple-500 font-bold rounded-lg shadow-lg hover:bg-purple-500 hover:text-white transition duration-300"
          onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
        >
          Get Started
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
