import { useState, useEffect } from "react";
import { FaStar, FaEdit, FaSignOutAlt, FaUserEdit, FaCommentDots } from "react-icons/fa";
import { BsSun, BsMoon } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const Profile = () => {
  const navigate = useNavigate();

  //  State Handling
  const [state, setState] = useState({
    file: null,
    darkMode: true,
    showFeedback: false,
    rating: 0,
    feedback: "",
    editMode: false,
    loading: false,
    userData: {
      name: "John Doe",
      profession: "Software Developer",
      bio: "Passionate about coding!",
      avatar: "/default-avatar.png",
    },
  });

  //  Load User Data + Theme State
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const savedUser = localStorage.getItem("userData");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setState((prev) => ({
        ...prev,
        userData: userData || prev.userData,
        file: userData?.avatar || prev.file,
      }));
    } else {
      fetchUserData(token);
    }

    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) {
      setState((prev) => ({
        ...prev,
        darkMode: JSON.parse(savedMode),
      }));
    }
  }, [navigate]);

  //  Fetch User Data from Backend
  const fetchUserData = async (token) => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const { data } = await axios.get("http://localhost:5000/api/auth/getuser", {
        headers: { authToken: token },
      });
      console.log(data)

      const updatedData = {
        name: data.name || "John Doe",
        profession: data.role || "Software Developer",
        bio: data?.bio || "Passionate about coding!",
        avatar: data?.avatar || "/default-avatar.png",
      };

      setState((prev) => ({
        ...prev,
        userData: updatedData,
        file: updatedData.avatar,
        loading: false,
      }));

      localStorage.setItem("userData", JSON.stringify(updatedData));
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load profile");
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  //  Handle Avatar Upload
  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState((prev) => ({
          ...prev,
          file: reader.result,
          userData: { ...prev.userData, avatar: reader.result },
        }));

        localStorage.setItem(
          "userData",
          JSON.stringify({ ...state.userData, avatar: reader.result })
        );
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  //  Toggle Dark Mode
  const toggleDarkMode = () => {
    setState((prev) => {
      const newMode = !prev.darkMode;
      localStorage.setItem("darkMode", JSON.stringify(newMode));
      return { ...prev, darkMode: newMode };
    });
  };

  //  Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/login");
  };

  //  Toggle Feedback Section
  const toggleFeedback = () => {
    setState((prev) => ({
      ...prev,
      showFeedback: !prev.showFeedback,
    }));
  };

  //  Handle Feedback Submission
  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!state.rating || !state.feedback) {
      alert("Please provide a rating and feedback");
      return;
    }

    console.log("Feedback submitted:", { rating: state.rating, feedback: state.feedback });
    setState((prev) => ({
      ...prev,
      showFeedback: false,
      rating: 0,
      feedback: "",
    }));
    toast.success("Feedback submitted successfully!");
  };

  return (
    <motion.div
          initial={{ opacity: 0, z: -30 }}
          animate={{ opacity: 1, z: 10 }}
          exit={{ opacity: 0, z: -30 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
      className={`min-h-screen w-full mx-auto flex items-center justify-center p-4 ${
        state.darkMode ? "bg-gray-900" : "bg-blue-100"
      }`}
    >
      <div
        className={`max-w-md w-full mt-10 rounded-lg shadow-lg p-6 relative ${
          state.darkMode ? "bg-gray-800 text-white" : "bg-white/50 backdrop-blur-md text-black"
        }`}
      >
        {/* 🌙 Theme & Logout */}
        <div className="absolute top-4 right-4 flex items-center gap-4">
          <button onClick={toggleDarkMode} className="cursor-pointer">
            {state.darkMode ? <BsSun className="text-yellow-400 text-2xl" /> : <BsMoon />}
          </button>
          <button onClick={handleLogout} className="text-red-500 text-2xl cursor-pointer">
            <FaSignOutAlt />
          </button>
        </div>

        {/* 👤 Avatar */}
        <div className="flex flex-col items-center gap-4">
          <img
            src={state.file}
            alt="Profile"
            className="w-32 h-32 rounded-full border-2"
          />
          <label
            htmlFor="avatar"
            className="cursor-pointer flex items-center gap-2 text-blue-400"
          >
            <FaUserEdit />
            Edit Avatar
          <input type="file" onChange={handleChange} className="hidden " id="avatar" />
          </label>
        </div>

        {/* 📝 Profile Info */}
        {state.editMode ? (
          <div className="mt-4 flex flex-col justify-center ">
            <input
              type="text"
              value={state.userData.name}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  userData: { ...prev.userData, name: e.target.value },
                }))
              }
              className="border p-2 rounded w-full"
            />
            <textarea
              value={state.userData.bio}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  userData: { ...prev.userData, bio: e.target.value },
                }))
              }
              className="border p-2 rounded w-full mt-2"
            />
            <button
              onClick={() =>
                setState((prev) => ({ ...prev, editMode: false }))
              }
              className="bg-blue-950 hover:bg-blue-900 text-white p-2 cursor-pointer rounded mt-2"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center">{state.userData.name}</h1>
            <p className="text-center">{state.userData.profession}</p>
            <p className="text-center">{state.userData.bio}</p>
          </>
        )}

        {/* ✏️ Edit Profile */}
        <button
          onClick={() => setState((prev) => ({ ...prev, editMode: true }))}
          className="absolute top-2 left-4 flex items-center justify-center gap-2 text-blue-500 mt-2 cursor-pointer z-50"
        >
          <FaEdit />
          Edit Profile
        </button>

        {/* ⭐ Feedback Button */}
        <button
          onClick={toggleFeedback}
          className="flex items-center justify-center gap-2 text-blue-500 mt-4 cursor-pointer"
        >
          <FaCommentDots />
          {state.showFeedback ? "Close Feedback" : "Give Feedback"}
        </button>

        {/* ⭐ Feedback Section */}
        {state.showFeedback && (
          <motion.form
            onSubmit={handleFeedbackSubmit}
            className="mt-4 flex flex-col gap-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex flex-row gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  onClick={() =>
                    setState((prev) => ({ ...prev, rating: star }))
                  }
                  className={`cursor-pointer ${
                    star <= state.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <textarea
              placeholder="Leave your feedback..."
              className="border p-2 rounded"
              value={state.feedback}
              onChange={(e) =>
                setState((prev) => ({ ...prev, feedback: e.target.value }))
              }
            />
            <button className="bg-blue-950 text-white hover:bg-blue-900 p-2 rounded cursor-pointer">
              Submit
            </button>
          </motion.form>
        )}
      </div>
    </motion.div>
  );
};

export default Profile;
