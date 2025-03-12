/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { SiGnuprivacyguard } from 'react-icons/si';
import { NavLink } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed z-20 top-4 left-1/2 transform -translate-x-1/2 w-[90vw] max-w-[500px] bg-white/40 border-t border-b border-purple-200 backdrop-blur-md p-3 rounded shadow-lg flex justify-between items-center">
      
      {/* Hamburger Menu for Small Screens */}
      <button 
        className="md:hidden text-gray-800 hover:text-[#84bef0] transition duration-300" 
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Links */}
      <div className="hidden md:flex gap-6">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `text-lg font-semibold transition duration-300 ${
              isActive ? 'text-[#33008b]' : 'text-gray-800 hover:text-[#84bef0]'
            }`
          }
        >
          Home
        </NavLink>
        <NavLink 
          to="/paste" 
          className={({ isActive }) => 
            `text-lg font-semibold transition duration-300 ${
              isActive ? 'text-[#33008b]' : 'text-gray-800 hover:text-[#84bef0]'
            }`
          }
        >
          Paste
        </NavLink>
      </div>

      {/* Animated Links for Small Screens */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
            className="z-10 absolute md:hidden top-14 left-1/2 transform -translate-x-1/2 w-[80vw] bg-white/50 backdrop-blur-md rounded-lg shadow-md flex flex-col gap-6 p-4"
          >
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `text-lg font-semibold transition duration-300 ${
                  isActive ? 'text-[#33008b]' : 'text-gray-800 hover:text-[#84bef0]'
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
                  isActive ? 'text-[#33008b]' : 'text-gray-800 hover:text-[#84bef0]'
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              Paste
            </NavLink>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo/Icon */}
      <NavLink to="/auth" className="text-lg text-gray-800 hover:text-[#84bef0] transition duration-300">
        <SiGnuprivacyguard size={24} />
      </NavLink>
    </nav>
  );
};

export default Navbar;
