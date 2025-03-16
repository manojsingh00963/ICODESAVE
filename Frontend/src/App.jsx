import React, { useEffect, useState, } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, StartAnimate } from './components';
import { ToastContainer } from 'react-toastify';
// import { SplashCursor } from './components/Animation';

function App() {

  const [showAnimation, setShowAnimation] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 0);
    return () => {
      clearTimeout(timer)
    }
  }, []);



  return (
    <div className="showAnimation">
      {/* <SplashCursor/> */}
      {showAnimation ? <StartAnimate /> : <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#000054e4] to-[#c290fbd8] text-white relative">
        {/* Toast Notifications */}
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick={true}
          pauseOnFocusLoss={false}
          draggable={true}
          pauseOnHover={true}
          theme="light"
        />
        <Navbar />
        <Outlet />
      </div>}
    </div>
  );
};

export default App;
