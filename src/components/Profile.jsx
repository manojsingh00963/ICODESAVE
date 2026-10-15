import { useState, useEffect, useCallback } from 'react';
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiEdit2,
  FiCheck,
  FiLogOut,
  FiMessageSquare,
  FiStar,
  FiUploadCloud,
  FiCode,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../utils/axiosinstance';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { PulseLoader } from 'react-spinners';
import { showConfirm } from '../redux/features/confirmSlice';
import { resetNotes, getNotes } from '../redux/features/noteSlice';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.notes.notes);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
    bio: '',
    avatar: '',
    createdAt: '',
  });

  const [formFields, setFormFields] = useState({
    name: '',
    role: '',
    bio: '',
    avatar: '',
  });

  useEffect(() => {
    if (notes.length === 0) {
      dispatch(getNotes());
    }
  }, [dispatch, notes.length]);

  const fetchUserProfile = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get('/api/auth/getuser');
      const u = res.data.user || res.data;
      const loaded = {
        name: u.name || 'Developer',
        email: u.email || '',
        role: u.role || 'FullStack Developer',
        bio: u.bio || 'Passionate about writing clean, efficient code.',
        avatar: u.avatar || '',
        createdAt: u.createdAt || '',
      };
      setUserData(loaded);
      setFormFields({
        name: loaded.name,
        role: loaded.role,
        bio: loaded.bio,
        avatar: loaded.avatar,
      });
      localStorage.setItem('userData', JSON.stringify(loaded));
    } catch (err) {
      console.error('Profile load error:', err);
      toast.error('Failed to load profile details');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormFields((prev) => ({ ...prev, avatar: reader.result }));
        setUserData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!formFields.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    try {
      setSaving(true);
      const res = await axios.put('/api/auth/updateuser', {
        name: formFields.name.trim(),
        role: formFields.role.trim(),
        bio: formFields.bio.trim(),
        avatar: formFields.avatar,
      });

      const updated = res.data.user || formFields;
      setUserData((prev) => ({ ...prev, ...updated }));
      localStorage.setItem('userData', JSON.stringify(updated));
      window.dispatchEvent(new Event('auth-change'));
      toast.success('Profile updated successfully! 🎉');
      setEditMode(false);
    } catch (err) {
      console.error('Profile update error:', err);
      toast.error(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      toast.error('Please enter your feedback comments');
      return;
    }

    try {
      setSubmittingFeedback(true);
      await axios.post('/api/feedback/submit', {
        rating,
        feedback: feedbackText.trim(),
      });
      toast.success('Thank you for your feedback! ❤️');
      setFeedbackText('');
      setShowFeedbackModal(false);
    } catch (err) {
      console.error('Feedback submit error:', err);
      toast.error(err.response?.data?.error || 'Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleLogout = () => {
    dispatch(
      showConfirm({
        message: 'Are you sure you want to log out of ICODESAVE?',
        color: '#f43f5e',
        onConfirm: () => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          dispatch(resetNotes());
          window.dispatchEvent(new Event('auth-change'));
          toast.info('Logged out successfully');
          navigate('/login');
        },
      })
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center gap-3">
        <PulseLoader color="#22d3ee" size={8} />
        <p className="text-xs text-slate-400 font-mono uppercase">FETCHING_PROFILE...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="container mx-auto px-4 py-8 max-w-4xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left Column: Sharp Avatar & Quick Info */}
        <div className="md:col-span-5 glass-panel p-6 border border-indigo-500/25 shadow-2xl flex flex-col items-center text-center">
          <div className="relative group mb-4">
            {userData.avatar ? (
              <img
                src={userData.avatar}
                alt="Avatar"
                className="w-28 h-28 object-cover border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
              />
            ) : (
              <div className="w-28 h-28 bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center text-3xl font-mono font-black text-white border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                {userData.name ? userData.name.charAt(0).toUpperCase() : <FiUser />}
              </div>
            )}

            <label
              htmlFor="avatar-upload"
              className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs font-mono font-bold cursor-pointer transition-opacity backdrop-blur-xs uppercase"
              title="Change Profile Photo"
            >
              <FiUploadCloud className="text-xl mb-1 text-cyan-300" />
              <span>UPLOAD</span>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
          </div>

          <h2 className="text-lg font-bold font-mono text-white tracking-tight uppercase">
            {userData.name}
          </h2>
          <p className="text-xs font-mono text-cyan-400 mt-0.5 uppercase tracking-wider">
            {userData.role}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 font-mono">
            <FiMail className="text-slate-500" />
            <span className="truncate max-w-[200px]">{userData.email}</span>
          </div>

          {userData.createdAt && (
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-1 font-mono uppercase">
              <FiCalendar />
              <span>MEMBER SINCE {new Date(userData.createdAt).toLocaleDateString()}</span>
            </div>
          )}

          {/* Quick Metrics - Sharp Boxes */}
          <div className="w-full grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-800">
            <div className="p-3 bg-slate-950 border border-slate-800 flex flex-col items-center">
              <span className="text-xl font-mono font-bold text-cyan-300">{notes.length}</span>
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider flex items-center gap-1 mt-0.5">
                <FiCode /> SNIPPETS
              </span>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 flex flex-col items-center">
              <span className="text-xl font-mono font-bold text-emerald-400">ONLINE</span>
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider flex items-center gap-1 mt-0.5">
                STATUS
              </span>
            </div>
          </div>

          {/* Action Buttons - Sharp */}
          <div className="w-full flex flex-col gap-2 mt-5 font-mono text-xs">
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-indigo-500/40 bg-slate-950 hover:bg-indigo-950 hover:border-cyan-400 text-cyan-300 font-bold uppercase tracking-wider transition cursor-pointer"
            >
              <FiMessageSquare />
              <span>FEEDBACK</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-rose-900/40 bg-rose-950/20 hover:bg-rose-950/60 text-rose-400 font-bold uppercase tracking-wider transition cursor-pointer"
            >
              <FiLogOut />
              <span>LOGOUT</span>
            </button>
          </div>
        </div>

        {/* Right Column: Profile Details & Editor - Sharp Panel */}
        <div className="md:col-span-7 glass-panel p-6 border border-indigo-500/25 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-5">
            <div>
              <h2 className="text-lg font-bold font-mono text-white flex items-center gap-2 uppercase">
                <FiUser className="text-cyan-400" />
                <span>DEVELOPER_PROFILE</span>
              </h2>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                Manage your public bio and technical credentials.
              </p>
            </div>

            {!editMode ? (
              <button
                type="button"
                onClick={() => setEditMode(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border border-indigo-500/50 bg-indigo-950/60 hover:bg-indigo-900 text-cyan-300 transition cursor-pointer"
              >
                <FiEdit2 />
                <span>EDIT</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="text-xs font-mono text-slate-400 hover:text-white px-2 py-1 uppercase"
              >
                CANCEL
              </button>
            )}
          </div>

          {editMode ? (
            <form onSubmit={handleSaveChanges} className="space-y-3.5 font-mono text-xs">
              <div>
                <label className="block text-slate-400 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formFields.name}
                  onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 text-white focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 uppercase tracking-wider mb-1">
                  Profession / Role
                </label>
                <input
                  type="text"
                  value={formFields.role}
                  onChange={(e) => setFormFields({ ...formFields, role: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 uppercase tracking-wider mb-1">
                  Developer Bio
                </label>
                <textarea
                  rows={4}
                  value={formFields.bio}
                  onChange={(e) => setFormFields({ ...formFields, bio: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 text-white focus:border-indigo-500 focus:outline-none resize-none font-sans"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 border border-slate-800 text-slate-400 uppercase hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-1.5 px-5 py-2 font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border border-cyan-400/50 shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {saving ? (
                    <PulseLoader color="#ffffff" size={6} />
                  ) : (
                    <>
                      <FiCheck />
                      <span>SAVE_CHANGES</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-xs font-mono">
              <div>
                <span className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1">
                  FULL NAME
                </span>
                <p className="text-white font-bold text-sm tracking-wide">{userData.name}</p>
              </div>

              <div>
                <span className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1">
                  EMAIL ADDRESS
                </span>
                <p className="text-slate-300">{userData.email}</p>
              </div>

              <div>
                <span className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1">
                  PROFESSION / ROLE
                </span>
                <p className="text-slate-300">{userData.role}</p>
              </div>

              <div>
                <span className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1">
                  BIO
                </span>
                <p className="text-slate-300 font-sans whitespace-pre-wrap leading-relaxed text-sm">
                  {userData.bio}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Modal - Sharp Brutalist Dialog */}
      <AnimatePresence>
        {showFeedbackModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel bg-slate-950 border border-indigo-500/40 p-6 max-w-md w-full shadow-2xl font-mono text-xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2 uppercase">
                  <FiStar className="text-amber-400" />
                  <span>SUBMIT_FEEDBACK</span>
                </h3>
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div>
                  <label className="block text-slate-400 uppercase tracking-wider mb-2">
                    Developer Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-2xl transition-transform hover:scale-110 cursor-pointer"
                      >
                        <FiStar
                          className={
                            star <= rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-700'
                          }
                        />
                      </button>
                    ))}
                    <span className="ml-2 font-bold text-amber-300">{rating} / 5</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 uppercase tracking-wider mb-1">
                    Comments & Suggestions
                  </label>
                  <textarea
                    rows={4}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Your feedback to improve the vault..."
                    className="w-full p-3 bg-slate-900 border border-slate-800 text-white font-sans text-xs focus:border-indigo-500 focus:outline-none resize-none placeholder:text-slate-600"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackModal(false)}
                    className="px-4 py-2 border border-slate-800 text-slate-400 uppercase hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingFeedback}
                    className="px-5 py-2 font-bold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400 shadow-md transition disabled:opacity-50 cursor-pointer"
                  >
                    {submittingFeedback ? (
                      <PulseLoader color="#ffffff" size={6} />
                    ) : (
                      'SUBMIT'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Profile;
