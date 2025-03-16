import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import store from './redux/store.js';
import App from './App.jsx';
import { Home, Login, Paste, SignUp, ViewPaste, Profile } from './components';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <ProtectedRoute><Home /></ProtectedRoute> }, // ✅ Protected Home Route
      { path: 'paste', element: <ProtectedRoute><Paste /></ProtectedRoute> }, // ✅ Protected Paste Route
      { path: 'paste/:pasteId', element: <ProtectedRoute><Home /></ProtectedRoute> }, // ✅ Protected Editing Note Route
      { path: 'view/:pasteId', element: <ProtectedRoute><ViewPaste /></ProtectedRoute> }, // ✅ Protected Viewing Note Route
      { path: 'profile', element: <ProtectedRoute><Profile /></ProtectedRoute> }, // ✅ Protected Profile Route
      { path: 'signup', element: <SignUp /> }, // ✅ Public Signup Route
      { path: 'login', element: <Login /> }, // ✅ Public Login Route
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
