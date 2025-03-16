import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { FadeContent, SplitText } from './Animation';
import rocket from '../assets/rocket.gif';

function StartAnimate() {
  const [showRocket, setShowRocket] = useState(false);

  useEffect(() => {
    // Set rocket to show after 1 second
    const timer = setTimeout(() => {
      setShowRocket(true);
    }, 3*1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="h-screen flex justify-center p-10 items-center bg-gradient-to-b from-[darkblue] to-gray-900 text-white text-3xl"
      >
        <SplitText
          text="Hello Welcome to IC0:-)DCOPY!"
          className="text-4xl font-semibold text-center"
          delay={100}
          animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
          animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
          easing="easeOutCubic"
          threshold={0.2}
          rootMargin="50px"
        />

        {/* Show and launch rocket */}
        {showRocket && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.img
              src={rocket}
              alt="rocket"
              drag
              dragConstraints={{ top: 0, left: -100, right: 100, bottom: 0 }}
              initial={{ scale: 0.3, y: 0 }}
              animate={{ y: -800 }} // Rocket will launch out of the screen
              transition={{ duration: 1.5, delay: 0.5, ease: "easeIn" }}
              className="w-40 h-40 absolute right-[15%] top-[35%] " // Smaller size
            />
          </motion.div>
        )}
      </motion.div>
    </FadeContent>
  );
}

export default StartAnimate;
