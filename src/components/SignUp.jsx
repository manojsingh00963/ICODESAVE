import React from 'react';
import { NavLink } from 'react-router-dom';

const SignUp = () => {
  return (
    <div className="bg-gradient-to-b from-black to-gray-900 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-black text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create Your Account</h1>
          <p className="mt-2 text-gray-400">
            Enjoy The app and start your journey with us.
          </p>
        </div>
        <form className="space-y-6">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-2 bg-black border border-gray-700 rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-2 bg-black border border-gray-700 rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 bg-black border border-gray-700 rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center text-gray-400">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
              <span className="ml-2">Remember me</span>
            </label>
            <a href="#" className="text-gray-400 hover:text-gray-300">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-md hover:cursor-pointer "
          >
            Sign In
          </button>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-gray-400">Or</span>
          </div>
          {/* <button
            type="button"
            className="w-full py-2 bg-gray-800 text-white rounded-md flex items-center justify-center space-x-2 hover:cursor-pointer "
          >
            <i className="fab fa-google"></i>
            <span>Sign in with Google</span>
          </button> */}
          <button>
            <NavLink href="/auth/login" className="text-white">LogIn</NavLink>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
