import React, { useState } from 'react';
import { SiGnuprivacyguard } from 'react-icons/si';
import { NavLink } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed z-20 top-4 left-1/2 transform -translate-x-1/2 w-[90vw] max-w-[500px] bg-transparent bg-white/40 border-t border-b border-purple-200 backdrop-blur-md p-3 rounded shadow-lg flex justify-between items-center">
      
      {/* Hamburger Menu for Small Screens */}
      <button 
        className="md:hidden text-gray-800 hover:text-blue-400 transition duration-300" 
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Links */}
      <div className={`absolute md:relative top-14 md:top-auto left-1/2 md:left-auto transform md:transform-none -translate-x-1/2 md:translate-x-0 
        w-[90vw] md:w-auto bg-white/90 md:bg-transparent backdrop-blur-md md:backdrop-blur-none rounded-lg shadow-md md:shadow-none flex flex-col md:flex-row md:items-center gap-6 p-4 md:p-0 
        ${menuOpen ? "flex" : "hidden md:flex"}`}
      >
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `text-lg font-semibold transition duration-300 ${
              isActive ? 'text-blue-500' : 'text-gray-800 hover:text-blue-400'
            }`
          }
          onClick={() => setMenuOpen(false)}
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
          onClick={() => setMenuOpen(false)}
        >
          Paste
        </NavLink>
      </div>

      {/* Logo/Icon */}
      <NavLink to="/auth" className="text-lg text-gray-800 hover:text-blue-400 transition duration-300">
        <SiGnuprivacyguard size={24} />
      </NavLink>
    </nav>
  );
};

export default Navbar;
