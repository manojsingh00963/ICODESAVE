import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFileCode, FaHashtag, FaAnglesDown } from "react-icons/fa6";
import { MdEditRoad } from "react-icons/md";
import { BsCodeSlash } from "react-icons/bs";
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { editNote, addNote, getNotes } from '../redux/features/noteSlice';
import { toast } from 'react-toastify';

const Home = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('Add-tag');
  const [showTags, setShowTags] = useState(false); // ✅ State for dropdown visibility

  const { pasteId } = useParams(); 
  const notes = useSelector((state) => state.notes.notes);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const containerRef = useRef(null);

  // ✅ Explicit color classes to fix Tailwind issue
  const colors = ['bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500'];

  // ✅ Fetch notes when component loads
  useEffect(() => {
    dispatch(getNotes());
  }, [dispatch]);

  // ✅ Load existing note if pasteId is available
  useEffect(() => {
    if (pasteId) {
      const paste = notes.find((note) => note._id === pasteId);
      if (paste) {
        setTitle(paste.title);
        setContent(paste.content);
        setTag(paste.tag || 'General');
      } else {
        toast.error('Paste not found!');
        navigate('/paste');
      }
    }
  }, [notes, pasteId, navigate]);

  // ✅ Handle submission (Add or Edit)
  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content cannot be empty!');
      return;
    }

    if (pasteId) {
      // ✅ Dispatch editNote with correct ID
      dispatch(editNote({ id: pasteId, title, content, tag }));
    } else {
      // ✅ Dispatch addNote to create a new note
      dispatch(addNote({ title, content, tag }));
    }

    // ✅ Reset state after submission
    setTitle('');
    setContent('');
    setTag('Add-tag');
    navigate('/paste');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-10 pt-20 pb-10 flex flex-col container mx-auto px-4 md:px-8 lg:px-16"
    >
      {/* ✅ Title, Tag & Submit */}
      <div className="flex flex-wrap gap-2 justify-center items-center mb-4">
        {/* ✅ Title Input */}
        <input
          className="w-full sm:max-w-xs md:max-w-md lg:max-w-lg border rounded p-2 pl-4 bg-gray-100 dark:bg-black font-normal placeholder:text-gray-400 focus:outline-none dark:text-white dark:caret-white transition-all duration-300 ease-in-out hover:border-indigo-500"
          type="text"
          placeholder="Enter title here"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* ✅ Tag Dropdown with Animation */}
        <div className="relative">
          {/* ✅ Dropdown Header */}
          <div 
            className="flex items-center gap-2 border rounded p-2 bg-gray-100 dark:bg-black cursor-pointer transition-all duration-300 ease-in-out hover:border-indigo-500"
            onClick={() => setShowTags(!showTags)}
          >
            <FaHashtag className="text-gray-500 dark:text-gray-400" />
            <span>{tag}</span>
            <motion.div
              animate={{ rotate: showTags ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <FaAnglesDown className="text-gray-500 dark:text-gray-400" />
            </motion.div>
          </div>

          {/* ✅ Animated Dropdown */}
          <AnimatePresence>
            {showTags && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-12 left-0 z-10 w-full bg-gray-100 dark:bg-black border border-gray-300 dark:border-gray-700 rounded shadow-md overflow-hidden"
              >
                {['General', 'Work', 'Personal', 'Important', 'Urgent'].map((option) => (
                  <li
                    key={option}
                    onClick={() => {
                      setTag(option);
                      setShowTags(false);
                    }}
                    className={`p-2 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer ${
                      tag === option ? 'bg-gray-200 dark:bg-gray-800' : ''
                    }`}
                  >
                    {option}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* ✅ Submit Button */}
        <motion.button
          onClick={handleSubmit}
          className="p-2 text-xl border rounded cursor-pointer transition-all duration-300 ease-in-out hover:text-green-600 "
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {pasteId ? <MdEditRoad /> : <FaFileCode />}
        </motion.button>
      </div>

      {/* ✅ Code Input Area */}
      <div
        
        className="relative bg-gray-100 dark:bg-black border border-t-4 mt-4 mx-auto w-full max-w-2xl rounded"
      >
        {/* ✅ Drag Handles */}
        <div ref={containerRef} className="flex p-2 gap-2 ">
          {colors.map((color) => (
            <motion.div
              key={color}
              drag
              dragConstraints={containerRef}
              whileDrag={{ scale: 1.1 }}
              dragElastic={2}
              className={`w-4 h-4 rounded-full ${color} cursor-grab transition-all duration-300 hover:scale-110`}
            />
          ))}
        </div>

        {/* ✅ Code Slash Icon */}
        <BsCodeSlash className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 cursor-pointer transition-all duration-300 hover:text-indigo-500" />

        {/* ✅ Code Editor */}
        <div className="flex border-t">
          {/* ✅ Line Numbers */}
          <aside className="w-10 text-right pr-2 pt-4 text-gray-500 dark:text-gray-400 border-r border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
            {content.split('\n').map((_, index) => (
              <div key={index}>{index + 1}</div>
            ))}
          </aside>

          {/* ✅ Textarea */}
          <textarea
            value={content}
            placeholder="Enter code here"
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            className="w-full min-h-[300px] text-sm p-4 focus:outline-none bg-gray-50 dark:bg-gray-800 font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:text-white dark:caret-white transition-all duration-300 ease-in-out hover:border-indigo-500"
            spellCheck="false"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
