import React from 'react';
import { SiGnuprivacyguard } from 'react-icons/si';
import { NavLink } from 'react-router-dom';
const Navbar = () => {
  return (
    <div className="navbar mx-auto ">

    <div className=" drop-shadow-xs shadow-blue-300 mx-auto fixed top-4 left-50 right-50 max-w-[40vw]  bg-opacity-30 backdrop-blur-md p-4 rounded-lg shadow-lg flex flex-row gap-4 place-content-evenly">
      <NavLink 
        to="/" 
        className={({ isActive }) => 
          `text-lg font-semibold ${isActive ? 'text-blue-500' : 'text-gray-800'} hover:text-blue-400 transition duration-300`
      }
      >
        Home
      </NavLink>
      <NavLink 
        to="/paste" 
        className={({ isActive }) => 
          `text-lg font-semibold ${isActive ? 'text-blue-500' : 'text-gray-800'} hover:text-blue-400 transition duration-300`
        }
      >
        Paste
      </NavLink>
    <div className=" auth flex place-items-center ">
      {/* <button className="text-lg font-semibold text-gray-800 hover:text-blue-400 transition duration-300">Sign In</button> */}
      <NavLink to={"/"} className="text-lg font-semibold text-gray-800 hover:text-blue-400 transition duration-300">
      <SiGnuprivacyguard />
      </NavLink>
    </div>
    </div>
  </div>
  );
}

export default Navbar;