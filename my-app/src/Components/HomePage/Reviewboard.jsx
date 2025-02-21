import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import testimony from "../../List/testimony";
import "../../Styles/HomePage/ReviewBoard.css";

const getResponsiveNotes = (width) => {
    if (width < 396) {
        return [
          { id: 1, top: "35vh", left: "24%" },
          { id: 2, top: "40vh", left: "24%" },
          { id: 3, top: "45vh", left: "24%" },
          { id: 4, top: "50vh", left: "25%" },
        ];
        }
    else if (width < 480) {
        return [
          { id: 1, top: "33vh", left: "24%" },
          { id: 2, top: "38vh", left: "24%" },
          { id: 3, top: "43vh", left: "24%" },
          { id: 4, top: "50vh", left: "25%" },
        ];
        }
    else if (width < 593) {
        return [
          { id: 1, top: "29vh", left: "24%" },
          { id: 2, top: "36vh", left: "24%" },
          { id: 3, top: "43vh", left: "24%" },
          { id: 4, top: "50vh", left: "25%" },
        ];
        }
    else if (width < 677) {
    return [
        { id: 1, top: "24vh", left: "24%" },
        { id: 2, top: "32vh", left: "24%" },
        { id: 3, top: "40vh", left: "24%" },
        { id: 4, top: "50vh", left: "25%" },
    ];
    } else if (width < 727) {
    return [
        { id: 1, top: "22vh", left: "24%" },
        { id: 2, top: "31vh", left: "24%" },
        { id: 3, top: "40vh", left: "24%" },
        { id: 4, top: "50vh", left: "25%" },
    ];
    }else if (width < 769) {
    return [
      { id: 1, top: "20vh", left: "24%" },
      { id: 2, top: "30vh", left: "24%" },
      { id: 3, top: "40vh", left: "24%" },
      { id: 4, top: "50vh", left: "25%" },
    ];
    } else if (width < 868) {
    return [
      { id: 1, top: "16vh", left: "24%" },
      { id: 2, top: "27vh", left: "24%" },
      { id: 3, top: "38vh", left: "24%" },
      { id: 4, top: "50vh", left: "25%" },
    ];
    } else if (width < 991) {
    return [
      { id: 1, top: "13vh", left: "24%" },
      { id: 2, top: "25vh", left: "24%" },
      { id: 3, top: "38vh", left: "24%" },
      { id: 4, top: "50vh", left: "24%" },
    ];
  } 
    else if (width < 997) {
    return [
      { id: 1, top: "17vh", left: "24%" },
      { id: 2, top: "28vh", left: "24%" },
      { id: 3, top: "38vh", left: "24%" },
      { id: 4, top: "50vh", left: "25%" },
    ];
    } else if (width < 1024) {
    return [
      { id: 1, top: "11vh", left: "24%" },
      { id: 2, top: "23vh", left: "24%" },
      { id: 3, top: "38vh", left: "24%" },
      { id: 4, top: "50vh", left: "24%" },
    ];
  }
  return [
    { id: 1, top: "8vh", left: "24%" },
    { id: 2, top: "23vh", left: "24%" },
    { id: 3, top: "37vh", left: "24%" },
    { id: 4, top: "50vh", left: "24%" },
  ];
};

const ReviewBoard = () => {
  const [selectedNote, setSelectedNote] = useState(null);
  const [notes, setNotes] = useState(getResponsiveNotes(window.innerWidth));

  useEffect(() => {
    const handleResize = () => {
      setNotes(getResponsiveNotes(window.innerWidth)); // Update notes state dynamically
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="review-board-container">
      <img src="/Images/ReviewBoard.png" alt="Review Board" className="review-board-image" />

      {notes.map((note, index) => (
        <motion.div
          key={note.id}
          className="sticky-note"
          style={{ top: note.top, left: note.left }}
          onClick={() => setSelectedNote(index)}
          whileHover={{ scale: 1.1 }}
        />
      ))}

    <AnimatePresence>
    {selectedNote !== null && (
        <motion.div
        className="popup-container"
        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: -3 }}
        exit={{ opacity: 0, scale: 0.5, rotate: -10 }}
        >
        <p className="popup-text">
            {testimony[selectedNote] || "No review available"}
        </p>
        <button className="close-button" onClick={() => setSelectedNote(null)}>
            X
        </button>
        </motion.div>
    )}
    </AnimatePresence>
    </div>
  );
};

export default ReviewBoard;
