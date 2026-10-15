import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiPlus, FiFolder, FiUser, FiLogOut, FiCode } from 'react-icons/fi';
import { MdLogin, MdPersonAdd } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { showConfirm } from '../redux/features/confirmSlice';
import { resetNotes } from '../redux/features/noteSlice';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Check login status and user info
  const checkAuth = () => {
    const token = localStorage.getItem('authToken');
    const valid = Boolean(token && token !== 'undefined' && token !== 'null');
    setIsLoggedIn(valid);

    if (valid) {
      try {
        const saved = localStorage.getItem('userData');
        if (saved) {
          const parsed = JSON.parse(saved);
          setUserName(parsed.name || '');
        }
      } catch {
        setUserName('');
      }
    } else {
      setUserName('');
    }
  };

  useEffect(() => {
    checkAuth();

    // Listen for custom login/logout events across components
    const handleAuthEvent = () => checkAuth();
    window.addEventListener('auth-change', handleAuthEvent);
    window.addEventListener('storage', handleAuthEvent);

    return () => {
      window.removeEventListener('auth-change', handleAuthEvent);
      window.removeEventListener('storage', handleAuthEvent);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(
      showConfirm({
        message: 'Are you sure you want to log out of ICODESAVE?',
        color: '#f43f5e',
        onConfirm: () => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          dispatch(resetNotes());
          setIsLoggedIn(false);
          window.dispatchEvent(new Event('auth-change'));
          toast.info('Logged out successfully');
          navigate('/login');
        },
      })
    );
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
        : 'text-slate-300 hover:text-white hover:bg-white/5'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full px-4 pt-3 pb-2 flex justify-center">
      <nav className="w-full max-w-5xl glass-panel rounded-2xl px-4 py-2.5 flex items-center justify-between shadow-2xl border border-indigo-500/20 bg-slate-950/70 backdrop-blur-xl">
        {/* Brand Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <FiCode className="text-xl" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-tight text-base sm:text-lg text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
              ICODESAVE
            </span>
            <span className="text-[10px] text-indigo-400/80 -mt-1 font-mono tracking-wider">
              CODE SNIPPETS
            </span>
          </div>
        </NavLink>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1.5">
          <NavLink to="/" className={navLinkClass}>
            <FiPlus className="text-base text-indigo-400" />
            <span>New Snippet</span>
          </NavLink>
          <NavLink to="/paste" className={navLinkClass}>
            <FiFolder className="text-base text-cyan-400" />
            <span>My Snippets</span>
          </NavLink>
        </div>

        {/* User Auth Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <NavLink
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-950/40 hover:bg-indigo-900/60 transition text-slate-200 text-sm font-medium"
                title="Profile Settings"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                  {userName ? userName.charAt(0) : <FiUser />}
                </div>
                <span className="hidden sm:inline max-w-[120px] truncate">
                  {userName || 'Profile'}
                </span>
              </NavLink>

              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition duration-200 cursor-pointer"
                title="Log Out"
                aria-label="Log Out"
              >
                <FiLogOut className="text-lg" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink
                to="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition"
              >
                <MdLogin className="text-lg text-indigo-400" />
                <span>Login</span>
              </NavLink>
              <NavLink
                to="/signup"
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg shadow-md shadow-indigo-600/30 transition duration-200"
              >
                <MdPersonAdd className="text-lg" />
                <span>Sign Up</span>
              </NavLink>
            </div>
          )}

          {/* Hamburger Menu Button (Mobile) */}
          <button
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-18 left-4 right-4 z-50 glass-panel rounded-2xl p-4 shadow-2xl border border-indigo-500/30 bg-slate-950/95 flex flex-col gap-2"
          >
            <NavLink to="/" className={navLinkClass}>
              <FiPlus className="text-base text-indigo-400" />
              <span>New Snippet</span>
            </NavLink>
            <NavLink to="/paste" className={navLinkClass}>
              <FiFolder className="text-base text-cyan-400" />
              <span>My Snippets</span>
            </NavLink>
            {isLoggedIn && (
              <NavLink to="/profile" className={navLinkClass}>
                <FiUser className="text-base text-purple-400" />
                <span>Profile Settings</span>
              </NavLink>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
