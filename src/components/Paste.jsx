import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaCopy, FaEdit, FaEye, FaShareSquare, FaSearch } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import { removeTopastes } from '../redux/features/pasteSlice';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const Paste = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const pastes = useSelector((state) => state.pastes.pastes);
  const dispatch = useDispatch();

  const filteredData = pastes.filter((paste) =>
    paste.tittle.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleDelete = (pasteId) => {
    dispatch(removeTopastes(pasteId));
  };

  
  const handleShare = (pasteId) => {
    const url = `${window.location.origin}/view/${pasteId}`;
    navigator.clipboard.writeText(url);
    toast.success('Paste link copied to clipboard!', { autoClose: 3000 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='mt-24 mx-auto max-w-6xl px-4 selection:bg-red-500 selection:text-yellow-400  '
    >
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="relative w-full max-w-md">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search pastes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded-md p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <motion.div 
        className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
        whileInView={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
      >
        {filteredData.map((paste) => (
          <motion.div 
            key={paste.id} 
            className="relative border rounded-lg p-4 shadow-md  hover:shadow-lg transition duration-300"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className='text-sm text-indigo-100 font-semibold border-b pb-2 mb-2'>{paste.tittle}</h3>
            <p className='text-xs text-sky-200 '>{paste.content.substring(0, 100)}...</p>

            <div className="flex justify-between items-center mt-3 text-slate-200">
              <div className="flex gap-3 pb-2 ">
                <NavLink to={`/paste/${paste.id}`}><FaEdit className="cursor-pointer hover:text-indigo-600" /></NavLink>
                <NavLink to={`/view/${paste.id}`}><FaEye className="cursor-pointer hover:text-green-600" /></NavLink>
                <MdDeleteForever 
                  className="cursor-pointer text-red-500 hover:text-red-700" 
                  onClick={() => handleDelete(paste.id)} 
                />
                <FaShareSquare 
                  className="cursor-pointer text-blue-500 hover:text-blue-700" 
                  onClick={() => handleShare(paste.id)} 
                />
              </div>
              <FaCopy
                className="cursor-pointer text-gray-400 hover:text-gray-600"
                onClick={() => {
                  navigator.clipboard.writeText(paste.content);
                  toast.success('Copied to clipboard');
                }}
              />
            </div>
            <cite className='absolute left-2 bottom-2 text-xs text-gray-400'>{paste.createdAt.substring(0, 10)}</cite>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Paste;
