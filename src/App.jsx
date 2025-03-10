import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './components';
import { ToastContainer } from 'react-toastify';

const App = () => (
  <div className="min-h-screen w-full flex flex-col bg-gray-900 text-white relative">
    {/* Toast Notifications */}
    <ToastContainer
      position="top-center"
      autoClose={3000}
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
  </div>
);

export default App;
