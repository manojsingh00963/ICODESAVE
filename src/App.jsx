import React from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Home, Navbar, Paste, ViewPaste } from './components';

// Layout component to render Navbar and Outlet
const Layout = () => (
  <>
    <Navbar />
    <Outlet /> 
  </>
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
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;