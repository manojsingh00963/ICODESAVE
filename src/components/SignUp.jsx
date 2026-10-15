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

      const token = response.data.authToken || response.data.authtoken;

      if (token) {
        localStorage.setItem('authToken', token);
        if (response.data.user) {
          localStorage.setItem('userData', JSON.stringify(response.data.user));
        }

        window.dispatchEvent(new Event('auth-change'));
        toast.success('Account provisioned! Welcome to ICODESAVE 🚀');
        navigate('/');
      } else {
        toast.error(response.data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Signup Error:', error);
      const errMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to provision account. Please check inputs.';
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
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 flex items-center justify-center text-white mx-auto shadow-[0_0_15px_rgba(99,102,241,0.4)] mb-3 border border-cyan-400/50">
            <FiCode className="text-xl" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
            NEW_DEVELOPER_REGISTRY
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Provision your encrypted code snippet storage.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 font-mono text-xs">
          <div>
            <label className="block uppercase tracking-wider text-slate-400 mb-1">
              Full Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-slate-500 text-sm" />
              <input
                type="text"
                name="name"
                placeholder="Developer Name"
                value={credentials.name}
                onChange={handleChange}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block uppercase tracking-wider text-slate-400 mb-1">
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
            <label className="block uppercase tracking-wider text-slate-400 mb-1">
              Profession / Specialization
            </label>
            <div className="relative">
              <FiBriefcase className="absolute left-3 top-3 text-slate-500 text-sm" />
              <input
                type="text"
                name="role"
                placeholder="Systems Engineer / FullStack"
                value={credentials.role}
                onChange={handleChange}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block uppercase tracking-wider text-slate-400 mb-1">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-slate-500 text-sm" />
              <input
                type={showPassword.password ? 'text' : 'password'}
                name="password"
                placeholder="Min 6 characters"
                value={credentials.password}
                onChange={handleChange}
                minLength={6}
                className="w-full pl-9 pr-10 py-2.5 bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition"
                required
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => ({ ...prev, password: !prev.password }))
                }
                className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer"
              >
                {showPassword.password ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block uppercase tracking-wider text-slate-400 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-slate-500 text-sm" />
              <input
                type={showPassword.cpassword ? 'text' : 'password'}
                name="cpassword"
                placeholder="Re-enter password"
                value={credentials.cpassword}
                onChange={handleChange}
                minLength={6}
                className="w-full pl-9 pr-10 py-2.5 bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition"
                required
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => ({ ...prev, cpassword: !prev.cpassword }))
                }
                className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer"
              >
                {showPassword.cpassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 mt-2 font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white border border-cyan-400/50 shadow-[0_0_15px_rgba(99,102,241,0.35)] transition cursor-pointer disabled:opacity-50"
          >
            {loading ? <PulseLoader color="#ffffff" size={6} /> : 'PROVISION_ACCOUNT'}
          </button>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-400">
              Already hold vault keys?{' '}
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-bold uppercase underline underline-offset-2">
                LOGIN_HERE
              </Link>
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default SignUp;
