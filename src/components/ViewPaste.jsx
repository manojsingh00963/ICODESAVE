import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeTopastes } from '../redux/features/pasteSlice';
import { toast } from 'react-toastify';
import { FaShareSquare } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';

const ViewPaste = () => {
  const { pasteId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pastes = useSelector((state) => state.pastes.pastes);

  const paste = pastes.find((p) => p.id === pasteId);

  if (!paste) {
    return toast.info('No Paste found!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      // transition: Bounce,
      });;
  }

  // ✅ Delete function
  const handleDelete = () => {
    dispatch(removeTopastes(pasteId));
    toast.success("Paste deleted successfully!");
    navigate('/paste'); // Redirect to paste list
  };

  // ✅ Share function
  const handleShare = () => {
    const url = `${window.location.origin}/view/${pasteId}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold">{paste.tittle}</h2>
      <p className="mt-2 whitespace-pre-line">{paste.content}</p>
      <cite className="block mt-4 text-gray-500">Created At: {paste.createdAt}</cite>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 border rounded bg-blue-500 text-white hover:bg-blue-600">
          <FaShareSquare /> Share
        </button>
        <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 border rounded bg-red-500 text-white hover:bg-red-600">
          <MdDeleteForever /> Delete
        </button>
      </div>
    </div>
  );
};

export default ViewPaste;
// 1:22