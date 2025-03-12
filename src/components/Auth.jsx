import { useState, useEffect } from "react";
import { FaStar, FaEdit, FaSignOutAlt } from "react-icons/fa";
import { BsSun, BsMoon } from "react-icons/bs";

const Auth = () => {
  const [file, setFile] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showFullBio, setShowFullBio] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Editable User Data
  const [userData, setUserData] = useState({
    name: "Sarah Anderson",
    profession: "Senior Software Engineer",
    bio: "Passionate software engineer with over 8 years of experience in full-stack development. Specialized in React, Node.js, and cloud technologies. Leading technical initiatives and mentoring junior developers. Always eager to learn and explore new technologies while building scalable solutions.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const storedFile = localStorage.getItem('file');
    if (storedFile) setFile(storedFile);

    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) setDarkMode(JSON.parse(savedMode));
  }, []);

  // Handle file upload
  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem('file', reader.result);
        setFile(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", JSON.stringify(newMode));
  };

  // Handle Logout
  const handleLogout = () => setShowLogoutModal(true);

  const confirmLogout = () => {
    console.log("Logging out...");
    setShowLogoutModal(false);
  };

  // Handle Feedback Submission
  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    console.log("Feedback submitted:", { rating, feedback });
    setShowFeedback(false);
    setRating(0);
    setFeedback("");
  };

  // Handle Profile Edit Submission
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setEditMode(false);
    console.log("Profile Updated:", userData);
  };

  return (
    <div className={`min-h-screen pt-32 flex items-center justify-center p-4 ${darkMode ? "bg-gray-900" : "bg-[#bfd8ff]"}`}>
      <div className={`max-w-md w-full rounded-xl shadow-lg p-6 relative ${darkMode ? "bg-gray-800" : "bg-[#b4c3e9ba]"}`}>
        {/* Top Right Buttons */}
        <div className="absolute top-4 right-4 flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <BsSun className="text-white text-[20px]" /> : <BsMoon />}
          </button>
          <button
            onClick={handleLogout}
            className="text-red-500 text-2xl cursor-pointer hover:text-red-600 transition-colors"
            aria-label="Logout"
          >
            <FaSignOutAlt />
          </button>
        </div>

        {/* Edit Button on Left */}
        <button
          onClick={() => setEditMode(true)}
          className="absolute top-4 left-4 p-2 bg-blue-900 text-white rounded-full hover:bg-blue-700 transition-colors"
        >
          <FaEdit />
        </button>

        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <div className="relative">
            {file && (
              <img
                src={file}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-[#00008b57]"
              />
            )}
            <label className="absolute bottom-0 right-0 p-2 bg-[#00008b88] rounded-full text-white cursor-pointer">
              <FaEdit />
              <input
                type="file"
                className="hidden"
                onChange={handleChange}
              />
            </label>
          </div>

          {/* Profile Info */}
          {!editMode ? (
            <>
              <h1 className={`mt-4 text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                {userData.name}
              </h1>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {userData.profession}
              </p>
              <p className={`mt-2 text-center ${darkMode ? "text-gray-400" : "text-gray-700"} ${showFullBio ? "" : "line-clamp-3"}`}>
                {userData.bio}
              </p>
            </>
          ) : (
            <form onSubmit={handleProfileSubmit} className="mt-4 w-full">
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="text"
                value={userData.profession}
                onChange={(e) => setUserData({ ...userData, profession: e.target.value })}
                className="w-full p-2 border mt-2 rounded-lg"
                required
              />
              <textarea
                value={userData.bio}
                onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                className="w-full p-2 border mt-2 rounded-lg"
                rows="3"
                required
              />
              <button className="w-full hover:cursor-pointer bg-blue-900 text-white mt-2 py-2 rounded-lg">
                Save Changes
              </button>
            </form>
          )}

          {/* Feedback Button */}
          <button
            onClick={() => setShowFeedback(!showFeedback)}
            className="mt-4 bg-blue-900 hover:cursor-pointer text-white px-4 py-2 rounded-full hover:bg-blue-800 transition-colors"
          >
            Give Feedback
          </button>

          {/* Feedback Section */}
          {showFeedback && (
            <form onSubmit={handleFeedbackSubmit} className="mt-4 w-full">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                  >
                    <FaStar />
                  </button>
                ))}
              </div>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full p-2 border rounded-lg mt-2"
                rows="3"
                placeholder="Write your feedback..."
                required
              />
              <button className="w-full bg-blue-900 hover:cursor-pointer text-white mt-2 py-2 rounded-lg">
                Submit Feedback
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
