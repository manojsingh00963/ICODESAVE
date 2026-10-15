import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiLock, FiMail, FiCode } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
import axios from '../utils/axiosinstance';

const LogIn = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = credentials;
    if (!email.trim() || !password) {
      toast.error('Please enter your email and password');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });

      const token = response.data.authToken || response.data.authtoken;

      if (token) {
        localStorage.setItem('authToken', token);
        if (response.data.user) {
          localStorage.setItem('userData', JSON.stringify(response.data.user));
        }

        window.dispatchEvent(new Event('auth-change'));
        toast.success('Welcome back to the Vault! 🚀');
        navigate('/');
      } else {
        toast.error(response.data.error || 'Failed to authenticate');
      }
    } catch (error) {
      console.error('Login Error:', error);
      const errMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to connect to the server. Check your credentials.';
      toast.error(errMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex-1 flex items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-md glass-panel p-6 sm:p-8 shadow-2xl border border-indigo-500/35 bg-slate-950/90 font-mono">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 flex items-center justify-center text-white mx-auto shadow-[0_0_15px_rgba(99,102,241,0.4)] mb-3 border border-cyan-400/50">
            <FiCode className="text-xl" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
            VAULT_LOGIN
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Authenticate to access your encrypted code vault.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block uppercase tracking-wider text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-slate-500 text-sm" />
              <input
                type="email"
                name="email"
                placeholder="developer@vault.dev"
                value={credentials.email}
                onChange={handleChange}
                autoComplete="email"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-slate-500 text-sm" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••••••"
                value={credentials.password}
                onChange={handleChange}
                autoComplete="current-password"
                className="w-full pl-9 pr-10 py-2.5 bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Submit Button - Sharp Brutalist */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 mt-2 font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white border border-cyan-400/50 shadow-[0_0_15px_rgba(99,102,241,0.35)] transition cursor-pointer disabled:opacity-50"
          >
            {loading ? <PulseLoader color="#ffffff" size={6} /> : 'AUTHENTICATE_VAULT'}
          </button>

          {/* Switch to Sign Up */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-400">
              No vault credentials yet?{' '}
              <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-bold uppercase underline underline-offset-2">
                CREATE_ACCOUNT
              </Link>
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default LogIn;
