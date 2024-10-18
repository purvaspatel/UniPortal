import React from "react";
import HeroSection from './HeroSection';
import FeaturesSection from "./FeatureSection";

function LandingPage() {
  return (
    
    <div className="text-center  pl-12 pr-12 ">
      <HeroSection/>
      <FeaturesSection/>      
    </div>
  );
}

export default LandingPage;
