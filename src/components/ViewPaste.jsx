import React, { useRef, useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { BsCodeSlash } from "react-icons/bs";
import { FaCameraRetro, FaCopy, FaShareSquare } from "react-icons/fa";
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { AiOutlinePrinter } from "react-icons/ai";
// import html2canvas from 'html2canvas';

const ViewPaste = () => {
  const { pasteId } = useParams();
  const navigate = useNavigate();
  const notes = useSelector((state) => state.notes.notes);

  const paste = notes.find((note) => note._id === pasteId); //Find paste by ID
  const pasteRef = useRef(null);
  const [lines, setLines] = useState([]);


  //Load paste content
  useEffect(() => {
    if (paste) {
      setLines(paste.content ? paste.content.split('\n') : []);
    } else {
      toast.error('Paste not found!');
      navigate('/paste'); //Redirect if paste not found
    }
  }, [paste, navigate]);

  //Handle Screenshot
  // const handleSnapshot = async () => {
  //   try {
  //     if (!pasteRef.current) return;
  //     const canvas = await html2canvas(pasteRef.current, {
  //       backgroundColor: '#1a202c', //Dark background to match theme
  //       scale: 2, //Higher resolution
  //       useCORS: true, //Handle cross-origin issues
  //     });
  //     const link = document.createElement('a');
  //     link.href = canvas.toDataURL('image/png');
  //     link.download = `${paste.title || 'paste'}-screenshot.png`;
  //     link.click();
  //     toast.success('Screenshot saved successfully!');
  //   } catch (error) {
  //     console.error('Error capturing screenshot:', error);
  //     toast.error('Failed to take screenshot.');
  //   }
  // };

  // print content

  const handlePrint = () => {
    if (!paste) {
      toast.error("No content available to print!");
      return;
    }
  
    const printWindow = window.open("", "_blank", "width=800,height=1000");
  
    if (!printWindow) {
      toast.error("Failed to open print window.");
      return;
    }
  
    printWindow.document.write(`
      <html>
        <head>
          <title>${paste.title || "Print"}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              background: #1a202c;
              color: #fff;
            }
            pre {
              white-space: pre-wrap;
              background: #2d3748;
              padding: 10px;
              border-radius: 5px;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <h2>${paste.title || "Untitled Paste"}</h2>
          <pre>${paste.content}</pre>
        </body>
      </html>
    `);
  
    printWindow.document.close();
  
    // Use setTimeout to delay printing and prevent auto-close
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500); // Wait 500ms before printing to ensure full load
  };
  
  
  

  //Handle Copy
  const handleCopy = () => {
    if (paste?.content) {
      navigator.clipboard.writeText(paste.content);
      toast.success('Copied to clipboard!');
    }
  };

  //Handle Share
  const handleShare = () => {
    const url = `${window.location.origin}/view/${pasteId}`;
    navigator.clipboard.writeText(url);
    toast.success(' link copied to clipboard!');
  };

  //If paste not found, prevent rendering
  if (!paste) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-28 flex justify-center px-4"
    >
      {/*Paste Content Container */}
      <div
        ref={pasteRef}
        className="relative w-full max-w-3xl mx-auto flex flex-col p-4 border border-gray-700 rounded-lg shadow-md bg-gray-900 text-white overflow-hidden"
      >
        {/*Title */}
        <h2 className="text-lg sm:text-xl font-semibold text-center mb-4 truncate">
          {paste.title}
        </h2>

        {/*Content */}
        <div className="border-t border-gray-600 mt-2">
          {/*Code Icon */}
          <BsCodeSlash className="absolute right-4 top-4 text-gray-400" />

          <div className="relative flex">
            {/*Line Numbers */}
            <aside className="w-10 text-right pr-2 pt-2 text-gray-400 border-r border-gray-600">
              {lines.map((_, index) => (
                <div key={index} className="leading-6">
                  {index + 1}
                </div>
              ))}
            </aside>

            {/*Code Content */}
            <pre className="whitespace-pre-wrap p-4 flex-1 overflow-x-auto text-sm text-gray-300">
              {lines.join('\n')}
            </pre>
          </div>
        </div>
      </div>

      {/*Action Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3">
        {/*Screenshot Button */}
        <motion.button
          // onClick={handleSnapshot}
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 border border-indigo-500 rounded bg-indigo-900 text-white hover:bg-indigo-700 transition cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
        <AiOutlinePrinter />
          {/* <FaCameraRetro /> */}
        </motion.button>

        {/*Share Button */}
        <motion.button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 border border-purple-500 rounded bg-purple-900 text-white hover:bg-purple-700 transition cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaShareSquare />
        </motion.button>

        {/*Copy Button */}
        <motion.button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 border border-yellow-500 rounded bg-yellow-900 text-white hover:bg-yellow-700 transition cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaCopy />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ViewPaste;
