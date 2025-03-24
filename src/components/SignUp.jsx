import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axiosinstance";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { PulseLoader } from "react-spinners";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    cpassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    cpassword: false,
  });

  const [loading, setLoading] = useState(false);

  //  Handle Input Change
  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  //  Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, role , password, cpassword } = credentials;

    if (!name || !email || !password || !cpassword) {
      toast.error("Please fill in all fields!");
      return;
    }

    if (password !== cpassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "/auth/createUser",
        { name, email, role, password }
      );

      if (response.data.success) {
        localStorage.setItem("authToken", response.data.authtoken);
        toast.success("Account created successfully! 🎉");
        navigate("/"); //  Redirect to home after signup
      } else {
        toast.error(response.data.error || "Invalid credentials!");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      toast.error(
        error.response?.data?.message || "Something went wrong! Try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="bg-gradient-to-b pt-22  min-w-screen from-[#000000a4] to-gray-800 flex items-center justify-center min-h-screen"
    >
      <div className="w-full max-w-md p-8 bg-black text-white rounded shadow-lg">
        {/*  Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create Your Account</h1>
          <p className="mt-2 p-2 text-gray-400">
            Enjoy the app and start your journey with us.
          </p>
        </div>

        {/*  Form */}
        <form onSubmit={handleSubmit} className=" space-y-4">
          {/*  Name Input */}
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={credentials.name}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/*  Email Input */}
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={credentials.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {/*  Profession Input */}
          <input
            type="text"
            name="role"
            placeholder="Enter your Profession"
            value={credentials.role}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {/*  Password Input */}
          <div className="relative">
            <input
              type={showPassword.password ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              minLength={6}
              required
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => ({
                  ...prev,
                  password: !prev.password,
                }))
              }
              className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400"
            >
              {showPassword.password ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/*  Confirm Password Input */}
          <div className="relative">
            <input
              type={showPassword.cpassword ? "text" : "password"}
              name="cpassword"
              placeholder="Confirm Password"
              value={credentials.cpassword}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              minLength={6}
              required
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => ({
                  ...prev,
                  cpassword: !prev.cpassword,
                }))
              }
              className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400"
            >
              {showPassword.cpassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/*  Submit Button */}
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
            {loading ? <PulseLoader color="#ffffff" size={8} /> : "Sign Up"}
          </motion.button>

          {/*  Divider */}
          <div className="flex items-center justify-center space-x-2">
            <span className="text-gray-400">Or</span>
          </div>

          {/*  Navigate to Log In */}
          <div className="flex items-center justify-center">
            <p className="text-gray-400 ">Already have an account?</p>
            <Link to="/login" className="text-blue-400 cursor-pointer hover:underline ml-1">
              Log In
            </Link>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default SignUp;
