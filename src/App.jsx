import React, { useEffect, useState, } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, StartAnimate } from './components';
import { ToastContainer } from 'react-toastify';
// import { SplashCursor } from './components/Animation';
// import { CircleCursor } from 'react-cursors'
import AnimatedCursor from 'react-animated-cursor';

function App() {

  const [showAnimation, setShowAnimation] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 5 * 1000);
    return () => {
      clearTimeout(timer)
    }
  }, []);



  return (
    <div className="showAnimation">
      {/* <SplashCursor/> */}
      <AnimatedCursor
        AnimatedCursor
        innerSize={8}
        outerSize={8}
        color='38, 126, 242'
        outerAlpha={0.2}
        innerScale={0.7}
        outerScale={5}
        clickables={[
          'a',
          'input[type="text"]',
          'input[type="email"]',
          'input[type="number"]',
          'input[type="submit"]',
          'input[type="image"]',
          'label[for]',
          'select',
          'textarea',
          'button',
          '.link',
          {
            target: '.custom',
            options: {
              innerSize: 12,
              outerSize: 12,
              color: '38, 126, 242',
              outerAlpha: 0.3,
              innerScale: 0.7,
              outerScale: 5
            }
          }
        ]}
      />

      {/* <CircleCursor 
        safeBoundaryX="1000"
        safeBoundaryY="700"
        initial={{
                dotSize:"2rem",
                circleSize:"5rem",
                borderStyle:"dotted",
                color:"white",
                borderWidth:"3px",
                circleDay:"0.1s",
                dotDelay:"0.05s"
        }}

        hover={{
                dotSize:"0rem",
                circleSize:"10rem",
                borderStyle:"dotted",
                color:"white",
                borderWidth:"3px",
                circleDay:"0.1s",
                dotDelay:"0.05s"
        }}
/> */}

      {showAnimation ? <StartAnimate /> : <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#000054e4] to-[#c290fbd8] text-white relative">
        {/* Toast Notifications */}
        <ToastContainer
          stacked
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick={true}
          pauseOnFocusLoss={false}
          draggable={true}
          pauseOnHover={true}
          theme="dark"
        />
        <Navbar />
        <Outlet />
      </div>}
    </div>
  );
};

export default App;
