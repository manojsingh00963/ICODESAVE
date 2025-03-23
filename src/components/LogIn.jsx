import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { PulseLoader } from "react-spinners";
import axios from "axios"; //Import Axios
import "react-toastify/dist/ReactToastify.css";

const LogIn = () => {
  const navigate = useNavigate();

  //State Management
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  //Handle Input Change
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  //Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = credentials;
    if (!email || !password) {
      toast.error("Please fill in all fields!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.authToken) {
        localStorage.setItem("authToken", response.data.authToken); //Store token in localStorage
        toast.success("Successfully logged in!");
        navigate("/");

        //Optional: Set "remember me" in localStorage
        if (rememberMe) {
          localStorage.setItem("rememberMe", email);
        }
      } else {
        toast.error(response.data.error || "Please enter correct  email password!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(
        error.response?.data?.error || "Failed to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  //Handle Remember Me (Load from localStorage)
  React.useEffect(() => {
    const savedEmail = localStorage.getItem("rememberMe");
    if (savedEmail) {
      setCredentials((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="bg-gradient-to-b pt-22 from-[#000000a4] to-gray-800 flex items-center justify-center min-h-screen"
    >
      <div className="w-full max-w-md p-8 space-y-6 bg-black text-white rounded-lg shadow-lg">
        {/*Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome Back!</h1>
          <p className="mt-2 text-gray-400">
            Sign in to your account to continue.
          </p>
        </div>

        {/*Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/*Email Input */}
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={credentials.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/*Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute cursor-pointer inset-y-0 right-0 flex items-center pr-3 text-gray-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/*Remember Me and Forgot Password */}
          {/* <div className="flex items-center justify-between">
            <label className="flex items-center text-gray-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="form-checkbox h-4 w-4 cursor-pointer text-blue-600"
              />
              <span className="ml-2 ">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-gray-400 hover:text-gray-300 cursor-pointer ">
              Forgot password?
            </Link>
          </div> */}

          {/*Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-2 bg-gradient-to-r from-blue-400 to-purple-500 text-white cursor-pointer rounded-md ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gradient-to-r from-blue-500 to-purple-600"
            }`}
            disabled={loading}
          >
            {loading ? <PulseLoader color="#ffffff" size={8} /> : "Log In"}
          </motion.button>

          {/*Divider */}
          <div className="flex items-center justify-center space-x-2">
            <span className="text-gray-400">Or</span>
          </div>

          {/*Navigate to Sign Up */}
          <div className="flex items-center justify-center">
            <p className="text-gray-400">Don't have an account?</p>
            <Link to="/signup" className="text-blue-400 hover:underline ml-1">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default LogIn;
