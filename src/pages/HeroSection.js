import React from 'react';

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
      <div className="text-center text-white p-8">
        <h1 className="text-6xl font-bold">
          Welcome to Your University Portal
        </h1>
        <p className="mt-4 text-xl">
          Manage your cabins, clubs, and more in one place!
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
