import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, StartAnimate } from './components';
import { ToastContainer } from 'react-toastify';
import AnimatedCursor from 'react-animated-cursor';

function App() {
  // Only show intro splash once per browser session
  const [showAnimation, setShowAnimation] = useState(() => {
    return !sessionStorage.getItem('hasSeenSplash');
  });

  const handleFinishAnimation = () => {
    setShowAnimation(false);
    sessionStorage.setItem('hasSeenSplash', 'true');
  };

  useEffect(() => {
    if (showAnimation) {
      const timer = setTimeout(() => {
        handleFinishAnimation();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [showAnimation]);

  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Animated Cursor for non-touch devices */}
      <div className="hidden md:block">
        <AnimatedCursor
          innerSize={8}
          outerSize={24}
          color="99, 102, 241"
          outerAlpha={0.25}
          innerScale={0.8}
          outerScale={2}
          clickables={[
            'a',
            'input[type="text"]',
            'input[type="email"]',
            'input[type="password"]',
            'input[type="number"]',
            'input[type="submit"]',
            'select',
            'textarea',
            'button',
            '.cursor-pointer',
          ]}
        />
      </div>

      {showAnimation ? (
        <StartAnimate onFinish={handleFinishAnimation} />
      ) : (
        <div className="min-h-screen w-full flex flex-col relative overflow-hidden bg-gradient-to-br from-[#060814] via-[#0b1029] to-[#070b1c]">
          {/* Subtle Ambient Background Glows */}
          <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
          <div className="fixed bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-purple-600/10 blur-[130px] pointer-events-none" />

          {/* Toast Notifications */}
          <ToastContainer
            stacked
            position="top-center"
            autoClose={2200}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick={true}
            pauseOnFocusLoss={false}
            draggable={true}
            pauseOnHover={true}
            theme="dark"
          />

          <Navbar />
          <main className="flex-1 w-full flex flex-col">
            <Outlet />
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
