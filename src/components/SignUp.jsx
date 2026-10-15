import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosinstance';
import { FiEye, FiEyeOff, FiLock, FiMail, FiUser, FiBriefcase, FiCode } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
import { motion } from 'framer-motion';

const SignUp = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
    cpassword: '',
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    cpassword: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, role, password, cpassword } = credentials;

    if (!name.trim() || !email.trim() || !password || !cpassword) {
      toast.error('Please fill in all required fields!');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long!');
      return;
    }

    if (password !== cpassword) {
      toast.error('Passwords do not match!');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/auth/createUser', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: role.trim() || 'Developer',
        password,
      });

      // Fix critical token property extraction (supports both authToken and authtoken)
      const token = response.data.authToken || response.data.authtoken;

      if (token) {
        localStorage.setItem('authToken', token);
        if (response.data.user) {
          localStorage.setItem('userData', JSON.stringify(response.data.user));
        }

        // Notify Navbar and app
        window.dispatchEvent(new Event('auth-change'));
        toast.success('Account created successfully! Welcome to ICODESAVE 🎉');
        navigate('/');
      } else {
        toast.error(response.data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Signup Error:', error);
      const errMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to create account. Please try again.';
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
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-600/30 mb-3">
            <FiCode className="text-2xl" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Create Your Account
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-400">
            Start organizing and archiving your code snippets today.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-3 text-slate-500 text-sm" />
              <input
                type="text"
                name="name"
                placeholder="Manoj Singh"
                value={credentials.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Email Address</label>
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
            <label className="block text-xs font-mono text-slate-400 mb-1">Profession / Role</label>
            <div className="relative">
              <FiBriefcase className="absolute left-3.5 top-3 text-slate-500 text-sm" />
              <input
                type="text"
                name="role"
                placeholder="FullStack Developer / Student / Engineer"
                value={credentials.role}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-3 text-slate-500 text-sm" />
              <input
                type={showPassword.password ? 'text' : 'password'}
                name="password"
                placeholder="At least 6 characters"
                value={credentials.password}
                onChange={handleChange}
                minLength={6}
                className="w-full pl-10 pr-11 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                required
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => ({ ...prev, password: !prev.password }))
                }
                className="absolute right-3.5 top-3 text-slate-400 hover:text-white cursor-pointer"
              >
                {showPassword.password ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Confirm Password</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-3 text-slate-500 text-sm" />
              <input
                type={showPassword.cpassword ? 'text' : 'password'}
                name="cpassword"
                placeholder="Re-enter your password"
                value={credentials.cpassword}
                onChange={handleChange}
                minLength={6}
                className="w-full pl-10 pr-11 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                required
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => ({ ...prev, cpassword: !prev.cpassword }))
                }
                className="absolute right-3.5 top-3 text-slate-400 hover:text-white cursor-pointer"
              >
                {showPassword.cpassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 mt-3 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition duration-200 cursor-pointer disabled:opacity-50"
          >
            {loading ? <PulseLoader color="#ffffff" size={6} /> : 'Create Account'}
          </button>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2">
                Log In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default SignUp;
