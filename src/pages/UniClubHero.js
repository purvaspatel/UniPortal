import React from 'react';
import heroimg from '../assets/pdeuhero2_edge.png';

const UniClubHero = () => {

  return (
  <div className="text-center  pl-12 pr-12 ">
        <section className="relative min-h-screen flex items-center justify-center">
    <div
        className="absolute inset-0 bg-cover bg-center opacity-35 z-0" // Adjust opacity here
        style={{
          backgroundImage: `url(${heroimg})`,
        }}
      ></div>
      
      <div className="relative z-10 text-center text-black">
        <h1 className="text-6xl font-bold">
          We are working on this...
        </h1>
        
        
        
      </div>
    </section>
  </div>
  );
};

export default UniClubHero;
