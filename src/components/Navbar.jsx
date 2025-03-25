import { useState, useEffect } from 'react';
import { ImProfile } from "react-icons/im";
// import { SiGnuprivacyguard } from 'react-icons/si';
import { NavLink } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { MdLogin, MdPersonAdd, MdLogout } from 'react-icons/md';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [dropdownOpen, setDropdownOpen] = useState(false);


  //Check login status from token
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(token ? true : false);
  }, []);

  //Handle logout+
  // const handleLogout = () => {
  //   localStorage.removeItem('auth-token');
  //   setIsLoggedIn(false);
  //   setDropdownOpen(false);
  // };

  return (
    <nav className=" absolute z-20 top-4 left-1/2 transform -translate-x-1/2 w-[90vw] max-w-[500px] bg-white/40 border-t border-b border-purple-200 backdrop-blur-md p-3 rounded shadow-lg flex justify-between items-center">

      {/* 🍔 Hamburger Menu for Small Screens */}
      <button
        className="md:hidden text-gray-800 hover:text-[#84bef0] transition duration-300"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* 🌐 Links for Large Screens */}
      <div className="hidden md:flex gap-6">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-lg font-semibold transition duration-300 ${isActive ? 'text-[#33008b]' : 'text-gray-800 hover:text-[#84bef0]'
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/paste"
          className={({ isActive }) =>
            `text-lg font-semibold transition duration-300 ${isActive ? 'text-[#33008b]' : 'text-gray-800 hover:text-[#84bef0]'
            }`
          }
        >
          Paste
        </NavLink>
      </div>

      {/* 📱 Animated Links for Small Screens */}
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
                `text-lg font-semibold transition duration-300 ${isActive ? 'text-[#33008b]' : 'text-gray-800 hover:text-[#84bef0]'
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/paste"
              className={({ isActive }) =>
                `text-lg font-semibold transition duration-300 ${isActive ? 'text-[#33008b]' : 'text-gray-800 hover:text-[#84bef0]'
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              Paste
            </NavLink>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 👤 Profile OR Login/Signup */}
      <div className="relative ">
        {isLoggedIn ? (
          //If logged in, show Profile dropdown
          <div>

            <NavLink
              to="/profile"
              className="text-lg text-gray-800 hover:text-[#84bef0] transition duration-300 flex items-center gap-1"
            >
              <ImProfile size={24} />
            </NavLink>

            {/* <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center cursor-pointer gap-2 text-gray-800 hover:text-[#84bef0] transition duration-300"
            > */}
            {/* </button> */}

            {/* <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 15 }}
                  className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg overflow-hidden"
                >
                  <NavLink
                    to="/profile"
                    className="block px-4 py-2 cursor-pointer text-gray-800 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 cursor-pointer text-gray-800 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <MdLogout size={20} />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence> */}
          </div>
        ) : (
          //If NOT logged in, show Login and Signup
          <div className="flex gap-3">
            <NavLink
              to="/login"
              className="text-lg text-gray-800 hover:text-[#84bef0] transition duration-300 flex items-center gap-1"
            >
              <MdLogin size={20} />
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className="text-lg text-gray-800 hover:text-[#84bef0] transition duration-300 flex items-center gap-1"
            >
              <MdPersonAdd size={20} />
              Signup
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
