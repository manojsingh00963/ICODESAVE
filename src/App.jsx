import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, StartAnimate, SmoothCursor } from './components';
import { ToastContainer } from 'react-toastify';

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
    <div className="min-h-screen bg-[#05070e] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/40 selection:text-white">
      {/* High performance ultra-smooth responsive cursor */}
      <SmoothCursor />

      {showAnimation ? (
        <StartAnimate onFinish={handleFinishAnimation} />
      ) : (
        <div className="min-h-screen w-full flex flex-col relative overflow-hidden bg-gradient-to-b from-[#05070e] via-[#090d1f] to-[#05070e]">
          {/* Subtle Ambient Background Gradients */}
          <div className="fixed top-[-10%] left-[-10%] w-[35vw] h-[35vw] bg-indigo-600/10 blur-[130px] pointer-events-none" />
          <div className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-cyan-600/10 blur-[140px] pointer-events-none" />

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
