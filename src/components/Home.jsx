import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaFileCode } from "react-icons/fa6";
import { MdEditRoad } from "react-icons/md";
import { BsCodeSlash } from "react-icons/bs";
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateToPastes, addToPastes } from '../redux/features/pasteSlice';

const Home = () => {
  const [tittle, setTittle] = useState('');
  const [value, setValue] = useState('');
  const { pasteId } = useParams();
  const allPastes = useSelector((state) => state.pastes.pastes);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const ref = useRef(null);

  const createPaste = () => {
    const paste = {
      tittle,
      content: value,
      id: pasteId || Date.now().toString(36),
      createdAt: new Date().toISOString(),
    };

    if (pasteId) {
      dispatch(updateToPastes(paste));
    } else {
      dispatch(addToPastes(paste));
    }

    setTittle('');
    setValue('');
    navigate('/paste');
  };

  useEffect(() => {
    if (pasteId) {
      const paste = allPastes.find((p) => p.id === pasteId);
      if (paste) {
        setTittle(paste.tittle);
        setValue(paste.content);
      }
    }
  }, [allPastes, pasteId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-10 pt-20 pb-10 flex flex-col container mx-auto px-4 md:px-8 lg:px-16"
    >
      {/* Title Input and Button */}
      <div className="flex gap-2 justify-center items-center mb-4">
        <input
          className="w-full sm:max-w-xs md:max-w-md lg:max-w-lg border rounded p-2 pl-4 bg-neutral-2 dark:bg-black font-normal placeholder:text-gray-300 focus:outline-none dark:text-white dark:caret-white"
          type="text"
          placeholder="Enter title here"
          value={tittle}
          onChange={(e) => setTittle(e.target.value)}
        />
        <button
          onClick={createPaste}
          className="p-2 text-xl hover:text-green-500 border rounded"
        >
          {pasteId ? <MdEditRoad /> : <FaFileCode />}
        </button>
      </div>

      {/* Code Input Area */}
      <div className="relative bg-transparent border border-t-4 mt-4 mx-auto w-full max-w-2xl">
        {/* Drag Handles */}
        <div ref={ref} className="flex p-2 gap-1">
          <motion.div drag dragConstraints={ref} whileDrag={{ scale: 1.1 }} dragElastic={0.2} className="w-4 h-4 rounded-full bg-red-500 cursor-grab" />
          <motion.div drag dragConstraints={ref} whileDrag={{ scale: 1.1 }} dragElastic={0.2} className="w-4 h-4 rounded-full bg-yellow-500 cursor-grab" />
          <motion.div drag dragConstraints={ref} whileDrag={{ scale: 1.1 }} dragElastic={0.2} className="w-4 h-4 rounded-full bg-green-500 cursor-grab" />
          <motion.div drag dragConstraints={ref} whileDrag={{ scale: 1.1 }} dragElastic={0.2} className="w-4 h-4 rounded-full bg-blue-500 cursor-grab" />
        </div>

        {/* Code Slash Icon */}
        <BsCodeSlash className="absolute top-2 right-2" />

        {/* Code Editor */}
        <div className="flex border-t">
          {/* Line Numbers */}
          <aside className="w-6 md:w-6 sm:w-4 text-right pr-2 pt-4 text-black dark:text-white border-r border-gray-400 dark:border-gray-600 bg-transparent  ">
            {value.split('\n').map((_, index) => (
              <div key={index}>{index + 1}</div>
            ))}
          </aside>

          {/* Textarea */}
          <textarea
            value={value}
            placeholder="Enter code here"
            onChange={(e) => setValue(e.target.value)}
            rows={20}
            className="w-full mr-2 min-h-[300px] text-sm p-4 focus:outline-none bg-neutral-2 dark:bg-black font-normal placeholder:text-gray-900 dark:placeholder:text-gray-500 dark:text-white dark:caret-white"
            spellCheck="false"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
