import React, { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
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
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='mt-22 pb-10 flex flex-col container mx-auto place-content-center'>

      <div className="flex gap-2 justify-center">
        <input
          className=" z-10 w-[45%] h-[15%] md:w-[40%] sm:[w-40%] border rounded p-2 pl-4 focus:ring-0 bg-neutral-2 dark:bg-black font-normal placeholder:text-gray-300 focus:outline-none resize-none leading-tight dark:text-white dark:caret-white"
          type="text"
          placeholder="Enter title here"
          value={tittle}
          onChange={(e) => setTittle(e.target.value)}

        />
        <button onClick={createPaste} className={` z-10 bg-transparent p-2 text-xl hover:text-[green] border rounded cursor-pointer`}>
          {pasteId ? <MdEditRoad /> : <FaFileCode />}
        </button>
      </div>

      <div className='relative bg-transparent border border-t-4 mt-4 mx-auto justify-center'>
        <div ref={ref} className="color-round bg-transparent flex p-2 gap-0.5 cursor-none">
          <motion.div drag dragConstraints={ref} whileDrag={{ scale: 1.1 }} dragElastic={0.2} className="cursor-grab z-10 round w-5 h-5 rounded-full bg-red-500"></motion.div>
          <motion.div drag dragConstraints={ref} whileDrag={{ scale: 1.1 }} dragElastic={0.2} className="cursor-grab z-10 round w-5 h-5 rounded-full bg-yellow-500"></motion.div>
          <motion.div drag dragConstraints={ref} whileDrag={{ scale: 1.1 }} dragElastic={0.2} className="cursor-grab z-10 round w-5 h-5 rounded-full bg-green-500"></motion.div>
          <motion.div drag dragConstraints={ref} whileDrag={{ scale: 1.1 }} dragElastic={0.2} className="cursor-grab z-10 round w-5 h-5 rounded-full bg-blue-500"></motion.div>
        </div>
        <BsCodeSlash className='bg-transparent absolute right-2 top-2 cursor-none' />

        <div className="relative flex border-t-2 ">
          <aside className="w-6 text-right pr-2 pt-4 text-black dark:text-white border-r border-gray-400 dark:border-gray-600 bg-transparent ">
            {value.split('\n').map((_, index) => (
              <div key={index}>{index + 1}</div>
            ))}
          </aside>
          <textarea
            value={value}
            placeholder="Enter code here"
            onChange={(e) => setValue(e.target.value)}
            rows={20}
            className="min-w-[500px] p-4 min-h-[300px] md:w-[50%] sm:w-[50%] text-sm overflow-y-auto rounded-none focus:ring-0 bg-neutral-2 dark:bg-black font-normal placeholder:text-gray-900 dark:placeholder:text-gray-500 focus:outline-none resize-none leading-tight dark:text-white dark:caret-white pl-4 bg-[linear-gradient(white_14px,transparent_1px)] dark:bg-[linear-gradient(black_14px,transparent_1px)] bg-[size:100%_15px]"
            spellCheck="false"
            required >
          </textarea>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
