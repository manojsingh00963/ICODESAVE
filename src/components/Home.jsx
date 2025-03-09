import React, { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react';
import { FaFileCode } from "react-icons/fa6";
import { MdEditRoad } from "react-icons/md";
import { BsCodeSlash } from "react-icons/bs";
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateToPastes, addToPastes } from '../redux/features/pasteSlice';

const Home = () => {
  const [tittle, setTittle] = useState('');
  const [value, setValue] = useState('');
  const { pasteId } = useParams(); // ✅ Corrected useParams() for dynamic routes
  const allPastes = useSelector((state) => state.pastes.pastes);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ Added navigate function

  const ref = useRef(null);

  const createPaste = () => {
    const paste = {
      tittle,
      content: value,
      id: pasteId || Date.now().toString(36),
      createdAt: new Date().toISOString(),
    };

    if (pasteId) {
      // update
      dispatch(updateToPastes(paste));
    } else {
      // create
      dispatch(addToPastes(paste));
    }

    // After creation or updation, redirect to the paste list
    setTittle('');
    setValue('');
    navigate('/paste'); // ✅ Redirects to paste list after saving
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
    <div className=' mt-14 pb-10 flex flex-col container mx-auto place-content-center ' >
      <div className="flex gap-2 justify-center ">
        <input
          className="w-[45%] border rounded mt-10 pl-4"
          type="text"
          placeholder="Enter title here"
          value={tittle}
          onChange={(e) => setTittle(e.target.value)}
        />
        <button onClick={createPaste} className="p-2 border rounded mt-10 cursor-pointer ">
          {pasteId ? <MdEditRoad /> : <FaFileCode />}
        </button>
      </div>

      <div className=' relative border border-t-4 mt-4 mx-auto justify-center ' >
        <div ref={ref} className="color-round flex p-2 gap-0.5 cursor-grab ">
          <motion.div drag dragConstraints={ref} whileDrag={{scale:1.1}} dragElastic={0.2} className=" z-10 round w-5 h-5 rounded-full bg-red-500 "></motion.div>
          <motion.div drag dragConstraints={ref} whileDrag={{scale:1.1}} dragElastic={0.2} className=" z-10 round w-5 h-5 rounded-full bg-yellow-500 "></motion.div>
          <motion.div drag dragConstraints={ref} whileDrag={{scale:1.1}} dragElastic={0.2} className=" z-10 round w-5 h-5 rounded-full bg-green-500 "></motion.div>
          <motion.div drag dragConstraints={ref} whileDrag={{scale:1.1}} dragElastic={0.2} className=" z-10 round w-5 h-5 rounded-full bg-blue-500 "></motion.div>
        </div>
          <BsCodeSlash className=' absolute right-2 top-2 cursor-none ' />

        <textarea
          className=" border-t min-w-[500px] p-4"
          value={value}
          placeholder="Enter code here"
          onChange={(e) => setValue(e.target.value)}
          rows={20}
        ></textarea>
      </div>
    </div>
  );
};

export default Home;
