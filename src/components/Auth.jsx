import { useState, useEffect } from "react";
import { FaStar, FaEdit, FaSignOutAlt } from "react-icons/fa";
import { BsSun, BsMoon } from "react-icons/bs";

const Auth = () => {


  const [file, setFile] = useState(null);

  useEffect(() => {
    // Load the image from localStorage on page load
    const storedFile = localStorage.getItem('file');
    if (storedFile) {
      setFile(storedFile);
    }
  }, []);

  function handleChange(e) {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Convert image to base64 and store in localStorage
        localStorage.setItem('file', reader.result);
        setFile(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  }

  const [darkMode, setDarkMode] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showFullBio, setShowFullBio] = useState(false);

  const userData = {
    name: "Sarah Anderson",
    profession: "Senior Software Engineer",
    bio: "Passionate software engineer with over 8 years of experience in full-stack development. Specialized in React, Node.js, and cloud technologies. Leading technical initiatives and mentoring junior developers. Always eager to learn and explore new technologies while building scalable solutions.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    socialLinks: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com"
    }
  };

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) setDarkMode(JSON.parse(savedMode));
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", JSON.stringify(newMode));
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    console.log("Logging out...");
    setShowLogoutModal(false);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    console.log("Feedback submitted:", { rating, feedback });
    setShowFeedback(false);
    setRating(0);
    setFeedback("");
  };

  return (
    <div className={`min-h-screen pt-32 flex items-center justify-center p-4 ${darkMode ? "bg-gray-900" : "bg-[#bfd8ff]"}`}>
      <div className={`max-w-md w-full rounded-xl shadow-lg p-6 relative ${darkMode ? "bg-gray-800" : "bg-[#b4c3e9ba]"}`}>
        <div className="absolute top-4 right-4 flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <BsSun className="text-white" /> : <BsMoon />}
          </button>
          <button
            onClick={handleLogout}
            className="text-red-500 text-2xl cursor-pointer hover:text-red-600 transition-colors"
            aria-label="Logout"
          >
            <FaSignOutAlt />
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative">
            {file && <img src={file}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-[#00008b57]"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1494790108377-be9c29b29330";
              }}
            />}
            <button
              className="absolute bottom-0 right-0 p-2 bg-[#00008b88] rounded-full text-white hover:bg-blue-900 transition-colors cursor-pointer "
              aria-label="Edit profile picture "

            >
              <FaEdit >
                <input type="file" onChange={handleChange} />
              </FaEdit>
            </button>
          </div>

          <h1 className={`mt-4 text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
            {userData.name}
          </h1>
          <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            {userData.profession}
          </p>

          <div className="mt-4 text-center">
            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} ${showFullBio ? "" : "line-clamp-3"}`}>
              {userData.bio}
            </p>
            <button
              onClick={() => setShowFullBio(!showFullBio)}
              className="text-[darkblue] hover:text-blue-900 mt-2 transition-colors cursor-pointer "
            >
              {showFullBio ? "Show Less" : "Read More"}
            </button>
          </div>

          <button
            onClick={() => setShowFeedback(!showFeedback)}
            className="mt-6 bg-blue-950 text-white px-6 py-2 rounded-full hover:bg-blue-900 transition-colors cursor-pointer "
          >
            Give Feedback
          </button>

          {showFeedback && (
            <div className="mt-6 w-full">
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"} hover:cursor-pointer `}
                  >
                    <FaStar />
                  </button>
                ))}
              </div>
              <form onSubmit={handleFeedbackSubmit}>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full p-2 border rounded-lg resize-none"
                  rows="4"
                  placeholder="Your feedback..."
                  required
                />
                <button
                  type="submit"
                  className="mt-2 w-full cursor-pointer bg-blue-950 text-white py-2 rounded-lg hover:bg-blue-900 transition-colors"
                >
                  Submit Feedback
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full ${darkMode ? "text-white" : "text-gray-800"}`}>
            <h2 className="text-xl font-bold mb-4">Confirm Logout</h2>
            <p className="mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;