import React from 'react';
import { SiGnuprivacyguard } from 'react-icons/si';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[90vw] max-w-[500px] bg-white/30 backdrop-blur-md p-3 rounded-lg shadow-lg flex justify-between items-center">
      <div className="flex gap-6">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `text-lg font-semibold transition duration-300 ${
              isActive ? 'text-blue-500' : 'text-gray-800 hover:text-blue-400'
            }`
          }
        >
          Home
        </NavLink>
        <NavLink 
          to="/paste" 
          className={({ isActive }) => 
            `text-lg font-semibold transition duration-300 ${
              isActive ? 'text-blue-500' : 'text-gray-800 hover:text-blue-400'
            }`
          }
        >
          Paste
        </NavLink>
      </div>
      
      <NavLink to="/" className="text-lg text-gray-800 hover:text-blue-400 transition duration-300">
        <SiGnuprivacyguard size={24} />
      </NavLink>
    </nav>
  );
};

export default Navbar;
