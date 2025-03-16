import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import store from './redux/Store.js';
import App from './App.jsx';
import { Home, Login, Paste, SignUp, ViewPaste, Profile } from './components';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'paste', element: <Paste /> },
      { path: 'paste/:pasteId', element: <Home /> }, // ✅ Fix for editing note by ID
      { path: 'view/:pasteId', element: <ViewPaste /> }, // ✅ Fix for viewing note by ID
      { path: 'Profile', element: <Profile /> }, // ✅ Profile page (if logged in)
      { path: 'signup', element: <SignUp /> }, // ✅ Signup page
      { path: 'login', element: <Login /> }, // ✅ Login page
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
