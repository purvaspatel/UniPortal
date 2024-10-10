import React from "react";
import { Link } from "react-router-dom";
import HeroSection from './HeroSection';
import FeaturesSection from "./FeatureSection";

function LandingPage() {
  return (
    
    <div className="text-center  pl-12 pr-12 ">
      <HeroSection/>
      <FeaturesSection/>
      <h1 className="text-4xl font-bold">Welcome to the University Portal</h1>
      <p className="mt-4">Navigate to the sections using the links below:</p>
      <div className="mt-4 space-x-4">
        <Link
          to="/teacher-registration"
          className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
        >
          Teacher Registration
        </Link>
        <Link
          to="/teacher-login"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
        >
          Teacher Login
        </Link>
        <Link
          to="/teacher-list"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
        >
          Browse Teachers
        </Link>
      </div>
      
    </div>
  );
}

export default LandingPage;
