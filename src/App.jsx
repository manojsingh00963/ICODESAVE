import React from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Home, Login, Navbar, Paste, SignUp, ViewPaste } from './components';

// Layout component with a black glass effect
const Layout = () => (
  <div className="min-h-screen flex flex-col bg-[#0d0d0d] text-white relative">
    {/* Black Mirror Glass Effect */}
    <div className="absolute inset-0 bg-black/30 backdrop-blur-2xl shadow-[0px_0px_30px_rgba(255,255,255,0.05)] rounded-lg" />

    <Navbar />
    <Outlet />
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'paste', element: <Paste /> },
      { path: 'paste/:pasteId', element: <Home /> },
      { path: 'view/:pasteId', element: <ViewPaste /> },
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <SignUp /> },
    ],
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
