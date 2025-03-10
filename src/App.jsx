import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Home, Login, Navbar, Paste, SignUp, ViewPaste } from './components';
import { ToastContainer } from 'react-toastify';

// Layout component with a black glass effect
const Layout = () => (
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'paste', element: <Paste /> },
      { path: 'paste/:pasteId', element: <Home /> },
      { path: 'view/:pasteId', element: <ViewPaste /> },
      { path: 'login', element: <Login /> },  // Removed unnecessary leading '/'
      { path: 'signup', element: <SignUp /> }, // Removed unnecessary leading '/'
    ],
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
