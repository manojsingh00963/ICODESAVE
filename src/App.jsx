import React from 'react';
import './App.css'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Home, Login, Navbar, Paste, SignUp, ViewPaste } from './components';

// Layout component to render Navbar and Outlet
const Layout = () => (
    <div className=" pb-0 min-h-screen bg-gray-900 text-white flex flex-col"
    >
    <Navbar />
    <Outlet/>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true, // Render Home as the default child
        element: <Home />,
      },
      {
        path: 'paste',
        element: <Paste />,
      },
      {
        path: 'paste/:pasteId', // More descriptive dynamic route
        element: <Home />,
      },
      {
        path: 'view/:pasteId', // View specific paste
        element: <ViewPaste />,
      },
      {
        path: '/login', 
        element: <Login/>,
      },
      {
        path: '/signup',
        element: <SignUp/>,
      },
    ],
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;