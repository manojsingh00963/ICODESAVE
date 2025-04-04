import React, { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { FaFileCode, FaHashtag, FaAnglesDown } from "react-icons/fa6";
import { MdEditRoad } from "react-icons/md";
import { BsCodeSlash } from "react-icons/bs";
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { editNote, addNote, getNotes } from '../redux/features/noteSlice';
import { toast } from 'react-toastify';
import { Blocks } from 'react-loader-spinner';

const Home = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('');
  const [showTags, setShowTags] = useState(false);
  const [customTag, setCustomTag] = useState('');

  const { pasteId } = useParams();
  const notes = useSelector((state) => state.notes.notes);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const containerRef = useRef(null);

  const [loading, setLoading] = useState(false)

  const colors = ['bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500'];
  const predefinedTags = ['Code', 'Work', 'Personal', 'Important', 'Reuse'];


  useEffect(() => {
    dispatch(getNotes());
  }, [dispatch]);


  useEffect(() => {
    if (pasteId) {
      const paste = notes.find((note) => note._id === pasteId);
      if (paste) {
        setTitle(paste.title);
        setContent(paste.content);
        setTag(paste.tag || '');
      } else {
        toast.error('Paste not found!');
        navigate('/paste');
      }
    }
  }, [notes, pasteId, navigate]);


  const handleSubmit = () => {
    setLoading(true); // Set loading before starting the process

    setTimeout(() => {
      if (!title.trim() || !content.trim()) {
        toast.error('Title and content cannot be empty!');
        setLoading(false); // Stop loading on validation failure
        return;
      }

      if (!tag.trim()) {
        toast.error('Please Add-Tag!');
        setLoading(false);
        return;
      }

      if (customTag && customTag.length <= 10) {
        setTag(customTag);
      }

      if (pasteId) {
        dispatch(editNote({ id: pasteId, title, content, tag }));
      } else {
        dispatch(addNote({ title, content, tag }));
      }

      setTitle('');
      setContent('');
      setTag('');
      setCustomTag('');
      navigate('/paste');
      setLoading(false); // Stop loading after completion
    }, 1000);
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-10 pt-20 pb-10 flex flex-col container mx-auto px-4 md:px-8 lg:px-16"
    >
      <div className="loader absolute top-56 left-[45%] z-20  ">

      {loading && (
        <Blocks
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        visible={true}
        />
      )}
      </div>

      <div className="flex flex-wrap gap-2 justify-center items-center mb-4">

        <input
          className="w-[50vw] sm:max-w-xs md:max-w-md lg:max-w-lg border rounded p-2 pl-4 bg-gray-100 dark:bg-black placeholder:text-gray-400 focus:outline-none dark:text-white dark:caret-white transition-all duration-300 ease-in-out hover:border-indigo-500"
          type="text"
          placeholder="Enter title here"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />


        <div className="relative">

          <div
            className="flex items-center gap-2 border rounded p-2 bg-gray-100 dark:bg-black cursor-pointer transition-all duration-300 ease-in-out hover:border-indigo-500"
            onClick={() => setShowTags(!showTags)}
          >
            <FaHashtag className="text-gray-500 dark:text-gray-400" />
            <span className=' text-sm ' >{tag || 'Add-Tag'}</span>
            <motion.div
              animate={{ rotate: showTags ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <FaAnglesDown className="text-gray-500 dark:text-gray-400" />
            </motion.div>
          </div>

          <AnimatePresence>
            {showTags && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-12 left-0 z-10 w-full bg-gray-100 dark:bg-black border border-gray-300 dark:border-gray-700 rounded shadow-md overflow-hidden"
              >
                <li className="p-2">
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="Enter tag"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    required
                    className="w-full border rounded p-1 pl-4 focus:outline-none bg-gray-100 dark:bg-black placeholder:text-gray-400 dark:text-white dark:caret-white"
                  />
                </li>
                {predefinedTags.map((option) => (
                  <li
                    key={option}
                    onClick={() => {
                      setTag(option);
                      setShowTags(false);
                    }}
                    className={`p-2 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer ${tag === option ? 'bg-gray-200 dark:bg-gray-800' : ''}`}
                  >
                    {option}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          onClick={handleSubmit}
          className="p-2 text-xl border rounded cursor-pointer transition-all duration-300 ease-in-out hover:text-green-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {pasteId ? <MdEditRoad /> : <FaFileCode />}
        </motion.button>
      </div>
      {/*  Code Input Area */}
      <div

        className="relative bg-gray-100 dark:bg-black border border-t-4 mt-4 mx-auto w-full max-w-2xl rounded"
      >
        {/*  Drag Handles */}
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

        {/*  Code Slash Icon */}
        <BsCodeSlash className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 cursor-pointer transition-all duration-300 hover:text-indigo-500" />

        {/*  Code Editor */}
        <div className="flex border-t">
          {/*  Line Numbers */}
          <aside className="w-10 text-right pr-2 pt-4 text-gray-500 dark:text-gray-400 border-r border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
            {content.split('\n').map((_, index) => (
              <div key={index}>{index + 1}</div>
            ))}
          </aside>

          {/*  Textarea */}
          <textarea
            value={content}
            placeholder="Enter code here"
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            className="w-full min-h-[300px] text-sm p-4 focus:outline-none bg-gray-50 dark:bg-gray-800 font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:text-white dark:caret-white transition-all duration-300 ease-in-out hover:border-indigo-500"
            spellCheck="false"
            required
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
