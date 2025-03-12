import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import store from './redux/Store.js';
import App from './App.jsx';
import { Home, Login, Paste, SignUp, ViewPaste, Auth } from './components';

// Define Router
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App as the layout component
    children: [
      { index: true, element: <Home /> },
      { path: 'paste', element: <Paste /> },
      { path: 'paste/:pasteId', element: <Home /> },
      { path: 'view/:pasteId', element: <ViewPaste /> },
      { path: 'login', element: <Login /> },
      {path: 'auth', element: <Auth/>,
        children: [
          { path: 'signup', element: <SignUp /> },
          { path: 'login', element: <Login/> },
        ]
      }
    ],
  },
]);

// Render App
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
