import React, { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid'; // Heroicon for dropdown
import logo from '../assets/navlogo.png'; // Adjust the path as per your folder structure

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref for dropdown container

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [dropdownOpen]);

  return (
    <header className=" flex items-center justify-between pl-12 pr-12 py-4 bg-white border-b border-gray-400 sticky top-0">
      {/* Left Side: Logo and Text */}
      <div className="flex items-center space-x-4">
        <img src={logo} alt="Logo" className="h-12" /> {/* Adjust height/width */}
        <span className="font-bold text-xl">Student Uni Portal</span>
      </div>

      {/* Right Side: Links */}
      <nav className="flex items-center space-x-6">
        <a href="/" className="text-gray-600 hover:text-black">Home</a>
        
        {/* Dropdown for Explore */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)} 
            className="text-gray-600 hover:text-black flex items-center"
          >
            Explore
            <ChevronDownIcon className="h-5 w-5 ml-1" /> {/* Dropdown icon */}
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-400 shadow-lg">
              <a href="/teacher-list" className="block px-4 py-2 text-gray-600 border-b border-gray-400 hover:bg-gray-100">Teachers Sitting</a>
              <a href="/stories" className="block px-4 py-2 text-gray-600 border-b border-gray-400 hover:bg-gray-100">Uni Clubs</a>
              <a href="/authors" className="block px-4 py-2 text-gray-600 border-b border-gray-400 hover:bg-gray-100">FAQ's</a>
            </div>
          )}
        </div>

        <a href="/about" className="text-gray-600 hover:text-black">About Us</a>
      </nav>
    </header>
  );
};

export default Navbar;
