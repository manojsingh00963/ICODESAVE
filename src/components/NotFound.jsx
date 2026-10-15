import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiCode } from 'react-icons/fi';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex items-center justify-center px-4 py-16"
    >
      <div className="glass-panel rounded-2xl p-8 sm:p-12 max-w-md w-full text-center border border-indigo-500/20 shadow-2xl bg-slate-950/80">
        <div className="w-16 h-16 rounded-2xl bg-indigo-950/80 border border-indigo-700/50 text-indigo-400 flex items-center justify-center text-3xl mx-auto mb-4">
          <FiCode />
        </div>

        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 tracking-tight mb-2">
          404
        </h1>
        <h2 className="text-lg font-bold text-white mb-2">Page Not Found</h2>
        <p className="text-xs sm:text-sm text-slate-400 mb-6">
          The code snippet or page you are looking for does not exist or has been relocated.
        </p>

        <NavLink
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition"
        >
          <FiHome className="text-base" />
          <span>Return to Dashboard</span>
        </NavLink>
      </div>
    </motion.div>
  );
};

export default NotFound;