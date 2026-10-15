import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { FadeContent, SplitText } from './Animation';
import rocket from '../assets/rocket.gif';

function StartAnimate({ onFinish }) {
  const [showRocket, setShowRocket] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRocket(true);
    }, 1500);

    const endTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 3500);

    return () => {
      clearTimeout(timer);
      clearTimeout(endTimer);
    };
  }, [onFinish]);

  return (
    <FadeContent blur={true} duration={800} easing="ease-out" initialOpacity={0}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="h-screen w-full flex flex-col justify-center items-center bg-gradient-to-b from-[#060814] via-[#0d122b] to-[#150d2e] text-white relative overflow-hidden"
      >
        {/* Skip button for quick navigation */}
        <button
          type="button"
          onClick={onFinish}
          className="absolute top-6 right-6 z-30 font-mono text-xs tracking-wider uppercase px-4 py-2 border border-indigo-500/40 bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 hover:text-white transition duration-200 cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.2)]"
          style={{ borderRadius: 0 }}
        >
          Skip Intro &rarr;
        </button>

        <div className="z-10 text-center px-4">
          <span
            className="inline-block text-xs uppercase tracking-widest text-indigo-400 font-mono font-semibold px-3 py-1 bg-indigo-950/80 border border-indigo-700/60 mb-4"
            style={{ borderRadius: 0 }}
          >
            Cloud Code Vault
          </span>
          <SplitText
            text="Welcome to ICODESAVE"
            className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 text-center tracking-tight"
            delay={60}
            animationFrom={{ opacity: 0, transform: 'translate3d(0,30px,0)' }}
            animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
            easing="easeOutCubic"
          />
          <p className="mt-3 text-sm md:text-base text-slate-400 max-w-md mx-auto">
            Your personal vault to save, organize, and share code snippets effortlessly.
          </p>
        </div>

        {/* Animated Rocket */}
        {showRocket && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: -900 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            className="absolute bottom-20 z-20 pointer-events-none"
          >
            <img
              src={rocket}
              alt="rocket"
              className="w-32 h-32 md:w-44 md:h-44 object-contain filter drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]"
            />
          </motion.div>
        )}
      </motion.div>
    </FadeContent>
  );
}

export default StartAnimate;
