import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaCopy, FaEdit, FaEye, FaShareSquare } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import { removeTopastes } from '../redux/features/pasteSlice';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';


const Paste = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const pastes = useSelector((state) => state.pastes.pastes);
  const dispatch = useDispatch();

  const filteredData = pastes.filter((paste) =>
    paste.tittle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Delete function
  const handleDelete = (pasteId) => {
    dispatch(removeTopastes(pasteId));
  };

  // ✅ Share function
  const handleShare = (pasteId) => {
    const url = `${window.location.origin}/view/${pasteId}`;
    navigator.clipboard.writeText(url);
    toast.success('Paste link copied to clipboard!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      // transition: Bounce,
    });
  };

  return (
    <div>
<div className="flex items-center gap-2 mb-4">
  <div className="relative">
    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    <input
      type="text"
      placeholder="Search pastes..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="border min-w-[600px] rounded-2xl p-2 pl-10" // Added padding for icon
    />
  </div>
  <button
    onClick={() => console.log('Searching:', searchTerm)}
    className="px-4 py-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600"
  >
    Search
  </button>
</div>

      <div>
        {filteredData.map((paste) => (
          <div key={paste.id} className="relative border rounded p-4 mb-2">
            <h3>{paste.tittle}</h3>
            <p>{paste.content.substring(0, 100)}...</p>

            <div className="flex flex-row gap-4 place-content-center m-2">
              <NavLink to={`/paste/${paste.id}`}>
                <FaEdit className="cursor-pointer text-[16px]" />
              </NavLink>

              <NavLink to={`/view/${paste.id}`}>
                <FaEye className="cursor-pointer text-[16px]" />
              </NavLink>

              <MdDeleteForever
                className="cursor-pointer text-[16px] text-red-500 hover:text-red-700"
                onClick={() => handleDelete(paste.id)}
              />

              <FaShareSquare
                className="cursor-pointer text-[16px] text-blue-500 hover:text-blue-700"
                onClick={() => handleShare(paste.id)}
              />

              <FaCopy
                className="absolute top-2 right-2 hover:drop-shadow-2xl hover:backdrop-blur-lg hover:shadow-blue-400 cursor-pointer text-[16px]"
                onClick={() => {
                  navigator.clipboard.writeText(paste.content);
                  toast.success('Copied to clipboard');
                }}
              />
            </div>
            <cite>{paste.createdAt}</cite>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Paste;
// 1:22