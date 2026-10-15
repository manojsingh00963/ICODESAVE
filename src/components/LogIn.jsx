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

        // Notify Navbar and app listeners
        window.dispatchEvent(new Event('auth-change'));
        toast.success('Welcome back! ✨');
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-md glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl border border-indigo-500/30 bg-slate-950/85">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-600/30 mb-3">
            <FiCode className="text-2xl" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-400">
            Sign in to access your cloud code snippet vault.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-3 text-slate-500 text-sm" />
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={credentials.email}
                onChange={handleChange}
                autoComplete="email"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-3 text-slate-500 text-sm" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleChange}
                autoComplete="current-password"
                className="w-full pl-10 pr-11 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-white cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 mt-2 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition duration-200 cursor-pointer disabled:opacity-50"
          >
            {loading ? <PulseLoader color="#ffffff" size={6} /> : 'Log In to Vault'}
          </button>

          {/* Switch to Sign Up */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-400">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default LogIn;
