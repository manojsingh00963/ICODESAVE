import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaCopy, FaEdit, FaEye, FaShareSquare, FaSearch } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import { deleteNote, getNotes } from '../redux/features/noteSlice';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const Paste = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.notes.notes);

  // Fetch notes from Redux state
  useEffect(() => {
    dispatch(getNotes());
  }, [dispatch]);

  // Filter notes based on search term
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      dispatch(deleteNote(id));
    }
  };

  // Handle share
  const handleShare = (id) => {
    const url = `${window.location.origin}/view/${id}`;
    navigator.clipboard.writeText(url);
    toast.success('Paste link copied to clipboard!');
  };

  // Handle copy
  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-24 mx-auto max-w-7xl px-4"
    >
      {/*Search Input */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-full max-w-lg">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded-md p-2 pl-10 focus:outline-none bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/*Notes Grid */}
      <div className="grid mx-auto w-[80vw] grid-cols-1 md:grid-cols-3 gap-4">
        {filteredNotes.map((note) => (
          <motion.div
            key={note._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="relative p-4 border border-gray-700 rounded-lg shadow-md bg-gray-800 text-white"
          >
            {/*Title */}
            <h3 className="text-lg font-bold truncate">{note.title}</h3>
            
            {/*Content Preview */}
            <p className="text-gray-400 truncate">{note.content}</p>
<code className=' absolute right-2 top-2 underline underline-offset-2 text-blue-200 ' >{note.tag}</code>
            {/*Date */}
            <cite className="block text-gray-500 text-sm mt-2">
              {new Date(note.createdAt).toLocaleDateString()}
            </cite>

            {/*Actions */}
            <div className="flex items-center gap-3 mt-3">
              {/* Edit */}
              <NavLink to={`/paste/${note._id}`}>
                <FaEdit
                  className="cursor-pointer hover:text-blue-400 transition"
                  title="Edit"
                />
              </NavLink>

              {/* View */}
              <NavLink to={`/view/${note._id}`}>
                <FaEye
                  className="cursor-pointer hover:text-green-400 transition"
                  title="View"
                />
              </NavLink>

              {/* Delete */}
              <MdDeleteForever
                onClick={() => handleDelete(note._id)}
                className="cursor-pointer hover:text-red-400 transition"
                title="Delete"
              />

              {/* Share */}
              <FaShareSquare
                onClick={() => handleShare(note._id)}
                className="cursor-pointer hover:text-purple-400 transition"
                title="Share"
              />

              {/* Copy */}
              <FaCopy
                onClick={() => handleCopy(note.content)}
                className=" absolute bottom-4 right-2 cursor-pointer hover:text-yellow-400 transition"
                title="Copy"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/*No Notes Message */}
      {filteredNotes.length === 0 && (
        <p className="text-center text-gray-400 mt-4">No notes found.</p>
      )}
    </motion.div>
  );
};

export default Paste;
