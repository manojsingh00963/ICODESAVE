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
      <div
        className="glass-panel p-8 sm:p-12 max-w-md w-full text-center border border-indigo-500/20 shadow-2xl bg-slate-950/90 relative"
        style={{ borderRadius: 0 }}
      >
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500" />

        <div
          className="w-16 h-16 bg-indigo-950/80 border border-indigo-700/50 text-cyan-400 flex items-center justify-center text-3xl mx-auto mb-4"
          style={{ borderRadius: 0 }}
        >
          <FiCode />
        </div>

        <h1 className="text-6xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 tracking-tight mb-2">
          404
        </h1>
        <h2 className="text-lg font-mono font-bold text-white mb-2 uppercase tracking-wider">Page Not Found</h2>
        <p className="text-xs sm:text-sm font-mono text-slate-400 mb-6">
          The code snippet or page you are looking for does not exist or has been relocated.
        </p>

        <NavLink
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg shadow-indigo-600/30 border border-cyan-400/40 transition"
          style={{ borderRadius: 0 }}
        >
          <FiHome className="text-base" />
          <span>Return to Dashboard</span>
        </NavLink>
      </div>
    </motion.div>
  );
};

export default NotFound;