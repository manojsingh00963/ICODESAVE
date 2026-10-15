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
    `flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-mono uppercase tracking-wider font-semibold transition-all duration-150 border ${
      isActive
        ? 'bg-indigo-600/20 text-cyan-300 border-cyan-500/60 shadow-[0_0_15px_rgba(34,211,238,0.25)]'
        : 'text-slate-300 hover:text-white border-transparent hover:border-slate-700 hover:bg-slate-900/60'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full px-4 pt-3 pb-2 flex justify-center">
      <nav className="w-full max-w-5xl glass-panel px-4 py-2.5 flex items-center justify-between shadow-2xl border border-indigo-500/30 bg-slate-950/85">
        {/* Brand Logo - Sharp Geometric Box */}
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] group-hover:scale-105 transition-transform border border-cyan-400/50">
            <FiCode className="text-lg" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-tight text-base sm:text-lg text-white font-mono flex items-center gap-1">
              ICODESAVE<span className="text-cyan-400">_</span>
            </span>
            <span className="text-[9px] text-indigo-400 font-mono tracking-widest uppercase -mt-1">
              Cloud Vault
            </span>
          </div>
        </NavLink>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-2">
          <NavLink to="/" className={navLinkClass}>
            <FiPlus className="text-sm text-cyan-400" />
            <span>New Snippet</span>
          </NavLink>
          <NavLink to="/paste" className={navLinkClass}>
            <FiFolder className="text-sm text-indigo-400" />
            <span>Vault Snippets</span>
          </NavLink>
        </div>

        {/* User Auth Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <NavLink
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 border border-indigo-500/40 bg-slate-900 hover:bg-indigo-950/60 hover:border-cyan-400/60 transition text-slate-200 text-xs sm:text-sm font-mono"
                title="Profile Settings"
              >
                <div className="w-5 h-5 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white uppercase border border-indigo-400/40">
                  {userName ? userName.charAt(0) : <FiUser />}
                </div>
                <span className="hidden sm:inline max-w-[120px] truncate">
                  {userName || 'Profile'}
                </span>
              </NavLink>

              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-900/50 transition cursor-pointer"
                title="Log Out"
                aria-label="Log Out"
              >
                <FiLogOut className="text-base" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink
                to="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 hover:bg-white/5 transition"
              >
                <MdLogin className="text-sm text-cyan-400" />
                <span>Login</span>
              </NavLink>
              <NavLink
                to="/signup"
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 border border-indigo-400/40 shadow-[0_0_15px_rgba(99,102,241,0.3)] transition"
              >
                <MdPersonAdd className="text-sm" />
                <span>Sign Up</span>
              </NavLink>
            </div>
          )}

          {/* Hamburger Menu Button (Mobile) */}
          <button
            className="md:hidden p-1.5 text-slate-300 hover:text-white border border-slate-800 hover:bg-white/10 transition cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer - Sharp Geometric Panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="md:hidden absolute top-16 left-4 right-4 z-50 glass-panel p-4 shadow-2xl border border-indigo-500/40 bg-slate-950/98 flex flex-col gap-2"
          >
            <NavLink to="/" className={navLinkClass}>
              <FiPlus className="text-sm text-cyan-400" />
              <span>New Snippet</span>
            </NavLink>
            <NavLink to="/paste" className={navLinkClass}>
              <FiFolder className="text-sm text-indigo-400" />
              <span>Vault Snippets</span>
            </NavLink>
            {isLoggedIn && (
              <NavLink to="/profile" className={navLinkClass}>
                <FiUser className="text-sm text-purple-400" />
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
