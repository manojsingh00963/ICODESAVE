import React, { useRef } from 'react';
import { FaCameraRetro } from "react-icons/fa";
import { useParams} from 'react-router-dom';
import { useSelector} from 'react-redux';
import { toast } from 'react-toastify';
import html2canvas from 'html2canvas';

const ViewPaste = () => {
  const { pasteId } = useParams();
  const pastes = useSelector((state) => state.pastes.pastes);
  const paste = pastes.find((p) => p.id === pasteId);
  const pasteRef = useRef();

  if (!paste) {
    toast.info('No Paste found!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    return null; // Return null if no paste is found
  }

  const handleSnapshot = () => {
    if (pasteRef.current) {
      html2canvas(pasteRef.current).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'paste-screenshot.png';
        link.click();
        toast.success("Screenshot taken!");
      }).catch((error) => {
        console.error("Error capturing screenshot:", error);
        toast.error("Failed to take screenshot.");
      });
    }
  };

  return (
    <div className="mt-28 flex justify-center">
      <div ref={pasteRef} className="min-w-[350px] min-h-[350px] flex flex-col items-center p-4 border rounded-lg shadow-md bg-gray-900 text-white">
        <h2 className="text-xl font-semibold">{paste.tittle}</h2>
        <p className="mt-2 whitespace-pre-line">{paste.content}</p>
          <button onClick={handleSnapshot} className="absolute top-4 right-6 flex items-center gap-2 px-4 py-2 border rounded bg-indigo-900 text-white hover:bg-indigo-950 cursor-pointer transition">
            <FaCameraRetro />
          </button>
      </div>
    </div>
  );
};

export default ViewPaste;